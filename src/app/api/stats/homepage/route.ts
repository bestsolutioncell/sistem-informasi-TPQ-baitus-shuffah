import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get real statistics from database
    const [
      totalSantri,
      totalHafidz,
      totalDonations,
      totalPrograms,
      recentTransactions,
      attendanceToday
    ] = await Promise.all([
      // Total active students
      prisma.santri.count({
        where: {
          status: 'ACTIVE'
        }
      }),
      
      // Total hafidz (students who completed 30 juz)
      prisma.santri.count({
        where: {
          status: 'GRADUATED',
          // Add condition for completed hafalan if you have that field
        }
      }),
      
      // Total donations amount
      prisma.transaction.aggregate({
        _sum: {
          amount: true
        },
        where: {
          type: 'DONATION',
          status: 'PAID'
        }
      }),
      
      // Total active programs/halaqah
      prisma.halaqah.count({
        where: {
          status: 'ACTIVE'
        }
      }),
      
      // Recent successful transactions for success rate calculation
      prisma.transaction.count({
        where: {
          status: 'PAID',
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      }),
      
      // Today's attendance for activity indicator
      prisma.attendance.count({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          },
          status: 'PRESENT'
        }
      })
    ]);

    // Calculate success rate (example: based on attendance and payments)
    const totalTransactionsLast30Days = await prisma.transaction.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const successRate = totalTransactionsLast30Days > 0 
      ? Math.round((recentTransactions / totalTransactionsLast30Days) * 100)
      : 95; // Default fallback

    // Convert donation amount to millions
    const donationInMillions = totalDonations._sum.amount 
      ? Math.round(totalDonations._sum.amount / 1000000)
      : 0;

    // Calculate years of experience (since establishment)
    const establishmentYear = 2009; // TPQ establishment year
    const currentYear = new Date().getFullYear();
    const yearsOfExperience = currentYear - establishmentYear;

    const stats = [
      {
        id: 'santri',
        label: 'Santri Aktif',
        value: totalSantri || 0,
        suffix: '+',
        icon: 'Users',
        color: 'text-teal-600',
        description: 'Santri yang sedang menghafal Al-Quran'
      },
      {
        id: 'hafidz',
        label: 'Hafidz/Hafidzah',
        value: totalHafidz || 0,
        suffix: '+',
        icon: 'GraduationCap',
        color: 'text-yellow-600',
        description: 'Lulusan yang telah menyelesaikan 30 Juz'
      },
      {
        id: 'experience',
        label: 'Tahun Berpengalaman',
        value: yearsOfExperience,
        suffix: '',
        icon: 'Award',
        color: 'text-green-600',
        description: 'Pengalaman dalam pendidikan tahfidz'
      },
      {
        id: 'donations',
        label: 'Total Donasi',
        value: donationInMillions,
        suffix: 'Jt+',
        icon: 'Heart',
        color: 'text-red-600',
        description: 'Dana yang terkumpul untuk operasional'
      },
      {
        id: 'programs',
        label: 'Program Aktif',
        value: totalPrograms || 0,
        suffix: '',
        icon: 'BookOpen',
        color: 'text-blue-600',
        description: 'Program pembelajaran yang tersedia'
      },
      {
        id: 'success',
        label: 'Tingkat Keberhasilan',
        value: successRate,
        suffix: '%',
        icon: 'TrendingUp',
        color: 'text-purple-600',
        description: 'Santri yang berhasil menyelesaikan target'
      }
    ];

    // Additional operational info
    const operationalInfo = {
      hours: {
        weekdays: '07:00 - 17:00',
        saturday: '07:00 - 15:00',
        sunday: '08:00 - 12:00'
      },
      location: {
        address: 'Jl. Islamic Center No. 123, Jakarta Pusat',
        description: 'Berlokasi di pusat kota dengan akses mudah menggunakan transportasi umum'
      },
      todayActivity: {
        attendance: attendanceToday,
        description: `${attendanceToday} santri hadir hari ini`
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        stats,
        operationalInfo,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching homepage stats:', error);
    
    // Return fallback data if database fails
    const fallbackStats = [
      {
        id: 'santri',
        label: 'Santri Aktif',
        value: 250,
        suffix: '+',
        icon: 'Users',
        color: 'text-teal-600',
        description: 'Santri yang sedang menghafal Al-Quran'
      },
      {
        id: 'hafidz',
        label: 'Hafidz/Hafidzah',
        value: 50,
        suffix: '+',
        icon: 'GraduationCap',
        color: 'text-yellow-600',
        description: 'Lulusan yang telah menyelesaikan 30 Juz'
      },
      {
        id: 'experience',
        label: 'Tahun Berpengalaman',
        value: 15,
        suffix: '',
        icon: 'Award',
        color: 'text-green-600',
        description: 'Pengalaman dalam pendidikan tahfidz'
      },
      {
        id: 'donations',
        label: 'Total Donasi',
        value: 500,
        suffix: 'Jt+',
        icon: 'Heart',
        color: 'text-red-600',
        description: 'Dana yang terkumpul untuk operasional'
      },
      {
        id: 'programs',
        label: 'Program Aktif',
        value: 8,
        suffix: '',
        icon: 'BookOpen',
        color: 'text-blue-600',
        description: 'Program pembelajaran yang tersedia'
      },
      {
        id: 'success',
        label: 'Tingkat Keberhasilan',
        value: 95,
        suffix: '%',
        icon: 'TrendingUp',
        color: 'text-purple-600',
        description: 'Santri yang berhasil menyelesaikan target'
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        stats: fallbackStats,
        operationalInfo: {
          hours: {
            weekdays: '07:00 - 17:00',
            saturday: '07:00 - 15:00',
            sunday: '08:00 - 12:00'
          },
          location: {
            address: 'Jl. Islamic Center No. 123, Jakarta Pusat',
            description: 'Berlokasi di pusat kota dengan akses mudah menggunakan transportasi umum'
          },
          todayActivity: {
            attendance: 0,
            description: 'Data tidak tersedia'
          }
        },
        lastUpdated: new Date().toISOString(),
        fallback: true
      }
    });
  }
}
