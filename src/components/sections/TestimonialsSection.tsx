'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  content: string;
  program: string;
  year: string;
}

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Ahmad Fauzi',
      role: 'Alumni Tahfidz Intensif',
      avatar: '/avatars/ahmad.jpg',
      rating: 5,
      content: 'Alhamdulillah, berkat bimbingan ustadz-ustadz yang sabar dan metode pembelajaran yang efektif, saya berhasil menyelesaikan hafalan 30 juz dalam waktu 2,5 tahun. Pengalaman yang sangat berharga dan mengubah hidup saya.',
      program: 'Tahfidz Intensif',
      year: '2023'
    },
    {
      id: '2',
      name: 'Siti Aisyah',
      role: 'Wali Santri',
      avatar: '/avatars/siti.jpg',
      rating: 5,
      content: 'Anak saya sangat senang belajar di sini. Selain hafalan Al-Quran, akhlaknya juga semakin baik. Para ustadz sangat perhatian dan komunikatif dengan orang tua. Sistem pembelajaran yang modern namun tetap menjaga nilai-nilai tradisional.',
      program: 'Tahfidz Reguler',
      year: '2023'
    },
    {
      id: '3',
      name: 'Muhammad Rizki',
      role: 'Santri Aktif',
      avatar: '/avatars/rizki.jpg',
      rating: 5,
      content: 'Metode pembelajaran di sini sangat menyenangkan. Tidak membosankan dan mudah dipahami. Saya yang awalnya tidak bisa membaca Al-Quran dengan baik, sekarang sudah bisa dan sedang dalam proses menghafal.',
      program: 'Tahsin & Tajwid',
      year: '2024'
    },
    {
      id: '4',
      name: 'Fatimah Zahra',
      role: 'Alumni Qiraah',
      avatar: '/avatars/fatimah.jpg',
      rating: 5,
      content: 'Program Qiraah Sab\'ah di sini sangat berkualitas. Ustadz yang mengajar benar-benar ahli di bidangnya. Saya mendapat ijazah qiraah yang sangat berharga untuk masa depan saya sebagai pengajar Al-Quran.',
      program: 'Qiraah Sab\'ah',
      year: '2023'
    },
    {
      id: '5',
      name: 'Abdullah Rahman',
      role: 'Orang Tua Santri',
      avatar: '/avatars/abdullah.jpg',
      rating: 5,
      content: 'Fasilitas yang lengkap, lingkungan yang kondusif, dan yang terpenting adalah kualitas pengajaran yang sangat baik. Anak saya tidak hanya pintar mengaji, tapi juga semakin sholeh dan berbakti kepada orang tua.',
      program: 'Akhlak & Adab',
      year: '2024'
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Testimoni Alumni & Wali Santri
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dengarkan pengalaman mereka yang telah merasakan manfaat bergabung 
            dengan Rumah Tahfidz Baitus Shuffah
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-white shadow-xl border-0">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-teal-600">
                      {testimonials[currentIndex].name.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  {/* Quote Icon */}
                  <Quote className="h-8 w-8 text-teal-200 mb-4 mx-auto md:mx-0" />
                  
                  {/* Rating */}
                  <div className="flex justify-center md:justify-start mb-4">
                    {renderStars(testimonials[currentIndex].rating)}
                  </div>

                  {/* Testimonial Content */}
                  <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 italic">
                    "{testimonials[currentIndex].content}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="font-semibold text-gray-900 text-lg">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-gray-600 mb-2">
                      {testimonials[currentIndex].role}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-gray-500">
                      <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full">
                        {testimonials[currentIndex].program}
                      </span>
                      <span>Tahun {testimonials[currentIndex].year}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center items-center mt-8 gap-4">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-gray-600 hover:text-teal-600"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-teal-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-gray-600 hover:text-teal-600"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Card key={testimonial.id} className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                    <span className="font-bold text-teal-600">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>

                <div className="flex mb-3">
                  {renderStars(testimonial.rating)}
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  "{testimonial.content.substring(0, 120)}..."
                </p>

                <div className="text-xs text-gray-500">
                  {testimonial.program} • {testimonial.year}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-teal-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ingin Menjadi Bagian dari Kesuksesan Ini?
            </h3>
            <p className="text-teal-100 mb-6">
              Bergabunglah dengan ribuan alumni yang telah merasakan manfaat program kami
            </p>
            <button className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Mulai Perjalanan Anda
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
