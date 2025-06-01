'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  Heart, 
  Search, 
  Filter,
  Download,
  Plus,
  Eye,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Building,
  BookOpen,
  GraduationCap,
  Utensils
} from 'lucide-react';

interface Donation {
  id: string;
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  amount: number;
  type: 'GENERAL' | 'BUILDING' | 'SCHOLARSHIP' | 'EQUIPMENT' | 'RAMADAN' | 'QURBAN';
  method: 'CASH' | 'BANK_TRANSFER' | 'QRIS' | 'E_WALLET' | 'CREDIT_CARD';
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  reference?: string;
  message?: string;
  isAnonymous: boolean;
  createdAt: string;
  paidAt?: string;
}

const DonationsPage = () => {
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'ADMIN') {
        router.push('/login');
      } else {
        setUser(parsedUser);
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Mock data - in real app, fetch from API
  const donationList: Donation[] = [
    {
      id: '1',
      donorName: 'Bapak Ahmad Fulan',
      donorEmail: 'ahmad@email.com',
      donorPhone: '081234567890',
      amount: 1000000,
      type: 'GENERAL',
      method: 'BANK_TRANSFER',
      status: 'PAID',
      reference: 'DON001',
      message: 'Semoga bermanfaat untuk kemajuan rumah tahfidz',
      isAnonymous: false,
      createdAt: '2024-02-10T10:00:00Z',
      paidAt: '2024-02-10T10:15:00Z'
    },
    {
      id: '2',
      donorName: 'Donatur Anonim',
      amount: 500000,
      type: 'SCHOLARSHIP',
      method: 'E_WALLET',
      status: 'PAID',
      reference: 'DON002',
      message: 'Untuk beasiswa santri kurang mampu',
      isAnonymous: true,
      createdAt: '2024-02-09T14:30:00Z',
      paidAt: '2024-02-09T14:35:00Z'
    },
    {
      id: '3',
      donorName: 'Ibu Siti Khadijah',
      donorEmail: 'siti@email.com',
      donorPhone: '081234567891',
      amount: 2000000,
      type: 'BUILDING',
      method: 'QRIS',
      status: 'PAID',
      reference: 'DON003',
      message: 'Untuk pembangunan gedung baru',
      isAnonymous: false,
      createdAt: '2024-02-08T09:00:00Z',
      paidAt: '2024-02-08T09:05:00Z'
    },
    {
      id: '4',
      donorName: 'PT. Berkah Sejahtera',
      donorEmail: 'csr@berkahsejahtera.com',
      donorPhone: '021-12345678',
      amount: 5000000,
      type: 'GENERAL',
      method: 'BANK_TRANSFER',
      status: 'PENDING',
      reference: 'DON004',
      message: 'CSR untuk pendidikan Islam',
      isAnonymous: false,
      createdAt: '2024-02-11T16:00:00Z'
    },
    {
      id: '5',
      donorName: 'Keluarga Besar Abdullah',
      donorEmail: 'abdullah.family@email.com',
      amount: 750000,
      type: 'EQUIPMENT',
      method: 'CREDIT_CARD',
      status: 'PAID',
      reference: 'DON005',
      message: 'Untuk pengadaan Al-Quran dan buku pembelajaran',
      isAnonymous: false,
      createdAt: '2024-02-07T11:20:00Z',
      paidAt: '2024-02-07T11:25:00Z'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'GENERAL':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'BUILDING':
        return <Building className="h-4 w-4 text-blue-500" />;
      case 'SCHOLARSHIP':
        return <GraduationCap className="h-4 w-4 text-green-500" />;
      case 'EQUIPMENT':
        return <BookOpen className="h-4 w-4 text-purple-500" />;
      case 'RAMADAN':
        return <Calendar className="h-4 w-4 text-yellow-500" />;
      case 'QURBAN':
        return <Utensils className="h-4 w-4 text-orange-500" />;
      default:
        return <Heart className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'GENERAL':
        return 'bg-red-100 text-red-800';
      case 'BUILDING':
        return 'bg-blue-100 text-blue-800';
      case 'SCHOLARSHIP':
        return 'bg-green-100 text-green-800';
      case 'EQUIPMENT':
        return 'bg-purple-100 text-purple-800';
      case 'RAMADAN':
        return 'bg-yellow-100 text-yellow-800';
      case 'QURBAN':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDonations = donationList.filter(donation => {
    const matchesSearch = donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || donation.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || donation.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: donationList.length,
    totalAmount: donationList.filter(d => d.status === 'PAID').reduce((sum, d) => sum + d.amount, 0),
    pending: donationList.filter(d => d.status === 'PENDING').length,
    pendingAmount: donationList.filter(d => d.status === 'PENDING').reduce((sum, d) => sum + d.amount, 0),
    thisMonth: donationList.filter(d => {
      const donationDate = new Date(d.createdAt);
      const now = new Date();
      return donationDate.getMonth() === now.getMonth() && 
             donationDate.getFullYear() === now.getFullYear() &&
             d.status === 'PAID';
    }).reduce((sum, d) => sum + d.amount, 0),
    donors: new Set(donationList.filter(d => !d.isAnonymous).map(d => d.donorName)).size
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manajemen Donasi
            </h1>
            <p className="text-gray-600">
              Kelola dan pantau donasi yang masuk
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Laporan
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Catat Donasi Manual
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Donasi</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats.totalAmount)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bulan Ini</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(stats.thisMonth)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {formatCurrency(stats.pendingAmount)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Donatur</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.donors}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donation Categories Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Donasi per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { type: 'GENERAL', name: 'Donasi Umum', target: 100000000, collected: 75000000, icon: Heart },
                { type: 'BUILDING', name: 'Pembangunan', target: 500000000, collected: 320000000, icon: Building },
                { type: 'SCHOLARSHIP', name: 'Beasiswa', target: 200000000, collected: 150000000, icon: GraduationCap },
                { type: 'EQUIPMENT', name: 'Peralatan', target: 50000000, collected: 35000000, icon: BookOpen }
              ].map((category) => {
                const Icon = category.icon;
                const percentage = (category.collected / category.target) * 100;
                
                return (
                  <div key={category.type} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Icon className="h-5 w-5 text-teal-600 mr-2" />
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Terkumpul</span>
                        <span className="font-medium">{Math.round(percentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatCurrency(category.collected)}</span>
                      <span>{formatCurrency(category.target)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Donasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Cari donatur, referensi, atau pesan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 bg-white"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="PAID">Lunas</option>
                  <option value="PENDING">Pending</option>
                  <option value="CANCELLED">Dibatalkan</option>
                </select>
                
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 bg-white"
                >
                  <option value="ALL">Semua Kategori</option>
                  <option value="GENERAL">Umum</option>
                  <option value="BUILDING">Pembangunan</option>
                  <option value="SCHOLARSHIP">Beasiswa</option>
                  <option value="EQUIPMENT">Peralatan</option>
                  <option value="RAMADAN">Ramadan</option>
                  <option value="QURBAN">Qurban</option>
                </select>
                
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Donations Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Donatur</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Jumlah</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Kategori</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Metode</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Tanggal</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.map((donation) => (
                    <tr key={donation.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {donation.isAnonymous ? 'Donatur Anonim' : donation.donorName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {donation.reference}
                            {donation.donorEmail && !donation.isAnonymous && (
                              <span> • {donation.donorEmail}</span>
                            )}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(donation.amount)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(donation.type)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(donation.type)}`}>
                            {donation.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-900">{donation.method}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(donation.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                            {donation.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm text-gray-900">
                            {formatDateTime(donation.createdAt)}
                          </p>
                          {donation.paidAt && (
                            <p className="text-xs text-green-600">
                              Dibayar: {formatDateTime(donation.paidAt)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDonations.length === 0 && (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tidak ada donasi ditemukan
                </h3>
                <p className="text-gray-500">
                  Coba ubah filter atau kata kunci pencarian
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DonationsPage;
