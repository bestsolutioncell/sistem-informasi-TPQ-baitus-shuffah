import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  Vibration,
} from 'react-native';
import {
  Text,
  Button,
  useTheme,
  Card,
  IconButton,
} from 'react-native-paper';
import { Camera, CameraType } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';

type QRScannerNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QRScanner'>;

const { width, height } = Dimensions.get('window');

export default function QRScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [cameraType, setCameraType] = useState(CameraType.back);
  
  const theme = useTheme();
  const navigation = useNavigation<QRScannerNavigationProp>();

  useEffect(() => {
    getCameraPermissions();
  }, []);

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    Vibration.vibrate(100);

    // Process QR code data
    processQRData(data);
  };

  const processQRData = (data: string) => {
    try {
      // Try to parse as JSON for structured data
      const qrData = JSON.parse(data);
      
      if (qrData.type === 'attendance') {
        handleAttendanceQR(qrData);
      } else if (qrData.type === 'hafalan') {
        handleHafalanQR(qrData);
      } else if (qrData.type === 'payment') {
        handlePaymentQR(qrData);
      } else {
        handleGenericQR(data);
      }
    } catch (error) {
      // If not JSON, treat as plain text
      handleGenericQR(data);
    }
  };

  const handleAttendanceQR = (qrData: any) => {
    Alert.alert(
      'QR Absensi Terdeteksi',
      `Halaqah: ${qrData.halaqah}\nTanggal: ${qrData.date}\nWaktu: ${qrData.time}`,
      [
        {
          text: 'Batal',
          style: 'cancel',
          onPress: () => setScanned(false),
        },
        {
          text: 'Absen Sekarang',
          onPress: () => {
            // Process attendance
            Alert.alert('Sukses', 'Absensi berhasil dicatat!');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleHafalanQR = (qrData: any) => {
    Alert.alert(
      'QR Hafalan Terdeteksi',
      `Surah: ${qrData.surah}\nAyat: ${qrData.ayat}\nMusyrif: ${qrData.musyrif}`,
      [
        {
          text: 'Batal',
          style: 'cancel',
          onPress: () => setScanned(false),
        },
        {
          text: 'Buka Detail',
          onPress: () => {
            navigation.navigate('Hafalan', { hafalanId: qrData.hafalanId });
          },
        },
      ]
    );
  };

  const handlePaymentQR = (qrData: any) => {
    Alert.alert(
      'QR Pembayaran Terdeteksi',
      `Jenis: ${qrData.paymentType}\nJumlah: Rp ${qrData.amount?.toLocaleString('id-ID')}\nDeskripsi: ${qrData.description}`,
      [
        {
          text: 'Batal',
          style: 'cancel',
          onPress: () => setScanned(false),
        },
        {
          text: 'Bayar Sekarang',
          onPress: () => {
            navigation.navigate('Payment', { paymentData: qrData });
          },
        },
      ]
    );
  };

  const handleGenericQR = (data: string) => {
    Alert.alert(
      'QR Code Terdeteksi',
      `Data: ${data}`,
      [
        {
          text: 'Scan Lagi',
          onPress: () => setScanned(false),
        },
        {
          text: 'Selesai',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  const flipCamera = () => {
    setCameraType(
      cameraType === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Meminta izin kamera...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialCommunityIcons
          name="camera-off"
          size={64}
          color={theme.colors.onSurfaceVariant}
        />
        <Text variant="titleLarge" style={styles.permissionTitle}>
          Izin Kamera Diperlukan
        </Text>
        <Text variant="bodyMedium" style={styles.permissionText}>
          Aplikasi memerlukan akses kamera untuk memindai QR code
        </Text>
        <Button
          mode="contained"
          onPress={getCameraPermissions}
          style={styles.permissionButton}
        >
          Berikan Izin
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={cameraType}
        flashMode={flashOn ? 'torch' : 'off'}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: ['qr'],
        }}
      >
        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Top Controls */}
          <View style={styles.topControls}>
            <IconButton
              icon="close"
              iconColor="white"
              size={24}
              onPress={() => navigation.goBack()}
            />
            <View style={styles.topRightControls}>
              <IconButton
                icon={flashOn ? "flash" : "flash-off"}
                iconColor="white"
                size={24}
                onPress={toggleFlash}
              />
              <IconButton
                icon="camera-flip"
                iconColor="white"
                size={24}
                onPress={flipCamera}
              />
            </View>
          </View>

          {/* Scanning Area */}
          <View style={styles.scanningArea}>
            <View style={styles.scanFrame}>
              {/* Corner indicators */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {/* Scanning line animation would go here */}
              {!scanned && (
                <View style={styles.scanLine} />
              )}
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <Card style={styles.instructionCard}>
              <Card.Content style={styles.instructionContent}>
                <MaterialCommunityIcons
                  name="qrcode-scan"
                  size={32}
                  color={theme.colors.primary}
                  style={styles.instructionIcon}
                />
                <Text variant="titleMedium" style={styles.instructionTitle}>
                  {scanned ? 'QR Code Terdeteksi!' : 'Arahkan kamera ke QR Code'}
                </Text>
                <Text variant="bodyMedium" style={styles.instructionText}>
                  {scanned 
                    ? 'Memproses data QR code...'
                    : 'Pastikan QR code berada dalam frame dan terlihat jelas'
                  }
                </Text>
                
                {scanned && (
                  <Button
                    mode="outlined"
                    onPress={() => setScanned(false)}
                    style={styles.rescanButton}
                  >
                    Scan Lagi
                  </Button>
                )}
              </Card.Content>
            </Card>
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  permissionButton: {
    paddingHorizontal: 24,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  topRightControls: {
    flexDirection: 'row',
  },
  scanningArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: 'white',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#0d9488',
    shadowColor: '#0d9488',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  instructions: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
  instructionCard: {
    elevation: 4,
  },
  instructionContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  instructionIcon: {
    marginBottom: 12,
  },
  instructionTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  instructionText: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 16,
  },
  rescanButton: {
    marginTop: 8,
  },
});
