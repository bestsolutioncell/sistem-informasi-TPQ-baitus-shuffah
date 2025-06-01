'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Building,
  CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6 text-teal-600" />,
      title: "Alamat Sekretariat",
      content: [
        "Jl. Untung Suropati Labuhan Ratu",
        "Kec. Labuhan Ratu",
        "Kota Bandar Lampung"
      ]
    },
    {
      icon: <Phone className="h-6 w-6 text-green-600" />,
      title: "Telepon",
      content: ["0822-8978-2223"]
    },
    {
      icon: <Mail className="h-6 w-6 text-blue-600" />,
      title: "Email",
      content: ["baitusshuffah@gmail.com"]
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-600" />,
      title: "Jam Operasional",
      content: [
        "Senin - Jumat: 14:00 - 17:00",
        "Sabtu - Minggu: 08:00 - 11:00"
      ]
    }
  ];

  const bankInfo = {
    bank: "Bank Syariah Indonesia (BSI)",
    accountNumber: "7208593212",
    accountName: "TPQ Baitus Shuffah"
  };

  return (
    <PublicLayout>
      <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-green-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hubungi Kami
            </h1>
            <p className="text-xl md:text-2xl text-teal-100 max-w-3xl mx-auto">
              Kami siap membantu Anda dengan informasi seputar TPQ Baitus Shuffah
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
            <span className="text-gray-600">Kontak</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-teal-600" />
                  Kirim Pesan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="nama@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor Telepon
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subjek *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      >
                        <option value="">Pilih subjek</option>
                        <option value="pendaftaran">Pendaftaran Santri Baru</option>
                        <option value="informasi">Informasi Program</option>
                        <option value="donasi">Donasi & Bantuan</option>
                        <option value="kerjasama">Kerjasama</option>
                        <option value="keluhan">Keluhan & Saran</option>
                        <option value="lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pesan *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Tulis pesan Anda di sini..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-600 hover:bg-teal-700 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {loading ? 'Mengirim...' : 'Kirim Pesan'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {info.title}
                      </h4>
                      {info.content.map((line, idx) => (
                        <p key={idx} className="text-gray-600 text-sm">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Bank Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-green-600" />
                  Informasi Rekening Donasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank:</span>
                      <span className="font-semibold text-gray-900">{bankInfo.bank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">No. Rekening:</span>
                      <span className="font-semibold text-gray-900 font-mono">{bankInfo.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Atas Nama:</span>
                      <span className="font-semibold text-gray-900">{bankInfo.accountName}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Untuk donasi pembangunan fasilitas ruang kelas dan operasional TPQ
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/programs">
                    <Building className="h-4 w-4 mr-2" />
                    Lihat Program Kami
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/donate">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Donasi Sekarang
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/about">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Tentang Kami
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-6 w-6 text-teal-600" />
                Lokasi TPQ Baitus Shuffah
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p className="font-medium">Peta Lokasi</p>
                  <p className="text-sm">Jl. Untung Suropati Labuhan Ratu</p>
                  <p className="text-sm">Kec. Labuhan Ratu, Kota Bandar Lampung</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                * Peta interaktif akan ditampilkan di sini dengan integrasi Google Maps
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </PublicLayout>
  );
}
