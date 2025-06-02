import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  useTheme,
  Avatar,
  Chip,
  ProgressBar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { BottomTabParamList } from '../../navigation/BottomTabNavigator';
import ApiService from '../../services/ApiService';

type DashboardNavigationProp = BottomTabNavigationProp<BottomTabParamList, 'Dashboard'>;

const { width } = Dimensions.get('window');

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  nis?: string;
  halaqah?: string;
  musyrif?: string;
}

interface DashboardStats {
  hafalanProgress: number;
  attendanceRate: number;
  currentSurah: string;
  nextTarget: string;
  recentGrade: number;
  totalHafalan: number;
}

export default function DashboardScreen() {
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const theme = useTheme();
  const navigation = useNavigation<DashboardNavigationProp>();

  useEffect(() => {
    loadUserData();
    loadDashboardStats();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await SecureStore.getItemAsync('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadDashboardStats = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockStats: DashboardStats = {
        hafalanProgress: 75,
        attendanceRate: 95,
        currentSurah: 'Al-Baqarah',
        nextTarget: 'Ali Imran',
        recentGrade: 88,
        totalHafalan: 15,
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadUserData(), loadDashboardStats()]);
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return theme.colors.primary;
    if (grade >= 80) return theme.colors.secondary;
    if (grade >= 70) return '#f59e0b';
    return theme.colors.error;
  };

  if (!user || !stats) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header with Gradient */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Avatar.Text
              size={60}
              label={user.name.charAt(0)}
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Text variant="headlineSmall" style={styles.greeting}>
                {getGreeting()}
              </Text>
              <Text variant="titleLarge" style={styles.userName}>
                {user.name}
              </Text>
              <View style={styles.userMeta}>
                <Chip
                  mode="outlined"
                  textStyle={styles.chipText}
                  style={styles.chip}
                >
                  {user.role}
                </Chip>
                {user.nis && (
                  <Chip
                    mode="outlined"
                    textStyle={styles.chipText}
                    style={styles.chip}
                  >
                    NIS: {user.nis}
                  </Chip>
                )}
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons
                name="book-open-page-variant"
                size={32}
                color={theme.colors.primary}
              />
              <Text variant="titleMedium" style={styles.statValue}>
                {stats.totalHafalan}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Hafalan Selesai
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons
                name="calendar-check"
                size={32}
                color={theme.colors.secondary}
              />
              <Text variant="titleMedium" style={styles.statValue}>
                {stats.attendanceRate}%
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Kehadiran
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons
                name="star"
                size={32}
                color={getGradeColor(stats.recentGrade)}
              />
              <Text variant="titleMedium" style={styles.statValue}>
                {stats.recentGrade}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Nilai Terakhir
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Progress Section */}
        <Card style={styles.progressCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Progress Hafalan
            </Text>
            
            <View style={styles.progressInfo}>
              <View style={styles.progressText}>
                <Text variant="bodyLarge">Sedang Menghafal:</Text>
                <Text variant="titleMedium" style={styles.currentSurah}>
                  {stats.currentSurah}
                </Text>
              </View>
              <Text variant="titleLarge" style={styles.progressPercentage}>
                {stats.hafalanProgress}%
              </Text>
            </View>
            
            <ProgressBar
              progress={stats.hafalanProgress / 100}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
            
            <Text variant="bodyMedium" style={styles.nextTarget}>
              Target Selanjutnya: {stats.nextTarget}
            </Text>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Aksi Cepat
            </Text>
            
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('HafalanList')}
                style={styles.actionButton}
                icon="book-open-page-variant"
              >
                Hafalan
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('AttendanceList')}
                style={styles.actionButton}
                icon="calendar-check"
              >
                Absensi
              </Button>
            </View>
            
            <View style={styles.actionButtons}>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('PaymentList')}
                style={styles.actionButton}
                icon="credit-card"
              >
                Pembayaran
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Profile')}
                style={styles.actionButton}
                icon="account"
              >
                Profil
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Activity */}
        <Card style={styles.activityCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Aktivitas Terbaru
            </Text>
            
            {[
              {
                icon: 'book-plus',
                title: 'Hafalan Baru Ditambahkan',
                subtitle: 'Al-Baqarah ayat 1-10',
                time: '2 jam lalu',
                color: theme.colors.primary,
              },
              {
                icon: 'calendar-check',
                title: 'Absensi Tercatat',
                subtitle: 'Halaqah Al-Fatihah',
                time: '1 hari lalu',
                color: theme.colors.secondary,
              },
              {
                icon: 'star',
                title: 'Nilai Hafalan',
                subtitle: 'Mendapat nilai 88',
                time: '2 hari lalu',
                color: '#f59e0b',
              },
            ].map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <MaterialCommunityIcons
                  name={activity.icon as any}
                  size={24}
                  color={activity.color}
                  style={styles.activityIcon}
                />
                <View style={styles.activityContent}>
                  <Text variant="bodyLarge" style={styles.activityTitle}>
                    {activity.title}
                  </Text>
                  <Text variant="bodyMedium" style={styles.activitySubtitle}>
                    {activity.subtitle}
                  </Text>
                  <Text variant="bodySmall" style={styles.activityTime}>
                    {activity.time}
                  </Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    marginTop: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  userDetails: {
    marginLeft: 16,
    flex: 1,
  },
  greeting: {
    color: 'white',
    opacity: 0.9,
  },
  userName: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  chipText: {
    color: 'white',
    fontSize: 12,
  },
  content: {
    padding: 16,
    marginTop: -20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 4,
  },
  progressCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    flex: 1,
  },
  currentSurah: {
    fontWeight: 'bold',
    color: '#0d9488',
  },
  progressPercentage: {
    fontWeight: 'bold',
    color: '#0d9488',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  nextTarget: {
    opacity: 0.7,
  },
  actionsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  activityCard: {
    marginBottom: 16,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityIcon: {
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontWeight: '500',
  },
  activitySubtitle: {
    opacity: 0.7,
    marginTop: 2,
  },
  activityTime: {
    opacity: 0.5,
    marginTop: 4,
  },
});
