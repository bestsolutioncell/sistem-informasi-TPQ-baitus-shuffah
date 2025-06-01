# 📱 Rumah Tahfidz Mobile App

Mobile application untuk Sistem Informasi Manajemen Rumah Tahfidz Baitus Shuffah yang dibangun dengan React Native dan Expo.

## 🚀 **Fitur Utama**

### 📊 **Dashboard Interaktif**
- Overview statistik hafalan dan kehadiran
- Progress tracking real-time
- Quick actions untuk fitur utama
- Aktivitas terbaru dan notifikasi

### 📖 **Manajemen Hafalan**
- Daftar hafalan dengan progress tracking
- Detail hafalan per surah dan ayat
- Status hafalan (Progress, Review, Completed)
- Filter dan pencarian hafalan

### 🎤 **Voice Recording**
- Rekam hafalan dengan kualitas tinggi
- Playback dan review rekaman
- Upload ke server untuk penilaian musyrif
- Tips dan panduan merekam

### 📱 **QR Code Scanner**
- Scan QR untuk absensi otomatis
- QR untuk akses hafalan dan pembayaran
- Real-time detection dengan camera
- Support multiple QR types

### 📅 **Absensi Digital**
- Riwayat kehadiran lengkap
- Statistik kehadiran bulanan
- Status absensi (Hadir, Izin, Sakit, Alpha)
- Check-in/out dengan timestamp

### 💳 **Pembayaran Mobile**
- Daftar tagihan SPP dan donasi
- Payment gateway integration
- Riwayat pembayaran
- Notifikasi pembayaran

### 👤 **Profil & Pengaturan**
- Informasi personal santri
- Pengaturan aplikasi
- Logout dan keamanan
- Update profil

## 🛠 **Teknologi yang Digunakan**

### **Frontend Mobile**
- **React Native** - Framework mobile development
- **Expo** - Development platform dan tools
- **React Navigation** - Navigation library
- **React Native Paper** - Material Design components
- **TypeScript** - Type safety dan development experience

### **UI/UX Components**
- **Expo Vector Icons** - Icon library
- **React Native Linear Gradient** - Gradient backgrounds
- **React Native Chart Kit** - Data visualization
- **React Native SVG** - SVG support

### **Device Features**
- **Expo Camera** - Camera dan QR scanning
- **Expo AV** - Audio recording dan playback
- **Expo Notifications** - Push notifications
- **Expo Secure Store** - Secure data storage
- **Expo File System** - File management

### **Networking & Storage**
- **Axios** - HTTP client
- **Expo Secure Store** - Token dan credential storage
- **AsyncStorage** - Local data persistence

## 📦 **Instalasi dan Setup**

### **Prerequisites**
```bash
# Install Node.js (v18 atau lebih baru)
# Install Expo CLI
npm install -g @expo/cli

# Install EAS CLI untuk building
npm install -g eas-cli
```

### **Development Setup**
```bash
# Clone repository
git clone <repository-url>
cd mobile-app

# Install dependencies
npm install

# Start development server
npm start

# Run on specific platform
npm run android  # Android
npm run ios      # iOS
npm run web      # Web browser
```

### **Building for Production**
```bash
# Configure EAS
eas login
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

## 📱 **Platform Support**

### **Android**
- Minimum SDK: 21 (Android 5.0)
- Target SDK: 34 (Android 14)
- Permissions: Camera, Microphone, Storage, Notifications

### **iOS**
- Minimum iOS: 13.0
- Target iOS: 17.0
- Permissions: Camera, Microphone, Notifications

### **Web (PWA)**
- Modern browsers dengan WebRTC support
- Camera dan microphone access
- Responsive design

## 🎨 **Design System**

### **Color Palette**
- **Primary**: Teal (#0d9488) - Islamic green theme
- **Secondary**: Amber (#f59e0b) - Accent color
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)

### **Typography**
- **Arabic Font**: Amiri (for Quranic text)
- **UI Font**: System default (Roboto/SF Pro)
- **Font Sizes**: Material Design 3 scale

### **Components**
- Material Design 3 components
- Islamic-themed icons dan illustrations
- Consistent spacing dan elevation
- Accessibility support

## 📋 **Struktur Aplikasi**

```
mobile-app/
├── src/
│   ├── components/          # Reusable components
│   ├── screens/            # Screen components
│   │   ├── auth/           # Authentication screens
│   │   ├── dashboard/      # Dashboard screens
│   │   ├── hafalan/        # Hafalan management
│   │   ├── attendance/     # Attendance screens
│   │   ├── payment/        # Payment screens
│   │   ├── profile/        # Profile screens
│   │   ├── qr/            # QR scanner
│   │   └── voice/         # Voice recording
│   ├── navigation/         # Navigation setup
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript types
│   └── theme/             # Theme configuration
├── assets/                # Static assets
│   ├── fonts/            # Custom fonts
│   ├── images/           # Images dan icons
│   └── sounds/           # Audio files
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript config
```

## 🔐 **Keamanan**

### **Authentication**
- JWT token-based authentication
- Secure token storage dengan Expo Secure Store
- Auto-logout pada token expiry
- Biometric authentication (planned)

### **Data Protection**
- HTTPS untuk semua API calls
- Input validation dan sanitization
- Secure file storage
- Privacy-compliant data handling

### **Permissions**
- Runtime permission requests
- Graceful permission denial handling
- Clear permission usage explanations
- Minimal permission requirements

## 📊 **Performance**

### **Optimization**
- Image optimization dan lazy loading
- Efficient list rendering dengan FlatList
- Memory management untuk audio/video
- Bundle size optimization

### **Offline Support**
- Local data caching
- Offline-first untuk critical features
- Sync when connection restored
- Offline indicators

## 🧪 **Testing**

### **Unit Testing**
```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage
```

### **E2E Testing**
```bash
# Run E2E tests
npm run test:e2e
```

### **Device Testing**
- Physical device testing
- Simulator/emulator testing
- Different screen sizes
- Various OS versions

## 🚀 **Deployment**

### **Development**
- Expo Go untuk quick testing
- Development builds untuk native features
- Hot reloading untuk fast iteration

### **Staging**
- Internal distribution dengan EAS
- TestFlight (iOS) dan Internal App Sharing (Android)
- Beta testing dengan real users

### **Production**
- App Store dan Google Play Store
- Over-the-air updates dengan Expo Updates
- Crash reporting dan analytics
- Performance monitoring

## 📈 **Analytics & Monitoring**

### **User Analytics**
- Screen navigation tracking
- Feature usage analytics
- User engagement metrics
- Crash reporting

### **Performance Monitoring**
- App startup time
- Screen load times
- Memory usage
- Network performance

## 🤝 **Contributing**

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 **Support**

- **Email**: mobile@rumahtahfidz.com
- **Documentation**: [docs.rumahtahfidz.com/mobile](https://docs.rumahtahfidz.com/mobile)
- **Issues**: [GitHub Issues](https://github.com/rumahtahfidz/mobile/issues)

---

**Barakallahu fiikum** - Semoga Allah memberkahi pengembangan aplikasi mobile untuk generasi penghafal Al-Quran 📱🤲
