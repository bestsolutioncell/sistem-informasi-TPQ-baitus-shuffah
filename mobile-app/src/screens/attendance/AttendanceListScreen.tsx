import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  useTheme,
  Chip,
  FAB,
  Searchbar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';

type AttendanceListNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface AttendanceRecord {
  id: string;
  date: string;
  time: string;
  status: 'HADIR' | 'IZIN' | 'SAKIT' | 'ALPHA';
  halaqah: string;
  musyrif: string;
  keterangan?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export default function AttendanceListScreen() {
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [filteredList, setFilteredList] = useState<AttendanceRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'HADIR' | 'IZIN' | 'SAKIT' | 'ALPHA'>('ALL');
  
  const theme = useTheme();
  const navigation = useNavigation<AttendanceListNavigationProp>();

  useEffect(() => {
    loadAttendanceData();
  }, []);

  useEffect(() => {
    filterAttendance();
  }, [attendanceList, searchQuery, selectedFilter]);

  const loadAttendanceData = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockData: AttendanceRecord[] = [
        {
          id: '1',
          date: '2024-01-15',
          time: '08:00',
          status: 'HADIR',
          halaqah: 'Al-Fatihah',
          musyrif: 'Ustadz Abdullah',
          checkInTime: '07:55',
          checkOutTime: '10:30',
        },
        {
          id: '2',
          date: '2024-01-14',
          time: '08:00',
          status: 'HADIR',
          halaqah: 'Al-Fatihah',
          musyrif: 'Ustadz Abdullah',
          checkInTime: '08:02',
          checkOutTime: '10:25',
        },
        {
          id: '3',
          date: '2024-01-13',
          time: '08:00',
          status: 'IZIN',
          halaqah: 'Al-Fatihah',
          musyrif: 'Ustadz Abdullah',
          keterangan: 'Sakit demam',
        },
        {
          id: '4',
          date: '2024-01-12',
          time: '08:00',
          status: 'HADIR',
          halaqah: 'Al-Fatihah',
          musyrif: 'Ustadz Abdullah',
          checkInTime: '07:58',
          checkOutTime: '10:35',
        },
        {
          id: '5',
          date: '2024-01-11',
          time: '08:00',
          status: 'ALPHA',
          halaqah: 'Al-Fatihah',
          musyrif: 'Ustadz Abdullah',
        },
      ];
      setAttendanceList(mockData);
    } catch (error) {
      console.error('Error loading attendance data:', error);
    }
  };

  const filterAttendance = () => {
    let filtered = attendanceList;

    // Filter by status
    if (selectedFilter !== 'ALL') {
      filtered = filtered.filter(item => item.status === selectedFilter);
    }

    // Filter by search query (date or halaqah)
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.date.includes(searchQuery) ||
        item.halaqah.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.musyrif.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredList(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAttendanceData();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HADIR':
        return theme.colors.primary;
      case 'IZIN':
        return theme.colors.secondary;
      case 'SAKIT':
        return '#f59e0b';
      case 'ALPHA':
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'HADIR':
        return 'check-circle';
      case 'IZIN':
        return 'information';
      case 'SAKIT':
        return 'medical-bag';
      case 'ALPHA':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const handleQRScan = () => {
    navigation.navigate('QRScanner');
  };

  const calculateStats = () => {
    const total = attendanceList.length;
    const hadir = attendanceList.filter(item => item.status === 'HADIR').length;
    const izin = attendanceList.filter(item => item.status === 'IZIN').length;
    const sakit = attendanceList.filter(item => item.status === 'SAKIT').length;
    const alpha = attendanceList.filter(item => item.status === 'ALPHA').length;
    
    const percentage = total > 0 ? Math.round((hadir / total) * 100) : 0;
    
    return { total, hadir, izin, sakit, alpha, percentage };
  };

  const stats = calculateStats();

  return (
    <View style={styles.container}>
      {/* Stats Card */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.statsTitle}>
            Statistik Kehadiran
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={[styles.statValue, { color: theme.colors.primary }]}>
                {stats.percentage}%
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Kehadiran
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="titleLarge" style={[styles.statValue, { color: theme.colors.primary }]}>
                {stats.hadir}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Hadir
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="titleLarge" style={[styles.statValue, { color: theme.colors.secondary }]}>
                {stats.izin}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Izin
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="titleLarge" style={[styles.statValue, { color: theme.colors.error }]}>
                {stats.alpha}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Alpha
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Cari tanggal, halaqah, atau musyrif..."
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
            { key: 'HADIR', label: 'Hadir' },
            { key: 'IZIN', label: 'Izin' },
            { key: 'SAKIT', label: 'Sakit' },
            { key: 'ALPHA', label: 'Alpha' },
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

      {/* Attendance List */}
      <ScrollView
        style={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredList.map((attendance) => (
          <Card key={attendance.id} style={styles.attendanceCard}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <View style={styles.dateInfo}>
                  <Text variant="titleMedium" style={styles.date}>
                    {new Date(attendance.date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                  <Text variant="bodyMedium" style={styles.time}>
                    {attendance.time}
                  </Text>
                </View>
                
                <Chip
                  mode="flat"
                  icon={getStatusIcon(attendance.status)}
                  style={[
                    styles.statusChip,
                    { backgroundColor: getStatusColor(attendance.status) + '20' }
                  ]}
                  textStyle={[
                    styles.statusText,
                    { color: getStatusColor(attendance.status) }
                  ]}
                >
                  {attendance.status}
                </Chip>
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons
                    name="account-group"
                    size={16}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <Text variant="bodySmall" style={styles.detailText}>
                    Halaqah: {attendance.halaqah}
                  </Text>
                </View>
                
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons
                    name="account"
                    size={16}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <Text variant="bodySmall" style={styles.detailText}>
                    Musyrif: {attendance.musyrif}
                  </Text>
                </View>
              </View>

              {attendance.checkInTime && attendance.checkOutTime && (
                <View style={styles.timeContainer}>
                  <View style={styles.timeItem}>
                    <MaterialCommunityIcons
                      name="login"
                      size={16}
                      color={theme.colors.primary}
                    />
                    <Text variant="bodySmall" style={styles.timeText}>
                      Masuk: {attendance.checkInTime}
                    </Text>
                  </View>
                  
                  <View style={styles.timeItem}>
                    <MaterialCommunityIcons
                      name="logout"
                      size={16}
                      color={theme.colors.secondary}
                    />
                    <Text variant="bodySmall" style={styles.timeText}>
                      Keluar: {attendance.checkOutTime}
                    </Text>
                  </View>
                </View>
              )}

              {attendance.keterangan && (
                <Text variant="bodySmall" style={styles.keterangan}>
                  Keterangan: {attendance.keterangan}
                </Text>
              )}
            </Card.Content>
          </Card>
        ))}

        {filteredList.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="calendar-remove"
              size={64}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="titleMedium" style={styles.emptyTitle}>
              Tidak ada data absensi
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtitle}>
              {searchQuery || selectedFilter !== 'ALL'
                ? 'Tidak ditemukan data sesuai filter'
                : 'Belum ada data absensi'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="qrcode-scan"
        style={styles.fab}
        onPress={handleQRScan}
        label="Scan QR"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  statsCard: {
    margin: 16,
    elevation: 2,
  },
  statsTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
  },
  statLabel: {
    marginTop: 4,
    opacity: 0.7,
  },
  searchContainer: {
    padding: 16,
    paddingTop: 0,
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
  attendanceCard: {
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dateInfo: {
    flex: 1,
  },
  date: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  time: {
    opacity: 0.7,
  },
  statusChip: {
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    opacity: 0.7,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 4,
    fontWeight: '500',
  },
  keterangan: {
    fontStyle: 'italic',
    opacity: 0.8,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
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
