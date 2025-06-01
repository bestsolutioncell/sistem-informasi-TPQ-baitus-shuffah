import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert, Linking } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { APP_CONFIG } from '../config/config';

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  type: string;
  data?: any;
  timestamp: number;
  read: boolean;
}

class NotificationService {
  private isInitialized = false;
  private fcmToken: string | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Request permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('Push notification permission denied');
        return;
      }

      // Get FCM token
      await this.getFCMToken();

      // Configure local notifications
      this.configureLocalNotifications();

      // Set up message handlers
      this.setupMessageHandlers();

      this.isInitialized = true;
      console.log('Notification service initialized successfully');
    } catch (error) {
      console.error('Error initializing notification service:', error);
    }
  }

  private async getFCMToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      this.fcmToken = token;
      
      // Store token locally
      await AsyncStorage.setItem(APP_CONFIG.STORAGE_KEYS.NOTIFICATION_TOKEN, token);
      
      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  private configureLocalNotifications(): void {
    PushNotification.configure({
      onRegister: (token) => {
        console.log('Local notification token:', token);
      },

      onNotification: (notification) => {
        console.log('Local notification received:', notification);
        
        if (notification.userInteraction) {
          // User tapped on notification
          this.handleNotificationTap(notification);
        }
      },

      onAction: (notification) => {
        console.log('Notification action:', notification);
      },

      onRegistrationError: (err) => {
        console.error('Local notification registration error:', err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Create notification channels for Android
    if (Platform.OS === 'android') {
      this.createNotificationChannels();
    }
  }

  private createNotificationChannels(): void {
    const channels = [
      {
        channelId: APP_CONFIG.NOTIFICATION.CHANNELS.GENERAL,
        channelName: 'General Notifications',
        channelDescription: 'General app notifications',
        importance: 4,
        vibrate: true,
      },
      {
        channelId: APP_CONFIG.NOTIFICATION.CHANNELS.HAFALAN,
        channelName: 'Hafalan Notifications',
        channelDescription: 'Hafalan progress and reminders',
        importance: 4,
        vibrate: true,
      },
      {
        channelId: APP_CONFIG.NOTIFICATION.CHANNELS.PAYMENT,
        channelName: 'Payment Notifications',
        channelDescription: 'Payment reminders and confirmations',
        importance: 4,
        vibrate: true,
      },
      {
        channelId: APP_CONFIG.NOTIFICATION.CHANNELS.ATTENDANCE,
        channelName: 'Attendance Notifications',
        channelDescription: 'Attendance reminders and updates',
        importance: 4,
        vibrate: true,
      },
      {
        channelId: APP_CONFIG.NOTIFICATION.CHANNELS.ANNOUNCEMENT,
        channelName: 'Announcements',
        channelDescription: 'Important announcements from TPQ',
        importance: 5,
        vibrate: true,
      },
    ];

    channels.forEach(channel => {
      PushNotification.createChannel(channel, () => {
        console.log(`Channel ${channel.channelId} created`);
      });
    });
  }

  private setupMessageHandlers(): void {
    // Handle background messages
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
      await this.processRemoteMessage(remoteMessage);
    });

    // Handle foreground messages
    messaging().onMessage(async (remoteMessage) => {
      console.log('Message received in foreground!', remoteMessage);
      await this.processRemoteMessage(remoteMessage);
      
      // Show local notification when app is in foreground
      this.showLocalNotification(remoteMessage);
    });

    // Handle notification opened app
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification caused app to open from background state:', remoteMessage);
      this.handleNotificationTap(remoteMessage);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage);
          this.handleNotificationTap(remoteMessage);
        }
      });

    // Handle token refresh
    messaging().onTokenRefresh(async (token) => {
      console.log('FCM token refreshed:', token);
      this.fcmToken = token;
      await AsyncStorage.setItem(APP_CONFIG.STORAGE_KEYS.NOTIFICATION_TOKEN, token);
      // TODO: Send updated token to server
    });
  }

  private async processRemoteMessage(remoteMessage: FirebaseMessagingTypes.RemoteMessage): Promise<void> {
    try {
      const notificationData: NotificationData = {
        id: remoteMessage.messageId || Date.now().toString(),
        title: remoteMessage.notification?.title || 'TPQ Baitus Shuffah',
        body: remoteMessage.notification?.body || '',
        type: remoteMessage.data?.type || 'general',
        data: remoteMessage.data,
        timestamp: Date.now(),
        read: false,
      };

      // Store notification locally
      await this.storeNotification(notificationData);
    } catch (error) {
      console.error('Error processing remote message:', error);
    }
  }

  private showLocalNotification(remoteMessage: FirebaseMessagingTypes.RemoteMessage): void {
    const channelId = this.getChannelIdFromType(remoteMessage.data?.type);
    
    PushNotification.localNotification({
      channelId,
      title: remoteMessage.notification?.title || 'TPQ Baitus Shuffah',
      message: remoteMessage.notification?.body || '',
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      vibrate: true,
      vibration: 300,
      userInfo: remoteMessage.data,
    });
  }

  private getChannelIdFromType(type?: string): string {
    switch (type) {
      case APP_CONFIG.NOTIFICATION.TYPES.HAFALAN_REMINDER:
        return APP_CONFIG.NOTIFICATION.CHANNELS.HAFALAN;
      case APP_CONFIG.NOTIFICATION.TYPES.PAYMENT_DUE:
        return APP_CONFIG.NOTIFICATION.CHANNELS.PAYMENT;
      case APP_CONFIG.NOTIFICATION.TYPES.ATTENDANCE_REMINDER:
        return APP_CONFIG.NOTIFICATION.CHANNELS.ATTENDANCE;
      case APP_CONFIG.NOTIFICATION.TYPES.NEW_ANNOUNCEMENT:
        return APP_CONFIG.NOTIFICATION.CHANNELS.ANNOUNCEMENT;
      default:
        return APP_CONFIG.NOTIFICATION.CHANNELS.GENERAL;
    }
  }

  private handleNotificationTap(notification: any): void {
    const { data } = notification;
    
    if (data?.screen) {
      // Navigate to specific screen
      // This would be handled by your navigation service
      console.log('Navigate to screen:', data.screen);
    }
    
    if (data?.url) {
      // Open URL
      Linking.openURL(data.url);
    }
  }

  private async storeNotification(notification: NotificationData): Promise<void> {
    try {
      const existingNotifications = await this.getStoredNotifications();
      const updatedNotifications = [notification, ...existingNotifications].slice(0, 100); // Keep only last 100
      
      await AsyncStorage.setItem(
        'stored_notifications',
        JSON.stringify(updatedNotifications)
      );
    } catch (error) {
      console.error('Error storing notification:', error);
    }
  }

  async getStoredNotifications(): Promise<NotificationData[]> {
    try {
      const stored = await AsyncStorage.getItem('stored_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting stored notifications:', error);
      return [];
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const notifications = await this.getStoredNotifications();
      const updatedNotifications = notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      );
      
      await AsyncStorage.setItem(
        'stored_notifications',
        JSON.stringify(updatedNotifications)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  async clearAllNotifications(): Promise<void> {
    try {
      await AsyncStorage.removeItem('stored_notifications');
      PushNotification.cancelAllLocalNotifications();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }

  async scheduleLocalNotification(
    title: string,
    message: string,
    date: Date,
    data?: any
  ): Promise<void> {
    PushNotification.localNotificationSchedule({
      title,
      message,
      date,
      playSound: true,
      soundName: 'default',
      userInfo: data,
      channelId: APP_CONFIG.NOTIFICATION.CHANNELS.GENERAL,
    });
  }

  async cancelScheduledNotification(notificationId: string): Promise<void> {
    PushNotification.cancelLocalNotifications({ id: notificationId });
  }

  async getBadgeCount(): Promise<number> {
    const notifications = await this.getStoredNotifications();
    return notifications.filter(n => !n.read).length;
  }

  async updateBadgeCount(): Promise<void> {
    const count = await this.getBadgeCount();
    PushNotification.setApplicationIconBadgeNumber(count);
  }

  getFCMToken(): string | null {
    return this.fcmToken;
  }

  async checkPermission(): Promise<boolean> {
    const authStatus = await messaging().hasPermission();
    return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
           authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  }

  async requestPermission(): Promise<boolean> {
    try {
      const authStatus = await messaging().requestPermission();
      return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
             authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async openSettings(): Promise<void> {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  }
}

export default new NotificationService();
