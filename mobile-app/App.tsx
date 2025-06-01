import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import * as SecureStore from 'expo-secure-store';

// Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import HafalanScreen from './src/screens/hafalan/HafalanScreen';
import AttendanceScreen from './src/screens/attendance/AttendanceScreen';
import PaymentScreen from './src/screens/payment/PaymentScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import QRScannerScreen from './src/screens/qr/QRScannerScreen';
import VoiceRecorderScreen from './src/screens/voice/VoiceRecorderScreen';

// Navigation
import BottomTabNavigator from './src/navigation/BottomTabNavigator';

// Theme
import { theme } from './src/theme/theme';

// Types
export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  MainTabs: undefined;
  Hafalan: undefined;
  Attendance: undefined;
  Payment: undefined;
  Profile: undefined;
  QRScanner: undefined;
  VoiceRecorder: { hafalanId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts
        await Font.loadAsync({
          'Amiri-Regular': require('./assets/fonts/Amiri-Regular.ttf'),
          'Amiri-Bold': require('./assets/fonts/Amiri-Bold.ttf'),
        });

        // Check if user is logged in
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          setIsLoggedIn(true);
        }

        // Artificially delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer onReady={onLayoutRootView}>
        <StatusBar style="light" backgroundColor="#0d9488" />
        <Stack.Navigator
          initialRouteName={isLoggedIn ? "MainTabs" : "Login"}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0d9488',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontFamily: 'Amiri-Bold',
            },
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="MainTabs" 
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Hafalan" 
            component={HafalanScreen}
            options={{ 
              title: 'Detail Hafalan',
              headerBackTitle: 'Kembali'
            }}
          />
          <Stack.Screen 
            name="Attendance" 
            component={AttendanceScreen}
            options={{ 
              title: 'Absensi',
              headerBackTitle: 'Kembali'
            }}
          />
          <Stack.Screen 
            name="Payment" 
            component={PaymentScreen}
            options={{ 
              title: 'Pembayaran',
              headerBackTitle: 'Kembali'
            }}
          />
          <Stack.Screen 
            name="QRScanner" 
            component={QRScannerScreen}
            options={{ 
              title: 'Scan QR Code',
              headerBackTitle: 'Kembali'
            }}
          />
          <Stack.Screen 
            name="VoiceRecorder" 
            component={VoiceRecorderScreen}
            options={{ 
              title: 'Rekam Hafalan',
              headerBackTitle: 'Kembali'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
