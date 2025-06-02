import { Platform } from 'react-native';

// Environment Configuration
export const ENV = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production'
} as const;

// Current Environment
export const CURRENT_ENV = __DEV__ ? ENV.DEVELOPMENT : ENV.PRODUCTION;

// API Configuration
export const API_CONFIG = {
  [ENV.DEVELOPMENT]: {
    BASE_URL: Platform.OS === 'android' 
      ? 'http://10.0.2.2:3000/api'  // Android emulator
      : 'http://localhost:3000/api', // iOS simulator
    WEB_URL: Platform.OS === 'android'
      ? 'http://10.0.2.2:3000'
      : 'http://localhost:3000',
    TIMEOUT: 30000,
  },
  [ENV.STAGING]: {
    BASE_URL: 'https://staging-api.tpq-baitus-shuffah.com/api',
    WEB_URL: 'https://staging.tpq-baitus-shuffah.com',
    TIMEOUT: 30000,
  },
  [ENV.PRODUCTION]: {
    BASE_URL: 'https://api.tpq-baitus-shuffah.com/api',
    WEB_URL: 'https://tpq-baitus-shuffah.com',
    TIMEOUT: 30000,
  }
};

// Get current API config
export const getCurrentApiConfig = () => API_CONFIG[CURRENT_ENV];

// App Configuration
export const APP_CONFIG = {
  NAME: 'TPQ Baitus Shuffah',
  VERSION: '1.0.0',
  BUILD_NUMBER: '1',
  BUNDLE_ID: 'com.tpqbaitusshuffah.mobile',
  
  // Features
  FEATURES: {
    BIOMETRIC_AUTH: true,
    PUSH_NOTIFICATIONS: true,
    OFFLINE_MODE: true,
    VOICE_RECORDING: true,
    QR_SCANNER: true,
    PAYMENT_GATEWAY: true,
    ANALYTICS: true,
  },
  
  // Storage Keys
  STORAGE_KEYS: {
    USER_TOKEN: 'userToken',
    REFRESH_TOKEN: 'refreshToken',
    USER_DATA: 'userData',
    SETTINGS: 'appSettings',
    OFFLINE_DATA: 'offlineData',
    BIOMETRIC_ENABLED: 'biometricEnabled',
    NOTIFICATION_TOKEN: 'notificationToken',
  },
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
  
  // File Upload
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: {
      IMAGES: ['image/jpeg', 'image/png', 'image/gif'],
      AUDIO: ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac'],
      DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    },
  },
  
  // Audio Recording
  AUDIO_RECORDING: {
    MAX_DURATION: 300, // 5 minutes in seconds
    QUALITY: 'high',
    FORMAT: 'm4a',
    SAMPLE_RATE: 44100,
  },
  
  // QR Scanner
  QR_SCANNER: {
    SCAN_TYPES: ['QR_CODE', 'AZTEC', 'CODE_128', 'CODE_39', 'CODE_93', 'CODABAR', 'DATA_MATRIX', 'EAN_13', 'EAN_8', 'ITF', 'PDF_417', 'UPC_A', 'UPC_E'],
    TIMEOUT: 30000,
  },
  
  // Notification
  NOTIFICATION: {
    CHANNELS: {
      GENERAL: 'general',
      HAFALAN: 'hafalan',
      PAYMENT: 'payment',
      ATTENDANCE: 'attendance',
      ANNOUNCEMENT: 'announcement',
    },
    TYPES: {
      HAFALAN_REMINDER: 'hafalan_reminder',
      PAYMENT_DUE: 'payment_due',
      ATTENDANCE_REMINDER: 'attendance_reminder',
      NEW_ANNOUNCEMENT: 'new_announcement',
      GRADE_RECEIVED: 'grade_received',
    },
  },
  
  // Theme
  THEME: {
    PRIMARY_COLOR: '#0d9488',
    SECONDARY_COLOR: '#06b6d4',
    SUCCESS_COLOR: '#10b981',
    WARNING_COLOR: '#f59e0b',
    ERROR_COLOR: '#ef4444',
    INFO_COLOR: '#3b82f6',
    
    // Islamic Colors
    ISLAMIC_GREEN: '#0d9488',
    ISLAMIC_GOLD: '#d97706',
    ISLAMIC_BLUE: '#1e40af',
    
    // Gradients
    PRIMARY_GRADIENT: ['#0d9488', '#06b6d4'],
    SECONDARY_GRADIENT: ['#06b6d4', '#3b82f6'],
    SUCCESS_GRADIENT: ['#10b981', '#059669'],
    WARNING_GRADIENT: ['#f59e0b', '#d97706'],
    ERROR_GRADIENT: ['#ef4444', '#dc2626'],
  },
  
  // Animation
  ANIMATION: {
    DURATION: {
      SHORT: 200,
      MEDIUM: 300,
      LONG: 500,
    },
    EASING: {
      EASE_IN: 'ease-in',
      EASE_OUT: 'ease-out',
      EASE_IN_OUT: 'ease-in-out',
    },
  },
  
  // Offline
  OFFLINE: {
    SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutes
    MAX_OFFLINE_ACTIONS: 100,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  },
  
  // Security
  SECURITY: {
    TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // Performance
  PERFORMANCE: {
    IMAGE_CACHE_SIZE: 50 * 1024 * 1024, // 50MB
    LIST_ITEM_HEIGHT: 80,
    LAZY_LOAD_THRESHOLD: 10,
  },
};

// Payment Gateway Configuration
export const PAYMENT_CONFIG = {
  MIDTRANS: {
    CLIENT_KEY: __DEV__ 
      ? 'SB-Mid-client-your-sandbox-client-key'
      : 'Mid-client-your-production-client-key',
    ENVIRONMENT: __DEV__ ? 'sandbox' : 'production',
  },
  XENDIT: {
    PUBLIC_KEY: __DEV__
      ? 'xnd_public_development_your-public-key'
      : 'xnd_public_production_your-public-key',
  },
  SUPPORTED_METHODS: [
    'credit_card',
    'bca_va',
    'bni_va',
    'bri_va',
    'mandiri_va',
    'gopay',
    'shopeepay',
    'dana',
    'ovo',
    'qris',
  ],
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
  [ENV.DEVELOPMENT]: {
    apiKey: "your-dev-api-key",
    authDomain: "tpq-baitus-shuffah-dev.firebaseapp.com",
    projectId: "tpq-baitus-shuffah-dev",
    storageBucket: "tpq-baitus-shuffah-dev.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:android:abcdef123456",
  },
  [ENV.PRODUCTION]: {
    apiKey: "your-prod-api-key",
    authDomain: "tpq-baitus-shuffah.firebaseapp.com",
    projectId: "tpq-baitus-shuffah",
    storageBucket: "tpq-baitus-shuffah.appspot.com",
    messagingSenderId: "987654321",
    appId: "1:987654321:android:fedcba654321",
  },
};

// Get current Firebase config
export const getCurrentFirebaseConfig = () => FIREBASE_CONFIG[CURRENT_ENV];

// Deep Link Configuration
export const DEEP_LINK_CONFIG = {
  SCHEME: 'tpqbaitusshuffah',
  HOST: 'app',
  PATHS: {
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    HAFALAN: '/hafalan',
    PAYMENT: '/payment',
    ATTENDANCE: '/attendance',
    PROFILE: '/profile',
    NOTIFICATION: '/notification',
  },
};

// Social Media Links
export const SOCIAL_MEDIA = {
  WEBSITE: 'https://tpq-baitus-shuffah.com',
  FACEBOOK: 'https://facebook.com/tpqbaitusshuffah',
  INSTAGRAM: 'https://instagram.com/tpqbaitusshuffah',
  YOUTUBE: 'https://youtube.com/@tpqbaitusshuffah',
  WHATSAPP: 'https://wa.me/6281234567890',
  EMAIL: 'info@tpq-baitus-shuffah.com',
  PHONE: '+62 812-3456-7890',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
  TIMEOUT_ERROR: 'Permintaan timeout. Silakan coba lagi.',
  UNAUTHORIZED: 'Sesi Anda telah berakhir. Silakan login kembali.',
  FORBIDDEN: 'Anda tidak memiliki akses untuk melakukan tindakan ini.',
  NOT_FOUND: 'Data yang diminta tidak ditemukan.',
  SERVER_ERROR: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid.',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login berhasil!',
  LOGOUT_SUCCESS: 'Logout berhasil!',
  DATA_SAVED: 'Data berhasil disimpan!',
  DATA_UPDATED: 'Data berhasil diperbarui!',
  DATA_DELETED: 'Data berhasil dihapus!',
  PAYMENT_SUCCESS: 'Pembayaran berhasil!',
  UPLOAD_SUCCESS: 'File berhasil diunggah!',
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL_CHAR: false,
  },
  NIS: /^[0-9]{5,10}$/,
  AMOUNT: {
    MIN: 1000,
    MAX: 10000000,
  },
};

export default {
  ENV,
  CURRENT_ENV,
  API_CONFIG,
  getCurrentApiConfig,
  APP_CONFIG,
  PAYMENT_CONFIG,
  FIREBASE_CONFIG,
  getCurrentFirebaseConfig,
  DEEP_LINK_CONFIG,
  SOCIAL_MEDIA,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_RULES,
};
