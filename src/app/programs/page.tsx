'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import {
  BookOpen,
  Users,
  Clock,
  Award,
  Target,
  Star,
  CheckCircle,
  Calendar,
  GraduationCap,
  Heart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';

interface Program {
  id: string;
  title: string;
  description: string;
  features: string[];
  duration: string;
  ageGroup: string;
  schedule: string;
  price: string;
  image?: string;
  isActive: boolean;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  // Default programs (will be replaced with database data)
  const defaultPrograms: Program[] = [
    {
      id: '1',
      title: 'Tahfidz Al-Quran',
      description: 'Program menghafal Al-Quran dengan metode yang mudah dan menyenangkan. Santri akan dibimbing untuk menghafal Al-Quran secara bertahap dengan teknik yang telah terbukti efektif.',
      features: [
        'Metode Talaqqi (face to face)',
        'Bimbingan intensif dari ustadz berpengalaman',
        'Evaluasi hafalan berkala',
        'Target hafalan sesuai kemampuan',
        'Sertifikat kelulusan'
      ],
      duration: '2-4 Tahun',
      ageGroup: '7-17 Tahun',
      schedule: 'Senin-Jumat 14:00-17:00',
      price: 'Rp 200.000/bulan',
      isActive: true
    },
    {
      id: '2',
      title: 'Tahsin Al-Quran',
      description: 'Program perbaikan bacaan Al-Quran sesuai kaidah tajwid yang benar. Fokus pada perbaikan makhorijul huruf dan kelancaran bacaan.',
      features: [
        'Perbaikan makhorijul huruf',
        'Pembelajaran ahkamul huruf',
        'Praktik bacaan langsung',
        'Koreksi individual',
        'Materi tajwid lengkap'
      ],
      duration: '6-12 Bulan',
      ageGroup: '5+ Tahun',
      schedule: 'Sabtu-Minggu 08:00-11:00',
      price: 'Rp 150.000/bulan',
      isActive: true
    },
    {
      id: '3',
      title: 'Pendidikan Akhlak',
      description: 'Program pembentukan karakter islami dan akhlakul karimah. Santri akan diajarkan adab-adab islami dalam kehidupan sehari-hari.',
      features: [
        'Pembelajaran adab islami',
        'Pembentukan akhlak mulia',
        'Keteladanan dari ustadz',
        'Praktik dalam kehidupan',
        'Monitoring perkembangan'
      ],
      duration: 'Berkelanjutan',
      ageGroup: 'Semua Usia',
      schedule: 'Terintegrasi dengan program lain',
      price: 'Termasuk dalam program utama',
      isActive: true
    },
    {
      id: '4',
      title: 'Baca Tulis Al-Quran (BTQ)',
      description: 'Program dasar untuk belajar membaca dan menulis huruf hijaiyah serta Al-Quran. Cocok untuk pemula yang belum bisa membaca Al-Quran.',
      features: [
        'Pengenalan huruf hijaiyah',
        'Belajar menulis Arab',
        'Latihan membaca Al-Quran',
        'Metode Iqro dan Qiroati',
        'Bimbingan sabar dan telaten'
      ],
      duration: '3-6 Bulan',
      ageGroup: '4+ Tahun',
      schedule: 'Senin-Jumat 14:00-16:00',
      price: 'Rp 100.000/bulan',
      isActive: true
    }
  ];

  useEffect(() => {
    // Simulate loading from database
    const loadPrograms = async () => {
      try {
        // In real implementation, this would fetch from API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPrograms(defaultPrograms);
      } catch (error) {
        console.error('Error loading programs:', error);
        setPrograms(defaultPrograms);
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
  }, []);

  const benefits = [
    {
      icon: <BookOpen className="h-8 w-8 text-teal-600" />,
      title: "Kurikulum Terstruktur",
      description: "Program pembelajaran yang tersusun sistematis dan teruji"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Ustadz Berpengalaman",
      description: "Dibimbing oleh ustadz yang berpengalaman dan berkompeten"
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-600" />,
      title: "Sertifikat Resmi",
      description: "Mendapatkan sertifikat kelulusan yang diakui"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "Lingkungan Islami",
      description: "Suasana belajar yang kondusif dan bernuansa islami"
    }
  ];

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat program...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-green-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Program Unggulan
            </h1>
            <p className="text-xl md:text-2xl text-teal-100 max-w-3xl mx-auto">
              Program pembelajaran Al-Quran yang berkualitas untuk semua usia
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-teal-600 hover:text-teal-700">
              Beranda
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Program</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Benefits Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Mengapa Memilih Program Kami?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami berkomitmen memberikan pendidikan Al-Quran terbaik dengan berbagai keunggulan
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Programs Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Program Pembelajaran</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pilih program yang sesuai dengan kebutuhan dan usia Anda
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {programs.filter(program => program.isActive).map((program) => (
              <Card key={program.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-teal-600 mb-2">
                        {program.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {program.duration}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {program.ageGroup}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{program.price}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {program.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Fitur Program:</h4>
                    <div className="space-y-2">
                      {program.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{program.schedule}</span>
                      </div>
                    </div>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700">
                      Daftar Program
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-teal-50 to-green-50">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Siap Bergabung dengan Kami?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Daftarkan diri Anda atau putra-putri Anda untuk mengikuti program pembelajaran 
              Al-Quran di TPQ Baitus Shuffah. Mari bersama-sama membangun generasi Qur'ani.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-teal-600 hover:bg-teal-700">
                <Link href="/contact">
                  Hubungi Kami
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/about">
                  Pelajari Lebih Lanjut
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </PublicLayout>
  );
}
