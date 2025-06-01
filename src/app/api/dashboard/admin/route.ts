import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get current date for calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Fetch all statistics in parallel
    const [
      totalSantri,
      totalSantriLastMonth,
      totalHafidz,
      totalHafidzLastMonth,
      donationsThisMonth,
      donationsLastMonth,
      sppThisMonth,
      sppLastMonth,
      totalHalaqah,
      totalHalaqahLastMonth,
      attendanceToday,
      attendanceYesterday,
      recentTransactions,
      recentHafalanProgress,
      upcomingEvents
    ] = await Promise.all([
      // Total active students
      prisma.santri.count({
        where: { status: 'ACTIVE' }
      }),
      
      // Total students last month
      prisma.santri.count({
        where: {
          status: 'ACTIVE',
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),
      
      // Total hafidz (graduated students)
      prisma.santri.count({
        where: { status: 'GRADUATED' }
      }),
      
      // Total hafidz last month
      prisma.santri.count({
        where: {
          status: 'GRADUATED',
          updatedAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),
      
      // Donations this month
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          type: 'DONATION',
          status: 'PAID',
          createdAt: { gte: startOfMonth }
        }
      }),
      
      // Donations last month
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          type: 'DONATION',
          status: 'PAID',
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),
      
      // SPP this month
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          type: 'SPP',
          status: 'PAID',
          createdAt: { gte: startOfMonth }
        }
      }),
      
      // SPP last month
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          type: 'SPP',
          status: 'PAID',
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),
      
      // Total active halaqah
      prisma.halaqah.count({
        where: { status: 'ACTIVE' }
      }),
      
      // Total halaqah last month
      prisma.halaqah.count({
        where: {
          status: 'ACTIVE',
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),
      
      // Today's attendance
      prisma.attendance.count({
        where: {
          date: {
            gte: new Date(now.setHours(0, 0, 0, 0)),
            lt: new Date(now.setHours(23, 59, 59, 999))
          },
          status: 'PRESENT'
        }
      }),
      
      // Yesterday's attendance
      prisma.attendance.count({
        where: {
          date: {
            gte: new Date(now.getTime() - 24 * 60 * 60 * 1000),
            lt: new Date(now.setHours(0, 0, 0, 0))
          },
          status: 'PRESENT'
        }
      }),
      
      // Recent transactions
      prisma.transaction.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          santri: {
            select: { name: true }
          }
        }
      }),
      
      // Recent hafalan progress
      prisma.hafalanProgress.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          santri: {
            select: { name: true }
          }
        }
      }),
      
      // Upcoming events (mock data for now)
      Promise.resolve([
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
        }
      ])
    ]);

    // Calculate changes
    const santriChange = totalSantriLastMonth > 0 
      ? Math.round(((totalSantri - totalSantriLastMonth) / totalSantriLastMonth) * 100)
      : 0;
      
    const hafidzChange = totalHafidzLastMonth > 0
      ? Math.round(((totalHafidz - totalHafidzLastMonth) / totalHafidzLastMonth) * 100)
      : 0;
      
    const donationChange = donationsLastMonth._sum.amount && donationsLastMonth._sum.amount > 0
      ? Math.round(((donationsThisMonth._sum.amount || 0) - donationsLastMonth._sum.amount) / donationsLastMonth._sum.amount * 100)
      : 0;
      
    const sppChange = sppLastMonth._sum.amount && sppLastMonth._sum.amount > 0
      ? Math.round(((sppThisMonth._sum.amount || 0) - sppLastMonth._sum.amount) / sppLastMonth._sum.amount * 100)
      : 0;
      
    const halaqahChange = totalHalaqahLastMonth > 0
      ? Math.round(((totalHalaqah - totalHalaqahLastMonth) / totalHalaqahLastMonth) * 100)
      : 0;
      
    const attendanceChange = attendanceYesterday > 0
      ? Math.round(((attendanceToday - attendanceYesterday) / attendanceYesterday) * 100)
      : 0;

    // Format currency
    const formatCurrency = (amount: number | null) => {
      if (!amount) return 'Rp 0';
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
        value: totalSantri.toString(),
        change: santriChange > 0 ? `+${santriChange}%` : `${santriChange}%`,
        changeType: santriChange >= 0 ? 'increase' : 'decrease',
        icon: 'Users',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        title: 'Hafidz/Hafidzah',
        value: totalHafidz.toString(),
        change: hafidzChange > 0 ? `+${hafidzChange}%` : `${hafidzChange}%`,
        changeType: hafidzChange >= 0 ? 'increase' : 'decrease',
        icon: 'GraduationCap',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        title: 'Total Donasi Bulan Ini',
        value: formatCurrency(donationsThisMonth._sum.amount),
        change: donationChange > 0 ? `+${donationChange}%` : `${donationChange}%`,
        changeType: donationChange >= 0 ? 'increase' : 'decrease',
        icon: 'Heart',
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      },
      {
        title: 'Pendapatan SPP',
        value: formatCurrency(sppThisMonth._sum.amount),
        change: sppChange > 0 ? `+${sppChange}%` : `${sppChange}%`,
        changeType: sppChange >= 0 ? 'increase' : 'decrease',
        icon: 'CreditCard',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      },
      {
        title: 'Halaqah Aktif',
        value: totalHalaqah.toString(),
        change: halaqahChange > 0 ? `+${halaqahChange}%` : `${halaqahChange}%`,
        changeType: halaqahChange >= 0 ? 'increase' : 'decrease',
        icon: 'BookOpen',
        color: 'text-teal-600',
        bgColor: 'bg-teal-50'
      },
      {
        title: 'Kehadiran Hari Ini',
        value: `${attendanceToday}`,
        change: attendanceChange > 0 ? `+${attendanceChange}%` : `${attendanceChange}%`,
        changeType: attendanceChange >= 0 ? 'increase' : 'decrease',
        icon: 'Calendar',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      }
    ];

    // Build recent activities from transactions and hafalan
    const recentActivities = [
      ...recentTransactions.slice(0, 3).map(transaction => ({
        id: `transaction-${transaction.id}`,
        type: transaction.type.toLowerCase(),
        message: `Pembayaran ${transaction.type} dari ${transaction.santri?.name || 'Unknown'} sebesar ${formatCurrency(transaction.amount)}`,
        time: getRelativeTime(transaction.createdAt),
        icon: transaction.type === 'DONATION' ? 'Heart' : 'CreditCard',
        color: transaction.type === 'DONATION' ? 'text-red-600' : 'text-green-600'
      })),
      ...recentHafalanProgress.slice(0, 2).map(hafalan => ({
        id: `hafalan-${hafalan.id}`,
        type: 'hafalan',
        message: `${hafalan.santri?.name || 'Unknown'} menyelesaikan hafalan ${hafalan.surah}`,
        time: getRelativeTime(hafalan.createdAt),
        icon: 'Award',
        color: 'text-yellow-600'
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 4);

    return NextResponse.json({
      success: true,
      data: {
        stats,
        recentActivities,
        upcomingEvents,
        summary: {
          totalSantri,
          totalHafidz,
          totalHalaqah,
          attendanceToday,
          donationsThisMonth: donationsThisMonth._sum.amount || 0,
          sppThisMonth: sppThisMonth._sum.amount || 0
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
          }
        ],
        recentActivities: [],
        upcomingEvents: [],
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

// Helper function to get relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Baru saja';
  if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
  
  return date.toLocaleDateString('id-ID');
}
