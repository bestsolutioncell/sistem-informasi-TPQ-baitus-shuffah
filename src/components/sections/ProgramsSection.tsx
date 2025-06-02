'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Award,
  Star,
  CheckCircle,
  ArrowRight,
  Globe,
  Heart,
  Zap
} from 'lucide-react';

interface Program {
  id: string;
  title: string;
  description: string;
  features: string[];
  duration: string;
  capacity: string;
  level: 'Pemula' | 'Menengah' | 'Lanjutan';
  price: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  popular?: boolean;
}

const ProgramsSection = () => {
  const programs: Program[] = [
    {
      id: 'tahfidz-intensif',
      title: 'Tahfidz Intensif',
      description: 'Program unggulan untuk menghafal Al-Quran 30 Juz dengan metode terbukti efektif',
      features: [
        'Bimbingan ustadz hafidz berpengalaman',
        'Metode pembelajaran modern',
        'Target 1 halaman per hari',
        'Evaluasi mingguan',
        'Sertifikat resmi'
      ],
      duration: '2-3 Tahun',
      capacity: '20 Santri',
      level: 'Menengah',
      price: 'Rp 500.000/bulan',
      icon: BookOpen,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      popular: true
    },
    {
      id: 'tahfidz-reguler',
      title: 'Tahfidz Reguler',
      description: 'Program tahfidz dengan jadwal fleksibel untuk santri yang masih bersekolah',
      features: [
        'Jadwal sore dan weekend',
        'Target sesuai kemampuan',
        'Bimbingan personal',
        'Murajaah rutin',
        'Laporan progress bulanan'
      ],
      duration: '3-4 Tahun',
      capacity: '25 Santri',
      level: 'Pemula',
      price: 'Rp 300.000/bulan',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'tahsin-tajwid',
      title: 'Tahsin & Tajwid',
      description: 'Program perbaikan bacaan Al-Quran dengan kaidah tajwid yang benar',
      features: [
        'Perbaikan makhorijul huruf',
        'Pembelajaran tajwid lengkap',
        'Praktik langsung',
        'Audio recording',
        'Evaluasi berkala'
      ],
      duration: '6 Bulan',
      capacity: '15 Santri',
      level: 'Pemula',
      price: 'Rp 200.000/bulan',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 'qiraah-sab',
      title: 'Qiraah Sab\'ah',
      description: 'Program lanjutan untuk mempelajari 7 qiraah Al-Quran',
      features: [
        'Pembelajaran 7 qiraah',
        'Ustadz spesialis qiraah',
        'Metode sanad',
        'Ijazah qiraah',
        'Kelas eksklusif'
      ],
      duration: '2 Tahun',
      capacity: '10 Santri',
      level: 'Lanjutan',
      price: 'Rp 800.000/bulan',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'bahasa-arab',
      title: 'Bahasa Arab',
      description: 'Program pembelajaran bahasa Arab untuk memahami Al-Quran lebih dalam',
      features: [
        'Nahwu dan Sharaf',
        'Kosakata Al-Quran',
        'Percakapan sehari-hari',
        'Kitab klasik',
        'Sertifikat kemahiran'
      ],
      duration: '1 Tahun',
      capacity: '20 Santri',
      level: 'Menengah',
      price: 'Rp 250.000/bulan',
      icon: Globe,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'akhlak-adab',
      title: 'Akhlak & Adab',
      description: 'Program pembentukan karakter Islami dan adab sehari-hari',
      features: [
        'Akhlak kepada Allah',
        'Adab bermasyarakat',
        'Sunnah Rasulullah',
        'Praktik ibadah',
        'Mentoring personal'
      ],
      duration: '6 Bulan',
      capacity: '30 Santri',
      level: 'Pemula',
      price: 'Rp 150.000/bulan',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Pemula':
        return 'bg-green-100 text-green-800';
      case 'Menengah':
        return 'bg-yellow-100 text-yellow-800';
      case 'Lanjutan':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Program Unggulan Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pilih program yang sesuai dengan kebutuhan dan kemampuan Anda. 
            Setiap program dirancang dengan kurikulum terbaik dan bimbingan ustadz berpengalaman.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => {
            const Icon = program.icon;
            
            return (
              <Card 
                key={program.id} 
                className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                  program.popular ? 'ring-2 ring-teal-500' : ''
                }`}
                variant="islamic"
              >
                {/* Popular Badge */}
                {program.popular && (
                  <div className="absolute top-4 right-4 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                    <Zap className="h-3 w-3 mr-1" />
                    Populer
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${program.bgColor} ${program.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelBadgeColor(program.level)}`}>
                      {program.level}
                    </span>
                  </div>
                  
                  <CardTitle className="text-xl mb-2">
                    {program.title}
                  </CardTitle>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {program.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Fitur Program:</h4>
                    <ul className="space-y-2">
                      {program.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Program Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <Clock className="h-4 w-4 text-gray-500 mx-auto mb-1" />
                      <div className="text-xs text-gray-500">Durasi</div>
                      <div className="text-sm font-medium text-gray-900">{program.duration}</div>
                    </div>
                    <div className="text-center">
                      <Users className="h-4 w-4 text-gray-500 mx-auto mb-1" />
                      <div className="text-xs text-gray-500">Kapasitas</div>
                      <div className="text-sm font-medium text-gray-900">{program.capacity}</div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-teal-600 mb-1">
                      {program.price}
                    </div>
                    <div className="text-xs text-gray-500">
                      *Biaya dapat diangsur
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className="w-full" 
                    variant={program.popular ? 'primary' : 'outline'}
                  >
                    Daftar Program
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Tidak Yakin Program Mana yang Cocok?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Tim konsultan kami siap membantu Anda memilih program yang sesuai 
              dengan kemampuan dan tujuan pembelajaran Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg">
                Konsultasi Gratis
              </Button>
              <Button variant="outline" size="lg">
                Download Brosur
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
