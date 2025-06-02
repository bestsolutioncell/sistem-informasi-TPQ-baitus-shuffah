'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import {
  BookOpen,
  Users,
  Award,
  Heart,
  ArrowRight,
  Star
} from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with Islamic Pattern */}
      <div className="absolute inset-0 bg-teal-gold">
        <div className="absolute inset-0 islamic-pattern opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/90 via-teal-500/80 to-yellow-500/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium mb-6">
              <Star className="h-4 w-4 mr-2 text-yellow-300" />
              Rumah Tahfidz Terpercaya #1 di Indonesia
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Membangun Generasi
              <span className="block text-yellow-300">
                Penghafal Al-Quran
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">
              Bergabunglah dengan Rumah Tahfidz Baitus Shuffah, tempat terbaik untuk 
              menghafal Al-Quran dengan metode modern dan bimbingan ustadz berpengalaman.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/programs">
                <Button
                  size="lg"
                  className="bg-white text-teal-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Lihat Program Kami
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>

              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-teal-600 backdrop-blur-sm"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Hubungi Kami
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">250+</div>
                <div className="text-sm text-white/80">Santri Aktif</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-sm text-white/80">Hafidz/Hafidzah</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">15</div>
                <div className="text-sm text-white/80">Tahun Berpengalaman</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Feature Card 1 */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-200 hover-lift">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-lg mb-4">
                  <BookOpen className="h-6 w-6 text-gray-900" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Metode Tahfidz Modern
                </h3>
                <p className="text-white/80 text-sm">
                  Sistem pembelajaran yang terbukti efektif dengan teknologi terkini
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-200 hover-lift">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-lg mb-4">
                  <Users className="h-6 w-6 text-gray-900" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Ustadz Berpengalaman
                </h3>
                <p className="text-white/80 text-sm">
                  Dibimbing langsung oleh ustadz hafidz dengan pengalaman puluhan tahun
                </p>
              </div>

              {/* Feature Card 3 */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-200 hover-lift">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-lg mb-4">
                  <Award className="h-6 w-6 text-gray-900" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Sertifikat Resmi
                </h3>
                <p className="text-white/80 text-sm">
                  Mendapatkan sertifikat tahfidz yang diakui secara nasional
                </p>
              </div>

              {/* Feature Card 4 */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-200 hover-lift">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-lg mb-4">
                  <Heart className="h-6 w-6 text-gray-900" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Lingkungan Islami
                </h3>
                <p className="text-white/80 text-sm">
                  Suasana belajar yang kondusif dengan nilai-nilai Islam
                </p>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/20 rounded-full blur-lg"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Arabic Calligraphy Decoration */}
      <div className="absolute top-20 right-10 text-6xl text-white/10 font-arabic hidden lg:block">
        بِسْمِ اللَّهِ
      </div>
      <div className="absolute bottom-20 left-10 text-4xl text-white/10 font-arabic hidden lg:block">
        الرَّحْمَنِ الرَّحِيمِ
      </div>
    </section>
  );
};

export default HeroSection;
