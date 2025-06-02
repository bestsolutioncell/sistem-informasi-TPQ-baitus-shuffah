import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

// Screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import HafalanListScreen from '../screens/hafalan/HafalanListScreen';
import AttendanceListScreen from '../screens/attendance/AttendanceListScreen';
import PaymentListScreen from '../screens/payment/PaymentListScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

export type BottomTabParamList = {
  Dashboard: undefined;
  HafalanList: undefined;
  AttendanceList: undefined;
  PaymentList: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
              break;
            case 'HafalanList':
              iconName = focused ? 'book-open-page-variant' : 'book-open-page-variant-outline';
              break;
            case 'AttendanceList':
              iconName = focused ? 'calendar-check' : 'calendar-check-outline';
              break;
            case 'PaymentList':
              iconName = focused ? 'credit-card' : 'credit-card-outline';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Amiri-Regular',
          marginTop: -5,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: 'Amiri-Bold',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Beranda',
        }}
      />
      <Tab.Screen 
        name="HafalanList" 
        component={HafalanListScreen}
        options={{
          title: 'Hafalan Saya',
          tabBarLabel: 'Hafalan',
        }}
      />
      <Tab.Screen 
        name="AttendanceList" 
        component={AttendanceListScreen}
        options={{
          title: 'Kehadiran',
          tabBarLabel: 'Absensi',
        }}
      />
      <Tab.Screen 
        name="PaymentList" 
        component={PaymentListScreen}
        options={{
          title: 'Pembayaran',
          tabBarLabel: 'Bayar',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profil Saya',
          tabBarLabel: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
}
