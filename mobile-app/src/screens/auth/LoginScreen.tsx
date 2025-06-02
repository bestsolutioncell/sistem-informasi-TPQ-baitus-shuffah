import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import ApiService from '../../services/ApiService';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const theme = useTheme();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Mohon isi email dan password');
      return;
    }

    setIsLoading(true);

    try {
      // Call API login
      const response = await ApiService.login({ email, password });

      if (response.success && response.data) {
        // Navigate to main app
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        Alert.alert('Error', response.error || 'Login gagal. Silakan coba lagi.');
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'SANTRI' | 'MUSYRIF' | 'WALI') => {
    switch (role) {
      case 'SANTRI':
        setEmail('santri@rumahtahfidz.com');
        setPassword('santri123');
        break;
      case 'MUSYRIF':
        setEmail('musyrif@rumahtahfidz.com');
        setPassword('musyrif123');
        break;
      case 'WALI':
        setEmail('wali@rumahtahfidz.com');
        setPassword('wali123');
        break;
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.primaryDark]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo and Title */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons
                name="book-open-page-variant"
                size={60}
                color={theme.colors.onPrimary}
              />
            </View>
            <Text variant="headlineLarge" style={styles.title}>
              Rumah Tahfidz
            </Text>
            <Text variant="titleMedium" style={styles.subtitle}>
              Baitus Shuffah
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              Sistem Manajemen Rumah Tahfidz
            </Text>
          </View>

          {/* Login Form */}
          <Card style={styles.loginCard}>
            <Card.Content style={styles.cardContent}>
              <Text variant="titleLarge" style={styles.loginTitle}>
                Masuk ke Akun Anda
              </Text>

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={styles.input}
                left={<TextInput.Icon icon="email" />}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                autoComplete="password"
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                style={styles.loginButton}
                contentStyle={styles.loginButtonContent}
              >
                {isLoading ? 'Memproses...' : 'Masuk'}
              </Button>

              {/* Demo Credentials */}
              <View style={styles.demoSection}>
                <Text variant="bodySmall" style={styles.demoTitle}>
                  Demo Credentials:
                </Text>
                <View style={styles.demoButtons}>
                  <Button
                    mode="outlined"
                    compact
                    onPress={() => fillDemoCredentials('SANTRI')}
                    style={styles.demoButton}
                  >
                    Santri
                  </Button>
                  <Button
                    mode="outlined"
                    compact
                    onPress={() => fillDemoCredentials('MUSYRIF')}
                    style={styles.demoButton}
                  >
                    Musyrif
                  </Button>
                  <Button
                    mode="outlined"
                    compact
                    onPress={() => fillDemoCredentials('WALI')}
                    style={styles.demoButton}
                  >
                    Wali
                  </Button>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Footer */}
          <View style={styles.footer}>
            <Text variant="bodySmall" style={styles.footerText}>
              © 2024 Rumah Tahfidz Baitus Shuffah
            </Text>
            <Text variant="bodySmall" style={styles.footerText}>
              Membangun Generasi Penghafal Al-Quran
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 10,
  },
  description: {
    color: 'white',
    textAlign: 'center',
    opacity: 0.8,
  },
  loginCard: {
    marginBottom: 30,
    elevation: 8,
  },
  cardContent: {
    padding: 24,
  },
  loginTitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  demoSection: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  demoTitle: {
    textAlign: 'center',
    marginBottom: 12,
    opacity: 0.7,
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  demoButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 4,
  },
});
