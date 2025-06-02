import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  useTheme,
  Avatar,
  List,
  Switch,
  Divider,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  nis?: string;
  halaqah?: string;
  musyrif?: string;
  phone?: string;
  address?: string;
  parentName?: string;
  parentPhone?: string;
  joinDate: string;
  avatar?: string;
}

interface AppSettings {
  notifications: boolean;
  darkMode: boolean;
  autoSync: boolean;
  biometric: boolean;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    notifications: true,
    darkMode: false,
    autoSync: true,
    biometric: false,
  });
  
  const theme = useTheme();
  const navigation = useNavigation<ProfileNavigationProp>();

  useEffect(() => {
    loadUserProfile();
    loadAppSettings();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userData = await SecureStore.getItemAsync('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        // Mock additional profile data
        const fullProfile: UserProfile = {
          ...parsedUser,
          phone: '+62 812-3456-7890',
          address: 'Jl. Islamic Center No. 123, Jakarta Pusat',
          parentName: 'Bapak Ahmad Fauzi',
          parentPhone: '+62 811-2345-6789',
          joinDate: '2023-08-15',
        };
        setUser(fullProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadAppSettings = async () => {
    try {
      const savedSettings = await SecureStore.getItemAsync('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading app settings:', error);
    }
  };

  const saveAppSettings = async (newSettings: AppSettings) => {
    try {
      await SecureStore.setItemAsync('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving app settings:', error);
    }
  };

  const handleSettingChange = (key: keyof AppSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    saveAppSettings(newSettings);
  };

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar dari aplikasi?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync('userToken');
              await SecureStore.deleteItemAsync('userData');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Info', 'Fitur edit profil akan segera tersedia');
  };

  const handleChangePassword = () => {
    Alert.alert('Info', 'Fitur ubah password akan segera tersedia');
  };

  const handleAbout = () => {
    Alert.alert(
      'Tentang Aplikasi',
      'Rumah Tahfidz Mobile App\nVersi 1.0.0\n\nDikembangkan untuk memudahkan manajemen rumah tahfidz dengan teknologi modern.\n\n© 2024 Rumah Tahfidz Baitus Shuffah'
    );
  };

  const handleSupport = () => {
    Alert.alert(
      'Bantuan & Dukungan',
      'Jika Anda mengalami masalah atau membutuhkan bantuan:\n\n📧 Email: support@rumahtahfidz.com\n📱 WhatsApp: +62 21 1234 5678\n🌐 Website: www.rumahtahfidz.com'
    );
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.profileContainer}>
          <Avatar.Text
            size={80}
            label={user.name.charAt(0)}
            style={styles.avatar}
          />
          <Text variant="headlineSmall" style={styles.userName}>
            {user.name}
          </Text>
          <Text variant="bodyLarge" style={styles.userRole}>
            {user.role}
          </Text>
          {user.nis && (
            <Text variant="bodyMedium" style={styles.userNis}>
              NIS: {user.nis}
            </Text>
          )}
          
          <Button
            mode="outlined"
            onPress={handleEditProfile}
            style={styles.editButton}
            buttonColor="rgba(255, 255, 255, 0.1)"
            textColor="white"
            icon="pencil"
          >
            Edit Profil
          </Button>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Personal Information */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Informasi Personal
            </Text>
            
            <List.Item
              title="Email"
              description={user.email}
              left={(props) => <List.Icon {...props} icon="email" />}
            />
            
            {user.phone && (
              <List.Item
                title="Nomor Telepon"
                description={user.phone}
                left={(props) => <List.Icon {...props} icon="phone" />}
              />
            )}
            
            {user.address && (
              <List.Item
                title="Alamat"
                description={user.address}
                left={(props) => <List.Icon {...props} icon="map-marker" />}
              />
            )}
            
            <List.Item
              title="Tanggal Bergabung"
              description={new Date(user.joinDate).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              left={(props) => <List.Icon {...props} icon="calendar" />}
            />
          </Card.Content>
        </Card>

        {/* Academic Information */}
        {(user.halaqah || user.musyrif) && (
          <Card style={styles.infoCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Informasi Akademik
              </Text>
              
              {user.halaqah && (
                <List.Item
                  title="Halaqah"
                  description={user.halaqah}
                  left={(props) => <List.Icon {...props} icon="account-group" />}
                />
              )}
              
              {user.musyrif && (
                <List.Item
                  title="Musyrif"
                  description={user.musyrif}
                  left={(props) => <List.Icon {...props} icon="account-tie" />}
                />
              )}
            </Card.Content>
          </Card>
        )}

        {/* Parent Information */}
        {(user.parentName || user.parentPhone) && (
          <Card style={styles.infoCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Informasi Wali
              </Text>
              
              {user.parentName && (
                <List.Item
                  title="Nama Wali"
                  description={user.parentName}
                  left={(props) => <List.Icon {...props} icon="account-supervisor" />}
                />
              )}
              
              {user.parentPhone && (
                <List.Item
                  title="Telepon Wali"
                  description={user.parentPhone}
                  left={(props) => <List.Icon {...props} icon="phone-classic" />}
                />
              )}
            </Card.Content>
          </Card>
        )}

        {/* App Settings */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Pengaturan Aplikasi
            </Text>
            
            <List.Item
              title="Notifikasi"
              description="Terima notifikasi push"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={settings.notifications}
                  onValueChange={(value) => handleSettingChange('notifications', value)}
                />
              )}
            />
            
            <List.Item
              title="Mode Gelap"
              description="Gunakan tema gelap"
              left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <Switch
                  value={settings.darkMode}
                  onValueChange={(value) => handleSettingChange('darkMode', value)}
                />
              )}
            />
            
            <List.Item
              title="Sinkronisasi Otomatis"
              description="Sinkronkan data secara otomatis"
              left={(props) => <List.Icon {...props} icon="sync" />}
              right={() => (
                <Switch
                  value={settings.autoSync}
                  onValueChange={(value) => handleSettingChange('autoSync', value)}
                />
              )}
            />
            
            <List.Item
              title="Autentikasi Biometrik"
              description="Gunakan sidik jari/wajah"
              left={(props) => <List.Icon {...props} icon="fingerprint" />}
              right={() => (
                <Switch
                  value={settings.biometric}
                  onValueChange={(value) => handleSettingChange('biometric', value)}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Account Actions */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Akun & Keamanan
            </Text>
            
            <List.Item
              title="Ubah Password"
              description="Ganti password akun Anda"
              left={(props) => <List.Icon {...props} icon="lock-reset" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleChangePassword}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Bantuan & Dukungan"
              description="Hubungi tim support"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleSupport}
            />
            
            <List.Item
              title="Tentang Aplikasi"
              description="Informasi versi dan developer"
              left={(props) => <List.Icon {...props} icon="information" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleAbout}
            />
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <Card style={styles.logoutCard}>
          <Card.Content>
            <Button
              mode="contained"
              onPress={handleLogout}
              style={styles.logoutButton}
              buttonColor={theme.colors.error}
              icon="logout"
            >
              Keluar dari Akun
            </Button>
          </Card.Content>
        </Card>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text variant="bodySmall" style={styles.versionText}>
            Rumah Tahfidz Mobile App v1.0.0
          </Text>
          <Text variant="bodySmall" style={styles.versionText}>
            © 2024 Rumah Tahfidz Baitus Shuffah
          </Text>
        </View>
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
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileContainer: {
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16,
  },
  userName: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userRole: {
    color: 'white',
    opacity: 0.9,
    marginBottom: 4,
  },
  userNis: {
    color: 'white',
    opacity: 0.8,
    marginBottom: 16,
  },
  editButton: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  content: {
    padding: 16,
    marginTop: -20,
  },
  infoCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#0d9488',
  },
  divider: {
    marginVertical: 8,
  },
  logoutCard: {
    marginBottom: 16,
    elevation: 2,
  },
  logoutButton: {
    paddingVertical: 4,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 4,
  },
});
