'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  User, 
  GraduationCap, 
  Calendar, 
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Award,
  BookOpen,
  Heart,
  Target,
  Eye
} from 'lucide-react';

const WaliDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'WALI') {
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

  // Mock data for Wali
  const children = [
    {
      id: '1',
      name: 'Ahmad Fauzi',
      nis: '24001',
      halaqah: 'Halaqah Al-Fatihah',
      musyrif: 'Ustadz Abdullah',
      progress: 75, // percentage of Quran memorized
      lastHafalan: 'Al-Baqarah 1-10',
      attendanceRate: 95,
      photo: null
    }
  ];

  const recentHafalan = [
    {
      id: 1,
      surah: 'Al-Baqarah',
      ayah: '1-10',
      status: 'APPROVED',
      grade: 85,
      date: '2024-02-10',
      musyrif: 'Ustadz Abdullah'
    },
    {
      id: 2,
      surah: 'Al-Baqarah',
      ayah: '11-20',
      status: 'PENDING',
      grade: null,
      date: '2024-02-11',
      musyrif: 'Ustadz Abdullah'
    },
    {
      id: 3,
      surah: 'Al-Fatihah',
      ayah: '1-7',
      status: 'APPROVED',
      grade: 90,
      date: '2024-02-08',
      musyrif: 'Ustadz Abdullah'
    }
  ];

  const payments = [
    {
      id: '1',
      type: 'SPP',
      amount: 500000,
      dueDate: '2024-02-15',
      status: 'PENDING'
    },
    {
      id: '2',
      type: 'SPP',
      amount: 500000,
      dueDate: '2024-01-15',
      paidDate: '2024-01-10',
      status: 'PAID'
    },
    {
      id: '3',
      type: 'BOOK',
      amount: 200000,
      dueDate: '2024-02-20',
      status: 'PENDING'
    }
  ];

  const recentAttendance = [
    { date: '2024-02-12', status: 'PRESENT' },
    { date: '2024-02-11', status: 'PRESENT' },
    { date: '2024-02-10', status: 'LATE' },
    { date: '2024-02-09', status: 'PRESENT' },
    { date: '2024-02-08', status: 'PRESENT' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'PAID':
      case 'PRESENT':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'NEEDS_IMPROVEMENT':
      case 'OVERDUE':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'LATE':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'PAID':
      case 'PRESENT':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'NEEDS_IMPROVEMENT':
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      case 'LATE':
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

  const child = children[0]; // For demo, we'll show data for one child

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Wali Santri
          </h1>
          <p className="text-gray-600">
            Selamat datang kembali, {user.name}
          </p>
        </div>

        {/* Child Profile Card */}
        <Card className="bg-gradient-to-r from-teal-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-teal-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{child.name}</h3>
                <p className="text-gray-600">NIS: {child.nis}</p>
                <p className="text-sm text-gray-500">{child.halaqah} • {child.musyrif}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-teal-600">{child.progress}%</div>
                <div className="text-sm text-gray-500">Progress Hafalan</div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{child.attendanceRate}%</div>
                <div className="text-xs text-gray-500">Kehadiran</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">15</div>
                <div className="text-xs text-gray-500">Juz Selesai</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">A</div>
                <div className="text-xs text-gray-500">Rata-rata Nilai</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Hafalan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-teal-600" />
                  Hafalan Terbaru
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Lihat Semua
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentHafalan.map((hafalan) => (
                  <div key={hafalan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {hafalan.surah} ayat {hafalan.ayah}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {new Date(hafalan.date).toLocaleDateString('id-ID')} • {hafalan.musyrif}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {hafalan.grade && (
                        <span className="text-sm font-medium text-gray-900">
                          {hafalan.grade}
                        </span>
                      )}
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(hafalan.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(hafalan.status)}`}>
                          {hafalan.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Attendance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-teal-600" />
                  Kehadiran Terbaru
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Lihat Semua
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAttendance.map((attendance, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(attendance.date).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(attendance.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(attendance.status)}`}>
                        {attendance.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-teal-600" />
                Status Pembayaran
              </div>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                Lihat Semua
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {payment.type}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Jatuh tempo: {new Date(payment.dueDate).toLocaleDateString('id-ID')}
                      {payment.paidDate && (
                        <span> • Dibayar: {new Date(payment.paidDate).toLocaleDateString('id-ID')}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </span>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(payment.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                    {payment.status === 'PENDING' && (
                      <Button size="sm">
                        Bayar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 text-center bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors">
                <GraduationCap className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-teal-900">
                  Progress Hafalan
                </span>
              </button>
              
              <button className="p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-blue-900">
                  Riwayat Absensi
                </span>
              </button>
              
              <button className="p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-green-900">
                  Pembayaran
                </span>
              </button>
              
              <button className="p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-purple-900">
                  Laporan Bulanan
                </span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WaliDashboard;
