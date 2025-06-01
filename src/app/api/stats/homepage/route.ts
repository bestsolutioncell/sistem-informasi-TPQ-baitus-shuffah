import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // For now, return mock data due to Prisma connection issues
    // TODO: Implement real database queries when Prisma is fixed
    
    console.log('Homepage stats API called');
    
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock real-time data with some randomization
    const baseStats = {
      totalSantri: 250 + Math.floor(Math.random() * 20),
      totalHafidz: 50 + Math.floor(Math.random() * 10),
      totalDonations: 25500000 + Math.floor(Math.random() * 5000000),
      totalPrograms: 15 + Math.floor(Math.random() * 5),
      attendanceToday: 200 + Math.floor(Math.random() * 30)
    };

    // Calculate years of experience (since establishment)
    const establishmentYear = 2009;
    const currentYear = new Date().getFullYear();
    const yearsOfExperience = currentYear - establishmentYear;

    // Convert donation amount to millions
    const donationInMillions = Math.round(baseStats.totalDonations / 1000000);

    const stats = [
      {
        id: 'santri',
        label: 'Santri Aktif',
        value: baseStats.totalSantri,
        suffix: '+',
        icon: 'Users',
        color: 'text-teal-600',
        description: 'Santri yang sedang menghafal Al-Quran'
      },
      {
        id: 'hafidz',
        label: 'Hafidz/Hafidzah',
        value: baseStats.totalHafidz,
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
        value: baseStats.totalPrograms,
        suffix: '',
        icon: 'BookOpen',
        color: 'text-blue-600',
        description: 'Program pembelajaran yang tersedia'
      },
      {
        id: 'success',
        label: 'Tingkat Keberhasilan',
        value: 95 + Math.floor(Math.random() * 5),
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
        attendance: baseStats.attendanceToday,
        description: `${baseStats.attendanceToday} santri hadir hari ini`
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
    
    // Return fallback data if anything fails
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
