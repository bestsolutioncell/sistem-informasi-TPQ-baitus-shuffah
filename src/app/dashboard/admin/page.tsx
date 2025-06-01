'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Users, 
  GraduationCap, 
  Heart, 
  TrendingUp,
  Calendar,
  CreditCard,
  BookOpen,
  Award,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
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
  const stats = [
    {
      title: 'Total Santri',
      value: '250',
      change: '+12',
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Hafidz/Hafidzah',
      value: '50',
      change: '+5',
      changeType: 'increase',
      icon: GraduationCap,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Donasi Bulan Ini',
      value: 'Rp 25.5M',
      change: '+15%',
      changeType: 'increase',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Pendapatan SPP',
      value: 'Rp 45.2M',
      change: '+8%',
      changeType: 'increase',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Halaqah Aktif',
      value: '15',
      change: '+2',
      changeType: 'increase',
      icon: BookOpen,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      title: 'Tingkat Kehadiran',
      value: '95%',
      change: '+2%',
      changeType: 'increase',
      icon: Calendar,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'payment',
      message: 'Pembayaran SPP dari Ahmad Fauzi telah diterima',
      time: '5 menit yang lalu',
      icon: CreditCard,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'donation',
      message: 'Donasi Rp 500.000 dari Ibu Siti untuk program beasiswa',
      time: '15 menit yang lalu',
      icon: Heart,
      color: 'text-red-600'
    },
    {
      id: 3,
      type: 'hafalan',
      message: 'Muhammad Rizki menyelesaikan hafalan Surah Al-Baqarah',
      time: '1 jam yang lalu',
      icon: Award,
      color: 'text-yellow-600'
    },
    {
      id: 4,
      type: 'registration',
      message: 'Pendaftaran santri baru: Fatimah Zahra',
      time: '2 jam yang lalu',
      icon: Users,
      color: 'text-blue-600'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Ujian Hafalan Juz 30',
      date: '2024-02-15',
      time: '08:00',
      participants: 25
    },
    {
      id: 2,
      title: 'Wisuda Hafidz Angkatan 16',
      date: '2024-02-20',
      time: '09:00',
      participants: 15
    },
    {
      id: 3,
      title: 'Rapat Wali Santri',
      date: '2024-02-25',
      time: '14:00',
      participants: 100
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Admin
          </h1>
          <p className="text-gray-600">
            Selamat datang kembali, {user.name}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <div className="flex items-center mt-2">
                        {stat.changeType === 'increase' ? (
                          <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                          stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          dari bulan lalu
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-teal-600" />
                Aktivitas Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full bg-gray-50`}>
                        <Icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-teal-600" />
                Kegiatan Mendatang
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {event.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString('id-ID')} • {event.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-teal-600">
                        {event.participants}
                      </p>
                      <p className="text-xs text-gray-500">
                        peserta
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 text-center bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors">
                <Users className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-teal-900">
                  Tambah Santri
                </span>
              </button>
              
              <button className="p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-blue-900">
                  Buat Halaqah
                </span>
              </button>
              
              <button className="p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-green-900">
                  Kelola Pembayaran
                </span>
              </button>
              
              <button className="p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-purple-900">
                  Lihat Laporan
                </span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
