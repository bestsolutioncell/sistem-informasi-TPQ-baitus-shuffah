'use client';

import React from 'react';
import Link from 'next/link';

export default function SimpleHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RT</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Rumah Tahfidz</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-teal-600">Beranda</Link>
              <Link href="/about" className="text-gray-600 hover:text-teal-600">Tentang</Link>
              <Link href="/programs" className="text-gray-600 hover:text-teal-600">Program</Link>
              <Link href="/contact" className="text-gray-600 hover:text-teal-600">Kontak</Link>
              <Link href="/login" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">Login</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Rumah Tahfidz
            <span className="block text-teal-600">Baitus Shuffah</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Lembaga pendidikan tahfidz Al-Quran terpercaya dengan metode pembelajaran modern 
            dan bimbingan ustadz berpengalaman
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Daftar Sekarang
            </Link>
            <Link 
              href="/about" 
              className="border-2 border-teal-600 text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 hover:text-white transition-colors"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pencapaian Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dengan dedikasi dan komitmen tinggi, kami telah mencapai berbagai prestasi 
              dalam pendidikan tahfidz Al-Quran
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                label: 'Santri Aktif',
                value: '250+',
                description: 'Santri yang sedang menghafal Al-Quran',
                color: 'text-teal-600'
              },
              {
                label: 'Hafidz/Hafidzah',
                value: '50+',
                description: 'Lulusan yang telah menyelesaikan 30 Juz',
                color: 'text-yellow-600'
              },
              {
                label: 'Tahun Berpengalaman',
                value: '15',
                description: 'Pengalaman dalam pendidikan tahfidz',
                color: 'text-green-600'
              },
              {
                label: 'Total Donasi',
                value: '500Jt+',
                description: 'Dana yang terkumpul untuk operasional',
                color: 'text-red-600'
              },
              {
                label: 'Program Aktif',
                value: '8',
                description: 'Program pembelajaran yang tersedia',
                color: 'text-blue-600'
              },
              {
                label: 'Tingkat Keberhasilan',
                value: '95%',
                description: 'Santri yang berhasil menyelesaikan target',
                color: 'text-purple-600'
              }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                    <div className="w-6 h-6 bg-current rounded"></div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {stat.label}
                </h3>
                
                <p className="text-gray-600 text-sm">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kami menyediakan pendidikan tahfidz terbaik dengan fasilitas modern dan metode pembelajaran yang efektif
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Metode Pembelajaran Modern',
                description: 'Menggunakan teknologi dan metode terkini untuk memudahkan proses menghafal Al-Quran'
              },
              {
                title: 'Ustadz Berpengalaman',
                description: 'Dibimbing oleh ustadz-ustadz yang telah berpengalaman puluhan tahun dalam bidang tahfidz'
              },
              {
                title: 'Fasilitas Lengkap',
                description: 'Dilengkapi dengan fasilitas modern untuk mendukung proses pembelajaran yang optimal'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-teal-600 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Bergabunglah dengan Keluarga Besar Kami
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
            Jadilah bagian dari komunitas penghafal Al-Quran terbaik di Indonesia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Daftar Sekarang
            </Link>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RT</span>
                </div>
                <span className="text-xl font-bold">Rumah Tahfidz</span>
              </div>
              <p className="text-gray-400">
                Lembaga pendidikan tahfidz Al-Quran terpercaya dengan metode pembelajaran modern.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Menu</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Beranda</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white">Tentang</Link></li>
                <li><Link href="/programs" className="text-gray-400 hover:text-white">Program</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Kontak</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontak</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Jl. Islamic Center No. 123</li>
                <li>Jakarta Pusat, 10110</li>
                <li>Telp: (021) 1234-5678</li>
                <li>Email: info@rumahtahfidz.com</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Jam Operasional</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Senin - Jumat: 07:00 - 17:00</li>
                <li>Sabtu: 07:00 - 15:00</li>
                <li>Minggu: 08:00 - 12:00</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Rumah Tahfidz Baitus Shuffah. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
