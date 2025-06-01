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
  Searchbar,
  Divider,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';

type PaymentListNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface PaymentItem {
  id: string;
  type: 'SPP' | 'DONASI' | 'KEGIATAN' | 'LAINNYA';
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  paymentDate?: string;
  paymentMethod?: string;
  transactionId?: string;
}

export default function PaymentListScreen() {
  const [paymentList, setPaymentList] = useState<PaymentItem[]>([]);
  const [filteredList, setFilteredList] = useState<PaymentItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'PENDING' | 'PAID' | 'OVERDUE'>('ALL');
  
  const theme = useTheme();
  const navigation = useNavigation<PaymentListNavigationProp>();

  useEffect(() => {
    loadPaymentData();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [paymentList, searchQuery, selectedFilter]);

  const loadPaymentData = async () => {
    try {
      // Mock data - in real app, fetch from API
      const mockData: PaymentItem[] = [
        {
          id: '1',
          type: 'SPP',
          title: 'SPP Januari 2024',
          description: 'Biaya pendidikan bulan Januari',
          amount: 300000,
          dueDate: '2024-01-31',
          status: 'PAID',
          paymentDate: '2024-01-15',
          paymentMethod: 'Transfer Bank',
          transactionId: 'TXN001234567',
        },
        {
          id: '2',
          type: 'SPP',
          title: 'SPP Februari 2024',
          description: 'Biaya pendidikan bulan Februari',
          amount: 300000,
          dueDate: '2024-02-29',
          status: 'PENDING',
        },
        {
          id: '3',
          type: 'DONASI',
          title: 'Donasi Pembangunan Masjid',
          description: 'Sumbangan untuk pembangunan masjid baru',
          amount: 500000,
          dueDate: '2024-03-31',
          status: 'PENDING',
        },
        {
          id: '4',
          type: 'KEGIATAN',
          title: 'Biaya Study Tour',
          description: 'Kunjungan ke Masjid Istiqlal Jakarta',
          amount: 150000,
          dueDate: '2024-02-15',
          status: 'OVERDUE',
        },
        {
          id: '5',
          type: 'SPP',
          title: 'SPP Desember 2023',
          description: 'Biaya pendidikan bulan Desember',
          amount: 300000,
          dueDate: '2023-12-31',
          status: 'PAID',
          paymentDate: '2023-12-20',
          paymentMethod: 'E-Wallet',
          transactionId: 'TXN001234566',
        },
      ];
      setPaymentList(mockData);
    } catch (error) {
      console.error('Error loading payment data:', error);
    }
  };

  const filterPayments = () => {
    let filtered = paymentList;

    // Filter by status
    if (selectedFilter !== 'ALL') {
      filtered = filtered.filter(item => item.status === selectedFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredList(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPaymentData();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return theme.colors.primary;
      case 'PENDING':
        return theme.colors.secondary;
      case 'OVERDUE':
        return theme.colors.error;
      case 'CANCELLED':
        return theme.colors.outline;
      default:
        return theme.colors.outline;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Lunas';
      case 'PENDING':
        return 'Belum Bayar';
      case 'OVERDUE':
        return 'Terlambat';
      case 'CANCELLED':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SPP':
        return 'school';
      case 'DONASI':
        return 'heart';
      case 'KEGIATAN':
        return 'calendar-star';
      case 'LAINNYA':
        return 'cash-multiple';
      default:
        return 'cash';
    }
  };

  const handlePayment = (payment: PaymentItem) => {
    if (payment.status === 'PAID') {
      Alert.alert('Info', 'Pembayaran sudah lunas');
      return;
    }

    Alert.alert(
      'Konfirmasi Pembayaran',
      `Bayar ${payment.title}\nJumlah: Rp ${payment.amount.toLocaleString('id-ID')}`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Bayar Sekarang',
          onPress: () => {
            navigation.navigate('Payment', { paymentId: payment.id });
          },
        },
      ]
    );
  };

  const calculateSummary = () => {
    const pending = paymentList.filter(item => item.status === 'PENDING');
    const overdue = paymentList.filter(item => item.status === 'OVERDUE');
    const totalPending = pending.reduce((sum, item) => sum + item.amount, 0);
    const totalOverdue = overdue.reduce((sum, item) => sum + item.amount, 0);
    
    return {
      pendingCount: pending.length,
      overdueCount: overdue.length,
      totalPending,
      totalOverdue,
    };
  };

  const summary = calculateSummary();

  return (
    <View style={styles.container}>
      {/* Summary Card */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.summaryTitle}>
            Ringkasan Pembayaran
          </Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={24}
                color={theme.colors.secondary}
              />
              <View style={styles.summaryText}>
                <Text variant="bodySmall" style={styles.summaryLabel}>
                  Belum Bayar
                </Text>
                <Text variant="titleSmall" style={[styles.summaryValue, { color: theme.colors.secondary }]}>
                  {summary.pendingCount} tagihan
                </Text>
                <Text variant="bodySmall" style={styles.summaryAmount}>
                  Rp {summary.totalPending.toLocaleString('id-ID')}
                </Text>
              </View>
            </View>
            
            <Divider style={styles.summaryDivider} />
            
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={24}
                color={theme.colors.error}
              />
              <View style={styles.summaryText}>
                <Text variant="bodySmall" style={styles.summaryLabel}>
                  Terlambat
                </Text>
                <Text variant="titleSmall" style={[styles.summaryValue, { color: theme.colors.error }]}>
                  {summary.overdueCount} tagihan
                </Text>
                <Text variant="bodySmall" style={styles.summaryAmount}>
                  Rp {summary.totalOverdue.toLocaleString('id-ID')}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Cari pembayaran..."
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
            { key: 'PENDING', label: 'Belum Bayar' },
            { key: 'OVERDUE', label: 'Terlambat' },
            { key: 'PAID', label: 'Lunas' },
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

      {/* Payment List */}
      <ScrollView
        style={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredList.map((payment) => (
          <Card key={payment.id} style={styles.paymentCard}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <View style={styles.paymentInfo}>
                  <View style={styles.titleRow}>
                    <MaterialCommunityIcons
                      name={getTypeIcon(payment.type)}
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text variant="titleMedium" style={styles.paymentTitle}>
                      {payment.title}
                    </Text>
                  </View>
                  <Text variant="bodyMedium" style={styles.paymentDescription}>
                    {payment.description}
                  </Text>
                </View>
                
                <Chip
                  mode="flat"
                  style={[
                    styles.statusChip,
                    { backgroundColor: getStatusColor(payment.status) + '20' }
                  ]}
                  textStyle={[
                    styles.statusText,
                    { color: getStatusColor(payment.status) }
                  ]}
                >
                  {getStatusText(payment.status)}
                </Chip>
              </View>

              <View style={styles.amountContainer}>
                <Text variant="headlineSmall" style={styles.amount}>
                  Rp {payment.amount.toLocaleString('id-ID')}
                </Text>
                <Text variant="bodySmall" style={styles.dueDate}>
                  Jatuh tempo: {new Date(payment.dueDate).toLocaleDateString('id-ID')}
                </Text>
              </View>

              {payment.paymentDate && (
                <View style={styles.paymentDetails}>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons
                      name="calendar-check"
                      size={16}
                      color={theme.colors.primary}
                    />
                    <Text variant="bodySmall" style={styles.detailText}>
                      Dibayar: {new Date(payment.paymentDate).toLocaleDateString('id-ID')}
                    </Text>
                  </View>
                  
                  {payment.paymentMethod && (
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons
                        name="credit-card"
                        size={16}
                        color={theme.colors.primary}
                      />
                      <Text variant="bodySmall" style={styles.detailText}>
                        Via: {payment.paymentMethod}
                      </Text>
                    </View>
                  )}
                  
                  {payment.transactionId && (
                    <View style={styles.detailRow}>
                      <MaterialCommunityIcons
                        name="receipt"
                        size={16}
                        color={theme.colors.primary}
                      />
                      <Text variant="bodySmall" style={styles.detailText}>
                        ID: {payment.transactionId}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {payment.status !== 'PAID' && (
                <Button
                  mode="contained"
                  onPress={() => handlePayment(payment)}
                  style={styles.payButton}
                  icon="credit-card"
                >
                  Bayar Sekarang
                </Button>
              )}
            </Card.Content>
          </Card>
        ))}

        {filteredList.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="credit-card-off"
              size={64}
              color={theme.colors.onSurfaceVariant}
            />
            <Text variant="titleMedium" style={styles.emptyTitle}>
              Tidak ada pembayaran
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtitle}>
              {searchQuery || selectedFilter !== 'ALL'
                ? 'Tidak ditemukan pembayaran sesuai filter'
                : 'Belum ada tagihan pembayaran'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  summaryCard: {
    margin: 16,
    elevation: 2,
  },
  summaryTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    marginLeft: 12,
    flex: 1,
  },
  summaryLabel: {
    opacity: 0.7,
  },
  summaryValue: {
    fontWeight: 'bold',
    marginTop: 2,
  },
  summaryAmount: {
    opacity: 0.8,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 16,
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
  paymentCard: {
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentTitle: {
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  paymentDescription: {
    opacity: 0.7,
  },
  statusChip: {
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  amount: {
    fontWeight: 'bold',
    color: '#0d9488',
  },
  dueDate: {
    opacity: 0.7,
    marginTop: 4,
  },
  paymentDetails: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    opacity: 0.7,
  },
  payButton: {
    marginTop: 8,
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
});
