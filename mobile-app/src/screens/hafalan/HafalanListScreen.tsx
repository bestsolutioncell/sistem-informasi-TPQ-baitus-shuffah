import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  useTheme,
  Chip,
  ProgressBar,
  FAB,
  Searchbar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';

type HafalanListNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface HafalanItem {
  id: string;
  surah: string;
  ayatMulai: number;
  ayatSelesai: number;
  status: 'PROGRESS' | 'REVIEW' | 'COMPLETED';
  progress: number;
  nilai?: number;
  tanggalMulai: string;
  tanggalSelesai?: string;
  catatan?: string;
}

export default function HafalanListScreen() {
  const [hafalanList, setHafalanList] = useState<HafalanItem[]>([]);
  const [filteredList, setFilteredList] = useState<HafalanItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'PROGRESS' | 'REVIEW' | 'COMPLETED'>('ALL');
  
  const theme = useTheme();
  const navigation = useNavigation<HafalanListNavigationProp>();

  useEffect(() => {
    loadHafalanData();
  }, []);

  useEffect(() => {
    filterHafalan();
  }, [hafalanList, searchQuery, selectedFilter]);

  const loadHafalanData = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockData: HafalanItem[] = [
        {
          id: '1',
          surah: 'Al-Fatihah',
          ayatMulai: 1,
          ayatSelesai: 7,
          status: 'COMPLETED',
          progress: 100,
          nilai: 95,
          tanggalMulai: '2024-01-01',
          tanggalSelesai: '2024-01-15',
          catatan: 'Hafalan lancar, tajwid baik'
        },
        {
          id: '2',
          surah: 'Al-Baqarah',
          ayatMulai: 1,
          ayatSelesai: 20,
          status: 'PROGRESS',
          progress: 75,
          tanggalMulai: '2024-01-16',
          catatan: 'Sedang menghafal ayat 15-20'
        },
        {
          id: '3',
          surah: 'Ali Imran',
          ayatMulai: 1,
          ayatSelesai: 10,
          status: 'REVIEW',
          progress: 100,
          nilai: 88,
          tanggalMulai: '2024-02-01',
          tanggalSelesai: '2024-02-10',
          catatan: 'Perlu review tajwid'
        },
        {
          id: '4',
          surah: 'An-Nisa',
          ayatMulai: 1,
          ayatSelesai: 15,
          status: 'PROGRESS',
          progress: 40,
          tanggalMulai: '2024-02-15',
          catatan: 'Baru mulai hafalan'
        },
      ];
      setHafalanList(mockData);
    } catch (error) {
      console.error('Error loading hafalan data:', error);
      Alert.alert('Error', 'Gagal memuat data hafalan');
    }
  };

  const filterHafalan = () => {
    let filtered = hafalanList;

    // Filter by status
    if (selectedFilter !== 'ALL') {
      filtered = filtered.filter(item => item.status === selectedFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.surah.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredList(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHafalanData();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return theme.colors.primary;
      case 'PROGRESS':
        return theme.colors.secondary;
      case 'REVIEW':
        return '#f59e0b';
      default:
        return theme.colors.outline;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Selesai';
      case 'PROGRESS':
        return 'Proses';
      case 'REVIEW':
        return 'Review';
      default:
        return status;
    }
  };

  const handleHafalanPress = (hafalan: HafalanItem) => {
    navigation.navigate('Hafalan', { hafalanId: hafalan.id });
  };

  const handleAddHafalan = () => {
    Alert.alert(
      'Tambah Hafalan Baru',
      'Fitur ini akan mengarahkan ke form tambah hafalan baru',
      [{ text: 'OK' }]
    );
  };

  const handleVoiceRecord = (hafalanId: string) => {
    navigation.navigate('VoiceRecorder', { hafalanId });
  };

  return (
    <View style={styles.container}>
      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Cari surah..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {[
            { key: 'ALL', label: 'Semua' },
            { key: 'PROGRESS', label: 'Proses' },
            { key: 'REVIEW', label: 'Review' },
            { key: 'COMPLETED', label: 'Selesai' },
          ].map((filter) => (
            <Chip
              key={filter.key}
              selected={selectedFilter === filter.key}
              onPress={() => setSelectedFilter(filter.key as any)}
              style={styles.filterChip}
              mode={selectedFilter === filter.key ? 'flat' : 'outlined'}
            >
              {filter.label}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Hafalan List */}
      <ScrollView
        style={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredList.map((hafalan) => (
          <Card
            key={hafalan.id}
            style={styles.hafalanCard}
            onPress={() => handleHafalanPress(hafalan)}
          >
            <Card.Content>
              <View style={styles.cardHeader}>
                <View style={styles.surahInfo}>
                  <Text variant="titleLarge" style={styles.surahName}>
                    {hafalan.surah}
                  </Text>
                  <Text variant="bodyMedium" style={styles.ayatRange}>
                    Ayat {hafalan.ayatMulai}-{hafalan.ayatSelesai}
                  </Text>
                </View>
                
                <Chip
                  mode="flat"
                  style={[
                    styles.statusChip,
                    { backgroundColor: getStatusColor(hafalan.status) + '20' }
                  ]}
                  textStyle={[
                    styles.statusText,
                    { color: getStatusColor(hafalan.status) }
                  ]}
                >
                  {getStatusText(hafalan.status)}
                </Chip>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text variant="bodySmall" style={styles.progressLabel}>
                    Progress
                  </Text>
                  <Text variant="bodySmall" style={styles.progressValue}>
                    {hafalan.progress}%
                  </Text>
                </View>
                <ProgressBar
                  progress={hafalan.progress / 100}
                  color={getStatusColor(hafalan.status)}
                  style={styles.progressBar}
                />
              </View>

              {/* Additional Info */}
              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={16}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <Text variant="bodySmall" style={styles.infoText}>
                    Mulai: {new Date(hafalan.tanggalMulai).toLocaleDateString('id-ID')}
                  </Text>
                </View>
                
                {hafalan.nilai && (
                  <View style={styles.infoItem}>
                    <MaterialCommunityIcons
                      name="star"
                      size={16}
                      color={theme.colors.secondary}
                    />
                    <Text variant="bodySmall" style={styles.infoText}>
                      Nilai: {hafalan.nilai}
                    </Text>
                  </View>
                )}
              </View>

              {hafalan.catatan && (
                <Text variant="bodySmall" style={styles.catatan}>
                  {hafalan.catatan}
                </Text>
              )}

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <Button
                  mode="outlined"
                  compact
                  onPress={() => handleVoiceRecord(hafalan.id)}
                  icon="microphone"
                  style={styles.actionButton}
                >
                  Rekam
                </Button>
                
                <Button
                  mode="contained"
                  compact
                  onPress={() => handleHafalanPress(hafalan)}
                  icon="eye"
                  style={styles.actionButton}
                >
                  Detail
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}

        {filteredList.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="book-open-page-variant-outline"
              size={64}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="titleMedium" style={styles.emptyTitle}>
              Tidak ada hafalan
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtitle}>
              {searchQuery || selectedFilter !== 'ALL'
                ? 'Tidak ditemukan hafalan sesuai filter'
                : 'Mulai tambahkan hafalan baru'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddHafalan}
        label="Tambah Hafalan"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  searchbar: {
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterChip: {
    marginRight: 8,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  hafalanCard: {
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ayatRange: {
    opacity: 0.7,
  },
  statusChip: {
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    opacity: 0.7,
  },
  progressValue: {
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 4,
    opacity: 0.7,
  },
  catatan: {
    fontStyle: 'italic',
    opacity: 0.8,
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    opacity: 0.7,
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
