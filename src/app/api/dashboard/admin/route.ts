import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Admin dashboard API called');
    
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock real-time data with some randomization
    const baseData = {
      totalSantri: 250 + Math.floor(Math.random() * 20),
      totalHafidz: 50 + Math.floor(Math.random() * 10),
      donationsThisMonth: 25500000 + Math.floor(Math.random() * 5000000),
      sppThisMonth: 45200000 + Math.floor(Math.random() * 8000000),
      totalHalaqah: 15 + Math.floor(Math.random() * 5),
      attendanceToday: 200 + Math.floor(Math.random() * 30)
    };

    // Calculate mock changes (random between -5% to +15%)
    const getRandomChange = () => Math.floor(Math.random() * 20) - 5;

    // Format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };

    // Build stats array
    const stats = [
      {
        title: 'Total Santri',
        value: baseData.totalSantri.toString(),
        change: `+${Math.abs(getRandomChange())}%`,
        changeType: 'increase',
        icon: 'Users',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        title: 'Hafidz/Hafidzah',
        value: baseData.totalHafidz.toString(),
        change: `+${Math.abs(getRandomChange())}%`,
        changeType: 'increase',
        icon: 'GraduationCap',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        title: 'Total Donasi Bulan Ini',
        value: formatCurrency(baseData.donationsThisMonth),
        change: `+${Math.abs(getRandomChange())}%`,
        changeType: 'increase',
        icon: 'Heart',
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      },
      {
        title: 'Pendapatan SPP',
        value: formatCurrency(baseData.sppThisMonth),
        change: `+${Math.abs(getRandomChange())}%`,
        changeType: 'increase',
        icon: 'CreditCard',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      },
      {
        title: 'Halaqah Aktif',
        value: baseData.totalHalaqah.toString(),
        change: `+${Math.abs(getRandomChange())}%`,
        changeType: 'increase',
        icon: 'BookOpen',
        color: 'text-teal-600',
        bgColor: 'bg-teal-50'
      },
      {
        title: 'Kehadiran Hari Ini',
        value: `${baseData.attendanceToday}`,
        change: `+${Math.abs(getRandomChange())}%`,
        changeType: 'increase',
        icon: 'Calendar',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      }
    ];

    // Mock recent activities
    const recentActivities = [
      {
        id: 'transaction-1',
        type: 'spp',
        message: `Pembayaran SPP dari Ahmad Fauzi sebesar ${formatCurrency(150000)}`,
        time: '5 menit yang lalu',
        icon: 'CreditCard',
        color: 'text-green-600'
      },
      {
        id: 'donation-1',
        type: 'donation',
        message: `Donasi dari Ibu Siti sebesar ${formatCurrency(500000)}`,
        time: '15 menit yang lalu',
        icon: 'Heart',
        color: 'text-red-600'
      },
      {
        id: 'hafalan-1',
        type: 'hafalan',
        message: 'Muhammad Rizki menyelesaikan hafalan Surah Al-Baqarah',
        time: '1 jam yang lalu',
        icon: 'Award',
        color: 'text-yellow-600'
      },
      {
        id: 'registration-1',
        type: 'registration',
        message: 'Pendaftaran santri baru: Fatimah Zahra',
        time: '2 jam yang lalu',
        icon: 'Users',
        color: 'text-blue-600'
      }
    ];

    // Mock upcoming events
    const upcomingEvents = [
      {
        id: 1,
        title: 'Ujian Hafalan Juz 30',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        time: '08:00',
        participants: 25
      },
      {
        id: 2,
        title: 'Wisuda Hafidz Angkatan 16',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        time: '09:00',
        participants: 15
      },
      {
        id: 3,
        title: 'Rapat Wali Santri',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        time: '14:00',
        participants: 100
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        stats,
        recentActivities,
        upcomingEvents,
        summary: {
          totalSantri: baseData.totalSantri,
          totalHafidz: baseData.totalHafidz,
          totalHalaqah: baseData.totalHalaqah,
          attendanceToday: baseData.attendanceToday,
          donationsThisMonth: baseData.donationsThisMonth,
          sppThisMonth: baseData.sppThisMonth
        },
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    
    // Return fallback data
    return NextResponse.json({
      success: true,
      data: {
        stats: [
          {
            title: 'Total Santri',
            value: '250',
            change: '+12%',
            changeType: 'increase',
            icon: 'Users',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Hafidz/Hafidzah',
            value: '50',
            change: '+5%',
            changeType: 'increase',
            icon: 'GraduationCap',
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Total Donasi Bulan Ini',
            value: 'Rp 25.500.000',
            change: '+15%',
            changeType: 'increase',
            icon: 'Heart',
            color: 'text-red-600',
            bgColor: 'bg-red-50'
          },
          {
            title: 'Pendapatan SPP',
            value: 'Rp 45.200.000',
            change: '+8%',
            changeType: 'increase',
            icon: 'CreditCard',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          }
        ],
        recentActivities: [
          {
            id: 'fallback-1',
            type: 'info',
            message: 'Data aktivitas tidak tersedia',
            time: 'Baru saja',
            icon: 'Info',
            color: 'text-gray-600'
          }
        ],
        upcomingEvents: [
          {
            id: 1,
            title: 'Event akan segera tersedia',
            date: new Date(),
            time: '00:00',
            participants: 0
          }
        ],
        summary: {
          totalSantri: 250,
          totalHafidz: 50,
          totalHalaqah: 15,
          attendanceToday: 200,
          donationsThisMonth: 25500000,
          sppThisMonth: 45200000
        },
        lastUpdated: new Date().toISOString(),
        fallback: true
      }
    });
  }
}
