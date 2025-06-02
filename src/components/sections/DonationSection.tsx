'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  Heart, 
  Target, 
  Users, 
  TrendingUp,
  Building,
  BookOpen,
  GraduationCap,
  Utensils,
  CreditCard,
  Smartphone,
  QrCode,
  ArrowRight,
  Check
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface DonationCategory {
  id: string;
  title: string;
  description: string;
  target: number;
  collected: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  urgent?: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
}

const DonationSection = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [selectedPayment, setSelectedPayment] = useState('bank');
  const [isLoading, setIsLoading] = useState(false);
  const [donorData, setDonorData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    isAnonymous: false
  });

  const donationCategories: DonationCategory[] = [
    {
      id: 'general',
      title: 'Donasi Umum',
      description: 'Untuk operasional sehari-hari rumah tahfidz',
      target: 100000000,
      collected: 75000000,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 'building',
      title: 'Pembangunan Gedung',
      description: 'Renovasi dan pembangunan fasilitas baru',
      target: 500000000,
      collected: 320000000,
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      urgent: true
    },
    {
      id: 'scholarship',
      title: 'Beasiswa Santri',
      description: 'Bantuan biaya pendidikan untuk santri kurang mampu',
      target: 200000000,
      collected: 150000000,
      icon: GraduationCap,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'books',
      title: 'Buku & Alat Tulis',
      description: 'Pengadaan Al-Quran dan buku pembelajaran',
      target: 50000000,
      collected: 35000000,
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'meals',
      title: 'Konsumsi Santri',
      description: 'Biaya makan dan snack untuk santri',
      target: 80000000,
      collected: 60000000,
      icon: Utensils,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'bank',
      name: 'Transfer Bank',
      icon: CreditCard,
      description: 'BCA, Mandiri, BNI, BRI'
    },
    {
      id: 'ewallet',
      name: 'E-Wallet',
      icon: Smartphone,
      description: 'GoPay, OVO, DANA, ShopeePay'
    },
    {
      id: 'qris',
      name: 'QRIS',
      icon: QrCode,
      description: 'Scan QR Code untuk pembayaran'
    }
  ];

  const quickAmounts = [50000, 100000, 250000, 500000, 1000000];

  const selectedCategoryData = donationCategories.find(cat => cat.id === selectedCategory);
  const finalAmount = selectedAmount || parseInt(customAmount) || 0;

  const handleDonationSubmit = async () => {
    if (finalAmount === 0) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'donation',
          amount: finalAmount,
          donationData: {
            donorName: donorData.name || 'Donatur Anonim',
            donorEmail: donorData.email,
            donorPhone: donorData.phone,
            type: selectedCategory.toUpperCase(),
            message: donorData.message,
            isAnonymous: donorData.isAnonymous
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to Midtrans payment page
        window.open(result.redirectUrl, '_blank');
      } else {
        alert('Gagal membuat donasi: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating donation:', error);
      alert('Terjadi kesalahan saat memproses donasi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDonorDataChange = (field: string, value: string | boolean) => {
    setDonorData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Donasi untuk Kemajuan Tahfidz
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Berpartisipasilah dalam membangun generasi penghafal Al-Quran. 
            Setiap donasi Anda sangat berarti untuk kemajuan pendidikan Islam.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Categories */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Pilih Kategori Donasi
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {donationCategories.map((category) => {
                const Icon = category.icon;
                const percentage = (category.collected / category.target) * 100;
                
                return (
                  <Card 
                    key={category.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedCategory === category.id 
                        ? 'ring-2 ring-teal-500 shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-lg ${category.bgColor} ${category.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        {category.urgent && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                            Mendesak
                          </span>
                        )}
                      </div>
                      
                      <CardTitle className="text-lg">
                        {category.title}
                      </CardTitle>
                      
                      <p className="text-gray-600 text-sm">
                        {category.description}
                      </p>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Terkumpul</span>
                          <span className="font-semibold text-gray-900">
                            {formatPercentage(category.collected, category.target)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Amount Info */}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {formatCurrency(category.collected)}
                        </span>
                        <span className="text-gray-600">
                          Target: {formatCurrency(category.target)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Donation Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  Form Donasi
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Selected Category Info */}
                {selectedCategoryData && (
                  <div className={`p-4 rounded-lg ${selectedCategoryData.bgColor}`}>
                    <div className="flex items-center mb-2">
                      <selectedCategoryData.icon className={`h-4 w-4 mr-2 ${selectedCategoryData.color}`} />
                      <span className="font-semibold text-gray-900">
                        {selectedCategoryData.title}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedCategoryData.description}
                    </p>
                  </div>
                )}

                {/* Quick Amount Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Pilih Nominal Donasi
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount('');
                        }}
                        className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                          selectedAmount === amount
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-teal-300'
                        }`}
                      >
                        {formatCurrency(amount)}
                      </button>
                    ))}
                  </div>
                  
                  <Input
                    type="number"
                    placeholder="Nominal lainnya"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Metode Pembayaran
                  </label>
                  <div className="space-y-2">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setSelectedPayment(method.id)}
                          className={`w-full p-3 text-left rounded-lg border transition-colors ${
                            selectedPayment === method.id
                              ? 'bg-teal-50 border-teal-300 text-teal-900'
                              : 'bg-white border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center">
                            <Icon className="h-5 w-5 mr-3 text-gray-600" />
                            <div>
                              <div className="font-medium">{method.name}</div>
                              <div className="text-sm text-gray-500">{method.description}</div>
                            </div>
                            {selectedPayment === method.id && (
                              <Check className="h-5 w-5 text-teal-600 ml-auto" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Donor Info */}
                <div className="space-y-4">
                  <Input
                    placeholder="Nama Donatur (Opsional)"
                    value={donorData.name}
                    onChange={(e) => handleDonorDataChange('name', e.target.value)}
                  />
                  <Input
                    type="email"
                    placeholder="Email (Opsional)"
                    value={donorData.email}
                    onChange={(e) => handleDonorDataChange('email', e.target.value)}
                  />
                  <Input
                    type="tel"
                    placeholder="No. HP (Opsional)"
                    value={donorData.phone}
                    onChange={(e) => handleDonorDataChange('phone', e.target.value)}
                  />
                  <Input
                    placeholder="Pesan/Doa (Opsional)"
                    value={donorData.message}
                    onChange={(e) => handleDonorDataChange('message', e.target.value)}
                  />

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={donorData.isAnonymous}
                      onChange={(e) => handleDonorDataChange('isAnonymous', e.target.checked)}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
                      Donasi sebagai anonim
                    </label>
                  </div>
                </div>

                {/* Total & Submit */}
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-900">
                      Total Donasi:
                    </span>
                    <span className="text-2xl font-bold text-teal-600">
                      {formatCurrency(finalAmount)}
                    </span>
                  </div>
                  
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={finalAmount === 0}
                    loading={isLoading}
                    onClick={handleDonationSubmit}
                  >
                    {isLoading ? 'Memproses...' : 'Lanjutkan Pembayaran'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Donasi Anda akan digunakan sesuai kategori yang dipilih
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Donation Impact */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Dampak Donasi Anda
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-teal-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">250+ Santri Terbantu</h4>
              <p className="text-gray-600 text-sm">
                Donasi Anda membantu biaya pendidikan santri dari keluarga kurang mampu
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Fasilitas Berkualitas</h4>
              <p className="text-gray-600 text-sm">
                Membantu pengadaan fasilitas pembelajaran yang modern dan nyaman
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Kualitas Pendidikan</h4>
              <p className="text-gray-600 text-sm">
                Meningkatkan kualitas pembelajaran dan metode tahfidz yang efektif
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;
