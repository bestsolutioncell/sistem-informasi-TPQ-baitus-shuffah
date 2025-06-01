import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Linking
} from 'react-native';
import {
  Text,
  Card,
  Button,
  useTheme,
  Chip,
  Divider,
  ActivityIndicator,
  FAB
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ApiService from '../../services/ApiService';

interface PaymentItem {
  id: string;
  name: string;
  amount: number;
  type: 'SPP' | 'DONATION' | 'EVENT';
  dueDate?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  description?: string;
}

export default function PaymentScreen() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getPayments();

      if (response.success && response.data) {
        // Transform API data to PaymentItem format
        const transformedPayments: PaymentItem[] = response.data.map((payment: any) => ({
          id: payment.id,
          name: payment.description || 'Pembayaran',
          amount: payment.amount,
          type: payment.type === 'INCOME' ? 'SPP' : 'DONATION',
          dueDate: payment.dueDate,
          status: payment.status === 'PAID' ? 'PAID' : 'PENDING',
          description: payment.description
        }));
        setPayments(transformedPayments);
      } else {
        // Mock data for demo
        setPayments([
          {
            id: '1',
            name: 'SPP Bulan Januari 2024',
            amount: 150000,
            type: 'SPP',
            dueDate: '2024-01-31',
            status: 'PENDING',
            description: 'Pembayaran SPP bulanan'
          },
          {
            id: '2',
            name: 'Donasi Pembangunan Masjid',
            amount: 100000,
            type: 'DONATION',
            status: 'PENDING',
            description: 'Donasi untuk pembangunan masjid TPQ'
          },
          {
            id: '3',
            name: 'SPP Bulan Desember 2023',
            amount: 150000,
            type: 'SPP',
            dueDate: '2023-12-31',
            status: 'PAID',
            description: 'Pembayaran SPP bulanan'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading payments:', error);
      Alert.alert('Error', 'Gagal memuat data pembayaran');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPayments();
    setRefreshing(false);
  };

  const handlePayment = async (payment: PaymentItem) => {
    try {
      Alert.alert(
        'Konfirmasi Pembayaran',
        `Apakah Anda yakin ingin melakukan pembayaran ${payment.name} sebesar ${formatCurrency(payment.amount)}?`,
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Bayar',
            onPress: async () => {
              // Create payment request
              const paymentData = {
                items: [{
                  id: payment.id,
                  name: payment.name,
                  price: payment.amount,
                  quantity: 1,
                  category: payment.type.toLowerCase()
                }],
                customer: {
                  name: 'Mobile User',
                  email: 'user@mobile.app'
                }
              };

              const response = await ApiService.createPayment(paymentData);

              if (response.success && response.data?.paymentUrl) {
                // Open payment URL in browser
                Linking.openURL(response.data.paymentUrl);
              } else {
                Alert.alert('Error', 'Gagal membuat pembayaran');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error creating payment:', error);
      Alert.alert('Error', 'Gagal memproses pembayaran');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return theme.colors.primary;
      case 'OVERDUE': return theme.colors.error;
      default: return theme.colors.secondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PAID': return 'Lunas';
      case 'OVERDUE': return 'Terlambat';
      default: return 'Belum Bayar';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SPP': return 'school';
      case 'DONATION': return 'heart';
      case 'EVENT': return 'calendar';
      default: return 'credit-card';
    }
  };

  const pendingPayments = payments.filter(p => p.status !== 'PAID');
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Memuat data pembayaran...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.summaryTitle}>
              Ringkasan Pembayaran
            </Text>
            <View style={styles.summaryRow}>
              <Text variant="bodyLarge">Total Tagihan:</Text>
              <Text variant="titleLarge" style={styles.totalAmount}>
                {formatCurrency(totalPending)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium">Jumlah Tagihan:</Text>
              <Text variant="bodyMedium">{pendingPayments.length} item</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Payment List */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Daftar Pembayaran
        </Text>

        {payments.map((payment) => (
          <Card key={payment.id} style={styles.paymentCard}>
            <Card.Content>
              <View style={styles.paymentHeader}>
                <View style={styles.paymentInfo}>
                  <MaterialCommunityIcons
                    name={getTypeIcon(payment.type)}
                    size={24}
                    color={theme.colors.primary}
                    style={styles.paymentIcon}
                  />
                  <View style={styles.paymentDetails}>
                    <Text variant="titleMedium" style={styles.paymentName}>
                      {payment.name}
                    </Text>
                    <Text variant="bodyMedium" style={styles.paymentDescription}>
                      {payment.description}
                    </Text>
                    {payment.dueDate && (
                      <Text variant="bodySmall" style={styles.dueDate}>
                        Jatuh tempo: {new Date(payment.dueDate).toLocaleDateString('id-ID')}
                      </Text>
                    )}
                  </View>
                </View>
                <Chip
                  mode="outlined"
                  textStyle={{ color: getStatusColor(payment.status) }}
                  style={{ borderColor: getStatusColor(payment.status) }}
                >
                  {getStatusLabel(payment.status)}
                </Chip>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.paymentFooter}>
                <Text variant="titleLarge" style={styles.amount}>
                  {formatCurrency(payment.amount)}
                </Text>
                {payment.status !== 'PAID' && (
                  <Button
                    mode="contained"
                    onPress={() => handlePayment(payment)}
                    style={styles.payButton}
                  >
                    Bayar
                  </Button>
                )}
              </View>
            </Card.Content>
          </Card>
        ))}

        {payments.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <MaterialCommunityIcons
                name="credit-card-off"
                size={64}
                color={theme.colors.outline}
              />
              <Text variant="titleMedium" style={styles.emptyTitle}>
                Tidak Ada Pembayaran
              </Text>
              <Text variant="bodyMedium" style={styles.emptyDescription}>
                Saat ini tidak ada tagihan pembayaran yang perlu diselesaikan
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {pendingPayments.length > 0 && (
        <FAB
          icon="credit-card"
          label={`Bayar Semua (${formatCurrency(totalPending)})`}
          style={styles.fab}
          onPress={() => {
            Alert.alert(
              'Bayar Semua Tagihan',
              `Total yang harus dibayar: ${formatCurrency(totalPending)}`,
              [
                { text: 'Batal', style: 'cancel' },
                { text: 'Bayar Semua', onPress: () => {
                  // Handle pay all
                  Alert.alert('Info', 'Fitur bayar semua akan segera tersedia');
                }}
              ]
            );
          }}
        />
      )}
    </View>
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
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  summaryCard: {
    margin: 16,
    elevation: 4,
  },
  summaryTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalAmount: {
    fontWeight: 'bold',
    color: '#0d9488',
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  paymentCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  paymentInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  paymentIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  paymentDescription: {
    opacity: 0.7,
    marginBottom: 4,
  },
  dueDate: {
    opacity: 0.6,
    fontStyle: 'italic',
  },
  divider: {
    marginVertical: 12,
  },
  paymentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontWeight: 'bold',
    color: '#0d9488',
  },
  payButton: {
    paddingHorizontal: 16,
  },
  emptyCard: {
    margin: 16,
    elevation: 2,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  emptyDescription: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
