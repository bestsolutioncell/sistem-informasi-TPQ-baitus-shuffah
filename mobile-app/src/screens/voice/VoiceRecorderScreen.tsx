import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Text,
  Button,
  useTheme,
  Card,
  ProgressBar,
  IconButton,
  Chip,
} from 'react-native-paper';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../App';

type VoiceRecorderNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VoiceRecorder'>;
type VoiceRecorderRouteProp = RouteProp<RootStackParamList, 'VoiceRecorder'>;

const { width } = Dimensions.get('window');

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  uri?: string;
}

export default function VoiceRecorderScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const theme = useTheme();
  const navigation = useNavigation<VoiceRecorderNavigationProp>();
  const route = useRoute<VoiceRecorderRouteProp>();
  
  const hafalanId = route.params?.hafalanId;

  useEffect(() => {
    getAudioPermissions();
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const getAudioPermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    
    if (status === 'granted') {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    }
  };

  const startRecording = async () => {
    try {
      if (!hasPermission) {
        Alert.alert('Error', 'Izin mikrofon diperlukan untuk merekam');
        return;
      }

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(newRecording);
      setRecordingState({
        isRecording: true,
        isPaused: false,
        duration: 0,
      });

      // Start duration timer
      const timer = setInterval(() => {
        setRecordingState(prev => ({
          ...prev,
          duration: prev.duration + 1,
        }));
      }, 1000);

      // Store timer reference for cleanup
      (newRecording as any).timer = timer;
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Gagal memulai perekaman');
    }
  };

  const pauseRecording = async () => {
    if (!recording) return;

    try {
      await recording.pauseAsync();
      setRecordingState(prev => ({
        ...prev,
        isPaused: true,
      }));
      
      // Clear timer
      if ((recording as any).timer) {
        clearInterval((recording as any).timer);
      }
    } catch (error) {
      console.error('Failed to pause recording:', error);
    }
  };

  const resumeRecording = async () => {
    if (!recording) return;

    try {
      await recording.startAsync();
      setRecordingState(prev => ({
        ...prev,
        isPaused: false,
      }));

      // Resume timer
      const timer = setInterval(() => {
        setRecordingState(prev => ({
          ...prev,
          duration: prev.duration + 1,
        }));
      }, 1000);

      (recording as any).timer = timer;
    } catch (error) {
      console.error('Failed to resume recording:', error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      
      // Clear timer
      if ((recording as any).timer) {
        clearInterval((recording as any).timer);
      }

      const uri = recording.getURI();
      setRecordingState(prev => ({
        ...prev,
        isRecording: false,
        isPaused: false,
        uri,
      }));
      
      setRecording(null);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const playRecording = async () => {
    if (!recordingState.uri) return;

    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordingState.uri },
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPlaybackPosition(status.positionMillis || 0);
          setPlaybackDuration(status.durationMillis || 0);
          
          if (status.didJustFinish) {
            setIsPlaying(false);
            setPlaybackPosition(0);
          }
        }
      });
    } catch (error) {
      console.error('Failed to play recording:', error);
      Alert.alert('Error', 'Gagal memutar rekaman');
    }
  };

  const stopPlayback = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      setPlaybackPosition(0);
    }
  };

  const saveRecording = async () => {
    if (!recordingState.uri) {
      Alert.alert('Error', 'Tidak ada rekaman untuk disimpan');
      return;
    }

    Alert.alert(
      'Simpan Rekaman',
      'Rekaman hafalan akan disimpan dan dikirim ke musyrif untuk penilaian.',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Simpan',
          onPress: async () => {
            // In real app, upload to server
            Alert.alert('Sukses', 'Rekaman berhasil disimpan!');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const discardRecording = () => {
    Alert.alert(
      'Buang Rekaman',
      'Apakah Anda yakin ingin membuang rekaman ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Buang',
          style: 'destructive',
          onPress: () => {
            setRecordingState({
              isRecording: false,
              isPaused: false,
              duration: 0,
            });
            if (sound) {
              sound.unloadAsync();
              setSound(null);
            }
            setIsPlaying(false);
            setPlaybackPosition(0);
            setPlaybackDuration(0);
          },
        },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatMilliseconds = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    return formatTime(totalSeconds);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Meminta izin mikrofon...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialCommunityIcons
          name="microphone-off"
          size={64}
          color={theme.colors.onSurfaceVariant}
        />
        <Text variant="titleLarge" style={styles.permissionTitle}>
          Izin Mikrofon Diperlukan
        </Text>
        <Text variant="bodyMedium" style={styles.permissionText}>
          Aplikasi memerlukan akses mikrofon untuk merekam hafalan
        </Text>
        <Button
          mode="contained"
          onPress={getAudioPermissions}
          style={styles.permissionButton}
        >
          Berikan Izin
        </Button>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.primaryDark]}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header Info */}
        <Card style={styles.infoCard}>
          <Card.Content style={styles.infoContent}>
            <MaterialCommunityIcons
              name="microphone"
              size={32}
              color={theme.colors.primary}
            />
            <Text variant="titleLarge" style={styles.infoTitle}>
              Rekam Hafalan
            </Text>
            {hafalanId && (
              <Chip mode="outlined" style={styles.hafalanChip}>
                ID: {hafalanId}
              </Chip>
            )}
            <Text variant="bodyMedium" style={styles.infoDescription}>
              Rekam hafalan Anda dengan jelas untuk penilaian musyrif
            </Text>
          </Card.Content>
        </Card>

        {/* Recording Controls */}
        <View style={styles.recordingContainer}>
          {/* Duration Display */}
          <View style={styles.durationContainer}>
            <Text variant="displayMedium" style={styles.duration}>
              {formatTime(recordingState.duration)}
            </Text>
            {recordingState.isRecording && (
              <View style={styles.recordingIndicator}>
                <MaterialCommunityIcons
                  name="record"
                  size={16}
                  color={theme.colors.error}
                />
                <Text variant="bodySmall" style={styles.recordingText}>
                  {recordingState.isPaused ? 'DIJEDA' : 'MEREKAM'}
                </Text>
              </View>
            )}
          </View>

          {/* Main Control Button */}
          <View style={styles.mainControlContainer}>
            {!recordingState.isRecording && !recordingState.uri ? (
              <IconButton
                icon="microphone"
                size={60}
                iconColor="white"
                style={[styles.mainButton, { backgroundColor: theme.colors.error }]}
                onPress={startRecording}
              />
            ) : recordingState.isRecording ? (
              <View style={styles.recordingControls}>
                <IconButton
                  icon={recordingState.isPaused ? "play" : "pause"}
                  size={40}
                  iconColor="white"
                  style={[styles.controlButton, { backgroundColor: theme.colors.secondary }]}
                  onPress={recordingState.isPaused ? resumeRecording : pauseRecording}
                />
                <IconButton
                  icon="stop"
                  size={60}
                  iconColor="white"
                  style={[styles.mainButton, { backgroundColor: theme.colors.error }]}
                  onPress={stopRecording}
                />
              </View>
            ) : (
              <IconButton
                icon={isPlaying ? "pause" : "play"}
                size={60}
                iconColor="white"
                style={[styles.mainButton, { backgroundColor: theme.colors.primary }]}
                onPress={isPlaying ? stopPlayback : playRecording}
              />
            )}
          </View>

          {/* Playback Progress */}
          {recordingState.uri && playbackDuration > 0 && (
            <View style={styles.playbackContainer}>
              <Text variant="bodySmall" style={styles.playbackTime}>
                {formatMilliseconds(playbackPosition)} / {formatMilliseconds(playbackDuration)}
              </Text>
              <ProgressBar
                progress={playbackPosition / playbackDuration}
                color="white"
                style={styles.playbackProgress}
              />
            </View>
          )}
        </View>

        {/* Action Buttons */}
        {recordingState.uri && (
          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={discardRecording}
              style={styles.actionButton}
              buttonColor="rgba(255, 255, 255, 0.1)"
              textColor="white"
              icon="delete"
            >
              Buang
            </Button>
            
            <Button
              mode="contained"
              onPress={saveRecording}
              style={styles.actionButton}
              buttonColor="white"
              textColor={theme.colors.primary}
              icon="content-save"
            >
              Simpan
            </Button>
          </View>
        )}

        {/* Tips */}
        <Card style={styles.tipsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.tipsTitle}>
              Tips Merekam Hafalan:
            </Text>
            <View style={styles.tipsList}>
              <Text variant="bodySmall" style={styles.tipItem}>
                • Pastikan lingkungan tenang dan minim gangguan
              </Text>
              <Text variant="bodySmall" style={styles.tipItem}>
                • Bacakan dengan jelas dan sesuai tajwid
              </Text>
              <Text variant="bodySmall" style={styles.tipItem}>
                • Pegang ponsel dekat dengan mulut (20-30 cm)
              </Text>
              <Text variant="bodySmall" style={styles.tipItem}>
                • Jika salah, jeda sebentar lalu ulangi dari awal ayat
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    </LinearGradient>
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
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  infoCard: {
    marginBottom: 30,
    elevation: 4,
  },
  infoContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  infoTitle: {
    marginTop: 12,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  hafalanChip: {
    marginBottom: 12,
  },
  infoDescription: {
    textAlign: 'center',
    opacity: 0.7,
  },
  recordingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  duration: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recordingText: {
    color: 'white',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  mainControlContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    elevation: 8,
  },
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    elevation: 4,
  },
  playbackContainer: {
    width: '100%',
    alignItems: 'center',
  },
  playbackTime: {
    color: 'white',
    marginBottom: 8,
  },
  playbackProgress: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  tipsCard: {
    elevation: 2,
  },
  tipsTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  tipsList: {
    gap: 4,
  },
  tipItem: {
    opacity: 0.8,
    lineHeight: 18,
  },
});
