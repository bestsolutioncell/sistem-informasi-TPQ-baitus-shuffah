import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rumahtahfidz.com' },
    update: {},
    create: {
      email: 'admin@rumahtahfidz.com',
      name: 'Administrator',
      phone: '081234567890',
      role: 'ADMIN',
      password: adminPassword,
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create Musyrif Users
  const musyrifPassword = await bcrypt.hash('musyrif123', 10);
  const musyrif1 = await prisma.user.upsert({
    where: { email: 'ustadz.abdullah@rumahtahfidz.com' },
    update: {},
    create: {
      email: 'ustadz.abdullah@rumahtahfidz.com',
      name: 'Ustadz Abdullah',
      phone: '081234567891',
      role: 'MUSYRIF',
      password: musyrifPassword,
      isActive: true,
    },
  });

  const musyrif2 = await prisma.user.upsert({
    where: { email: 'ustadz.ahmad@rumahtahfidz.com' },
    update: {},
    create: {
      email: 'ustadz.ahmad@rumahtahfidz.com',
      name: 'Ustadz Ahmad',
      phone: '081234567892',
      role: 'MUSYRIF',
      password: musyrifPassword,
      isActive: true,
    },
  });

  console.log('✅ Musyrif users created');

  // Create Wali Users
  const waliPassword = await bcrypt.hash('wali123', 10);
  const wali1 = await prisma.user.upsert({
    where: { email: 'bapak.ahmad@gmail.com' },
    update: {},
    create: {
      email: 'bapak.ahmad@gmail.com',
      name: 'Bapak Ahmad Fauzi',
      phone: '081234567893',
      role: 'WALI',
      password: waliPassword,
      isActive: true,
    },
  });

  const wali2 = await prisma.user.upsert({
    where: { email: 'ibu.siti@gmail.com' },
    update: {},
    create: {
      email: 'ibu.siti@gmail.com',
      name: 'Ibu Siti Aminah',
      phone: '081234567894',
      role: 'WALI',
      password: waliPassword,
      isActive: true,
    },
  });

  console.log('✅ Wali users created');

  // Create Halaqah will be done later with new schema

  // Create Santri
  const santri1 = await prisma.santri.create({
    data: {
      nis: 'STR001',
      name: 'Muhammad Fauzi',
      birthDate: new Date('2010-05-15'),
      birthPlace: 'Jakarta',
      gender: 'MALE',
      address: 'Jl. Masjid No. 123, Jakarta Selatan',
      phone: '081234567895',
      email: 'fauzi@student.com',
      status: 'ACTIVE',
      waliId: wali1.id,
      halaqahId: null, // Will be assigned after halaqah creation
    },
  });

  const santri2 = await prisma.santri.create({
    data: {
      nis: 'STR002',
      name: 'Aisyah Zahra',
      birthDate: new Date('2011-08-20'),
      birthPlace: 'Bogor',
      gender: 'FEMALE',
      address: 'Jl. Pondok No. 456, Bogor',
      phone: '081234567896',
      email: 'aisyah@student.com',
      status: 'ACTIVE',
      waliId: wali2.id,
      halaqahId: null, // Will be assigned after halaqah creation
    },
  });

  const santri3 = await prisma.santri.create({
    data: {
      nis: 'STR003',
      name: 'Abdullah Rahman',
      birthDate: new Date('2009-12-10'),
      birthPlace: 'Depok',
      gender: 'MALE',
      address: 'Jl. Tahfidz No. 789, Depok',
      phone: '081234567897',
      status: 'ACTIVE',
      waliId: wali1.id,
      halaqahId: null, // Will be assigned after halaqah creation
    },
  });

  console.log('✅ Santri created');

  // Create Sample Hafalan Records
  await prisma.hafalan.createMany({
    data: [
      {
        santriId: santri1.id,
        musyrifId: musyrif1.id,
        surahId: 1,
        surahName: 'Al-Fatihah',
        ayahStart: 1,
        ayahEnd: 7,
        type: 'SETORAN',
        status: 'APPROVED',
        grade: 90,
        notes: 'Sangat baik, tajwid sudah benar',
      },
      {
        santriId: santri1.id,
        musyrifId: musyrif1.id,
        surahId: 2,
        surahName: 'Al-Baqarah',
        ayahStart: 1,
        ayahEnd: 20,
        type: 'SETORAN',
        status: 'APPROVED',
        grade: 85,
        notes: 'Baik, perlu perbaikan di beberapa ayat',
      },
      {
        santriId: santri2.id,
        musyrifId: musyrif2.id,
        surahId: 1,
        surahName: 'Al-Fatihah',
        ayahStart: 1,
        ayahEnd: 7,
        type: 'SETORAN',
        status: 'APPROVED',
        grade: 88,
        notes: 'Alhamdulillah, sudah lancar',
      },
    ],
  });

  console.log('✅ Hafalan records created');

  // Attendance will be created after halaqah seeding

  // Create Sample Payment Records
  await prisma.payment.createMany({
    data: [
      {
        santriId: santri1.id,
        type: 'SPP',
        amount: 300000,
        dueDate: new Date('2024-01-31'),
        status: 'PAID',
        method: 'BANK_TRANSFER',
        paidDate: new Date('2024-01-15'),
        notes: 'SPP Januari 2024',
      },
      {
        santriId: santri2.id,
        type: 'SPP',
        amount: 300000,
        dueDate: new Date('2024-01-31'),
        status: 'PENDING',
        notes: 'SPP Januari 2024',
      },
      {
        santriId: santri1.id,
        type: 'BOOK',
        amount: 150000,
        dueDate: new Date('2024-02-15'),
        status: 'PENDING',
        notes: 'Buku Tahfidz dan Tajwid',
      },
    ],
  });

  console.log('✅ Payment records created');

  // Create Sample News
  await prisma.news.createMany({
    data: [
      {
        title: 'Selamat Datang di Rumah Tahfidz Baitus Shuffah',
        excerpt: 'Sistem manajemen digital untuk memudahkan pembelajaran Al-Quran',
        content: 'Alhamdulillah, kami dengan bangga memperkenalkan sistem manajemen digital Rumah Tahfidz Baitus Shuffah. Sistem ini dirancang untuk memudahkan santri, wali, dan musyrif dalam mengelola pembelajaran Al-Quran.',
        author: 'Administrator',
        category: 'PENGUMUMAN',
        status: 'PUBLISHED',
        featured: true,
        publishedAt: new Date(),
      },
      {
        title: 'Prestasi Santri dalam Lomba Tahfidz Tingkat Kota',
        excerpt: 'Alhamdulillah, santri kami meraih juara dalam lomba tahfidz',
        content: 'Dengan bangga kami sampaikan bahwa santri Rumah Tahfidz Baitus Shuffah berhasil meraih prestasi gemilang dalam Lomba Tahfidz Tingkat Kota Jakarta.',
        author: 'Ustadz Abdullah',
        category: 'PRESTASI',
        status: 'PUBLISHED',
        featured: false,
        publishedAt: new Date(),
      },
    ],
  });

  console.log('✅ News articles created');

  // Seed Programs
  console.log('📚 Seeding programs...');
  const programs = await Promise.all([
    prisma.program.create({
      data: {
        title: 'Tahfidz Al-Quran',
        description: 'Program menghafal Al-Quran dengan metode yang mudah dan menyenangkan. Santri akan dibimbing untuk menghafal Al-Quran secara bertahap dengan teknik yang telah terbukti efektif.',
        features: JSON.stringify([
          'Metode Talaqqi (face to face)',
          'Bimbingan intensif dari ustadz berpengalaman',
          'Evaluasi hafalan berkala',
          'Target hafalan sesuai kemampuan',
          'Sertifikat kelulusan'
        ]),
        duration: '2-4 Tahun',
        ageGroup: '7-17 Tahun',
        schedule: 'Senin-Jumat 14:00-17:00',
        price: 'Rp 200.000/bulan',
        order: 1
      }
    }),
    prisma.program.create({
      data: {
        title: 'Tahsin Al-Quran',
        description: 'Program perbaikan bacaan Al-Quran sesuai kaidah tajwid yang benar. Fokus pada perbaikan makhorijul huruf dan kelancaran bacaan.',
        features: JSON.stringify([
          'Perbaikan makhorijul huruf',
          'Pembelajaran ahkamul huruf',
          'Praktik bacaan langsung',
          'Koreksi individual',
          'Materi tajwid lengkap'
        ]),
        duration: '6-12 Bulan',
        ageGroup: '5+ Tahun',
        schedule: 'Sabtu-Minggu 08:00-11:00',
        price: 'Rp 150.000/bulan',
        order: 2
      }
    }),
    prisma.program.create({
      data: {
        title: 'Baca Tulis Al-Quran (BTQ)',
        description: 'Program dasar untuk belajar membaca dan menulis huruf hijaiyah serta Al-Quran. Cocok untuk pemula yang belum bisa membaca Al-Quran.',
        features: JSON.stringify([
          'Pengenalan huruf hijaiyah',
          'Belajar menulis Arab',
          'Latihan membaca Al-Quran',
          'Metode Iqro dan Qiroati',
          'Bimbingan sabar dan telaten'
        ]),
        duration: '3-6 Bulan',
        ageGroup: '4+ Tahun',
        schedule: 'Senin-Jumat 14:00-16:00',
        price: 'Rp 100.000/bulan',
        order: 3
      }
    }),
    prisma.program.create({
      data: {
        title: 'Pendidikan Akhlak',
        description: 'Program pembentukan karakter islami dan akhlakul karimah. Santri akan diajarkan adab-adab islami dalam kehidupan sehari-hari.',
        features: JSON.stringify([
          'Pembelajaran adab islami',
          'Pembentukan akhlak mulia',
          'Keteladanan dari ustadz',
          'Praktik dalam kehidupan',
          'Monitoring perkembangan'
        ]),
        duration: 'Berkelanjutan',
        ageGroup: 'Semua Usia',
        schedule: 'Terintegrasi dengan program lain',
        price: 'Termasuk dalam program utama',
        order: 4
      }
    })
  ]);
  console.log('✅ Programs created');

  // Seed Testimonials
  console.log('💬 Seeding testimonials...');
  const testimonials = await Promise.all([
    prisma.testimonial.create({
      data: {
        content: 'Alhamdulillah, anak saya sangat senang belajar di TPQ Baitus Shuffah. Ustadz-ustadznya sabar dan metode mengajarnya mudah dipahami. Sekarang anak saya sudah hafal 5 juz.',
        rating: 5,
        isApproved: true,
        isFeatured: true,
        waliId: wali1.id,
        authorName: 'Bapak Ahmad',
        authorRole: 'WALI'
      }
    }),
    prisma.testimonial.create({
      data: {
        content: 'TPQ Baitus Shuffah memberikan pendidikan yang sangat baik. Tidak hanya hafalan Al-Quran, tapi juga pembentukan akhlak yang mulia. Terima kasih ustadz dan ustadzah.',
        rating: 5,
        isApproved: true,
        isFeatured: true,
        santriId: santri1.id,
        authorName: 'Muhammad Fauzi',
        authorRole: 'SANTRI'
      }
    }),
    prisma.testimonial.create({
      data: {
        content: 'Fasilitas di TPQ Baitus Shuffah sangat mendukung proses belajar. Ruang kelas nyaman, perpustakaan lengkap, dan lingkungan yang islami.',
        rating: 5,
        isApproved: true,
        isFeatured: false,
        authorName: 'Ibu Siti Aminah',
        authorRole: 'WALI'
      }
    })
  ]);
  console.log('✅ Testimonials created');

  // Seed Halaqah
  console.log('📚 Seeding halaqah...');
  const halaqah = await Promise.all([
    prisma.halaqah.create({
      data: {
        name: 'Halaqah Al-Fatihah',
        description: 'Halaqah untuk santri pemula yang baru belajar membaca Al-Quran',
        level: 'Pemula',
        capacity: 15,
        musyrifId: musyrif1.id,
        schedules: {
          create: [
            {
              dayOfWeek: 1, // Monday
              startTime: '14:00',
              endTime: '16:00',
              room: 'Ruang A1'
            },
            {
              dayOfWeek: 3, // Wednesday
              startTime: '14:00',
              endTime: '16:00',
              room: 'Ruang A1'
            }
          ]
        }
      }
    }),
    prisma.halaqah.create({
      data: {
        name: 'Halaqah Al-Baqarah',
        description: 'Halaqah untuk santri menengah yang sudah lancar membaca Al-Quran',
        level: 'Menengah',
        capacity: 20,
        musyrifId: musyrif2.id,
        schedules: {
          create: [
            {
              dayOfWeek: 2, // Tuesday
              startTime: '15:00',
              endTime: '17:00',
              room: 'Ruang B1'
            },
            {
              dayOfWeek: 4, // Thursday
              startTime: '15:00',
              endTime: '17:00',
              room: 'Ruang B1'
            }
          ]
        }
      }
    }),
    prisma.halaqah.create({
      data: {
        name: 'Halaqah Tahfidz 5 Juz',
        description: 'Halaqah khusus untuk santri yang ingin menghafal 5 juz pertama',
        level: 'Tahfidz 5 Juz',
        capacity: 12,
        musyrifId: musyrif1.id,
        schedules: {
          create: [
            {
              dayOfWeek: 6, // Saturday
              startTime: '08:00',
              endTime: '11:00',
              room: 'Ruang Tahfidz'
            },
            {
              dayOfWeek: 0, // Sunday
              startTime: '08:00',
              endTime: '11:00',
              room: 'Ruang Tahfidz'
            }
          ]
        }
      }
    })
  ]);
  console.log('✅ Halaqah created');

  // Assign santri to halaqah
  console.log('🔗 Assigning santri to halaqah...');
  await prisma.santri.update({
    where: { id: santri1.id },
    data: { halaqahId: halaqah[0].id } // Al-Fatihah
  });

  await prisma.santri.update({
    where: { id: santri2.id },
    data: { halaqahId: halaqah[1].id } // Al-Baqarah
  });

  await prisma.santri.update({
    where: { id: santri3.id },
    data: { halaqahId: halaqah[2].id } // Tahfidz 5 Juz
  });
  console.log('✅ Santri assigned to halaqah');

  // Seed Financial Accounts
  console.log('💰 Seeding financial accounts...');
  const financialAccounts = await Promise.all([
    prisma.financialAccount.create({
      data: {
        name: 'Kas Utama TPQ',
        type: 'CASH',
        balance: 5000000,
        isActive: true,
        description: 'Kas utama untuk operasional harian TPQ'
      }
    }),
    prisma.financialAccount.create({
      data: {
        name: 'Bank BCA TPQ',
        type: 'BANK',
        accountNumber: '1234567890',
        balance: 15000000,
        isActive: true,
        description: 'Rekening bank utama TPQ Baitus Shuffah'
      }
    }),
    prisma.financialAccount.create({
      data: {
        name: 'Bank BSI Syariah',
        type: 'BANK',
        accountNumber: '9876543210',
        balance: 8000000,
        isActive: true,
        description: 'Rekening syariah untuk dana zakat dan infaq'
      }
    }),
    prisma.financialAccount.create({
      data: {
        name: 'OVO TPQ',
        type: 'DIGITAL_WALLET',
        balance: 500000,
        isActive: true,
        description: 'Dompet digital untuk pembayaran online'
      }
    })
  ]);
  console.log('✅ Financial accounts created');

  // Seed Sample Transactions
  console.log('💸 Seeding sample transactions...');
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

  await Promise.all([
    // Income transactions
    prisma.transaction.create({
      data: {
        type: 'INCOME',
        category: 'SPP',
        amount: 200000,
        description: 'SPP Bulan Januari - Muhammad Fauzi',
        accountId: financialAccounts[1].id, // Bank BCA
        santriId: santri1.id,
        transactionDate: lastMonth,
        createdBy: admin.id
      }
    }),
    prisma.transaction.create({
      data: {
        type: 'INCOME',
        category: 'DONATION',
        amount: 1000000,
        description: 'Donasi dari Bapak Ahmad untuk pembangunan',
        accountId: financialAccounts[2].id, // Bank BSI
        transactionDate: lastMonth,
        createdBy: admin.id
      }
    }),
    prisma.transaction.create({
      data: {
        type: 'INCOME',
        category: 'REGISTRATION_FEE',
        amount: 150000,
        description: 'Biaya pendaftaran santri baru',
        accountId: financialAccounts[0].id, // Kas Utama
        transactionDate: today,
        createdBy: admin.id
      }
    }),
    // Expense transactions
    prisma.transaction.create({
      data: {
        type: 'EXPENSE',
        category: 'SALARY',
        amount: 2000000,
        description: 'Gaji Ustadz Abdullah bulan Januari',
        accountId: financialAccounts[1].id, // Bank BCA
        transactionDate: lastMonth,
        createdBy: admin.id
      }
    }),
    prisma.transaction.create({
      data: {
        type: 'EXPENSE',
        category: 'UTILITIES',
        amount: 300000,
        description: 'Tagihan listrik dan air bulan Januari',
        accountId: financialAccounts[0].id, // Kas Utama
        transactionDate: lastMonth,
        createdBy: admin.id
      }
    }),
    prisma.transaction.create({
      data: {
        type: 'EXPENSE',
        category: 'SUPPLIES',
        amount: 500000,
        description: 'Pembelian Al-Quran dan buku pelajaran',
        accountId: financialAccounts[1].id, // Bank BCA
        transactionDate: today,
        createdBy: admin.id
      }
    })
  ]);
  console.log('✅ Sample transactions created');

  // Seed SPP Settings
  console.log('🎓 Seeding SPP settings...');
  const sppSettings = await Promise.all([
    prisma.sPPSetting.create({
      data: {
        name: 'SPP Reguler',
        amount: 200000,
        description: 'SPP untuk program reguler TPQ',
        isActive: true,
        level: 'PEMULA'
      }
    }),
    prisma.sPPSetting.create({
      data: {
        name: 'SPP Tahfidz',
        amount: 300000,
        description: 'SPP untuk program tahfidz Al-Quran',
        isActive: true,
        level: 'TAHFIDZ'
      }
    }),
    prisma.sPPSetting.create({
      data: {
        name: 'SPP Intensif',
        amount: 250000,
        description: 'SPP untuk program intensif',
        isActive: true,
        level: 'LANJUTAN'
      }
    })
  ]);
  console.log('✅ SPP settings created');

  // Seed Sample SPP Records
  console.log('📋 Seeding sample SPP records...');
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  await Promise.all([
    // SPP untuk santri 1 (Pemula)
    prisma.sPPRecord.create({
      data: {
        santriId: santri1.id,
        sppSettingId: sppSettings[0].id, // SPP Reguler
        month: currentMonth,
        year: currentYear,
        amount: sppSettings[0].amount,
        dueDate: new Date(currentYear, currentMonth - 1, 10), // Tanggal 10 setiap bulan
        status: 'PAID',
        paidAmount: sppSettings[0].amount,
        paidDate: new Date(),
        paymentMethod: 'BANK_TRANSFER',
        receiptNumber: 'SPP001'
      }
    }),
    // SPP untuk santri 2 (Tahfidz)
    prisma.sPPRecord.create({
      data: {
        santriId: santri2.id,
        sppSettingId: sppSettings[1].id, // SPP Tahfidz
        month: currentMonth,
        year: currentYear,
        amount: sppSettings[1].amount,
        dueDate: new Date(currentYear, currentMonth - 1, 10),
        status: 'PENDING',
        paidAmount: 0
      }
    }),
    // SPP untuk santri 3 (Intensif)
    prisma.sPPRecord.create({
      data: {
        santriId: santri3.id,
        sppSettingId: sppSettings[2].id, // SPP Intensif
        month: currentMonth,
        year: currentYear,
        amount: sppSettings[2].amount,
        dueDate: new Date(currentYear, currentMonth - 1, 10),
        status: 'PARTIAL',
        paidAmount: 150000,
        paymentMethod: 'CASH',
        receiptNumber: 'SPP002'
      }
    }),
    // SPP bulan lalu untuk santri 1
    prisma.sPPRecord.create({
      data: {
        santriId: santri1.id,
        sppSettingId: sppSettings[0].id,
        month: currentMonth === 1 ? 12 : currentMonth - 1,
        year: currentMonth === 1 ? currentYear - 1 : currentYear,
        amount: sppSettings[0].amount,
        dueDate: new Date(currentMonth === 1 ? currentYear - 1 : currentYear, currentMonth === 1 ? 11 : currentMonth - 2, 10),
        status: 'OVERDUE',
        paidAmount: 0
      }
    })
  ]);
  console.log('✅ Sample SPP records created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Sample Login Credentials:');
  console.log('👨‍💼 Admin: admin@rumahtahfidz.com / admin123');
  console.log('👨‍🏫 Musyrif: ustadz.abdullah@rumahtahfidz.com / musyrif123');
  console.log('👨‍👩‍👧‍👦 Wali: bapak.ahmad@gmail.com / wali123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
