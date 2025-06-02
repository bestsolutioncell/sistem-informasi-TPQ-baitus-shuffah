'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth, getRoleRedirectPath } from '@/components/providers/AuthProvider';
import { 
  BookOpen, 
  Mail, 
  Lock, 
  ArrowLeft,
  Eye,
  EyeOff,
  UserCheck,
  Shield,
  Users
} from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

const LoginPage = () => {
  const router = useRouter();
  const { login, user, loading } = useAuth();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
    remember: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginForm>>({});

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      const redirectPath = getRoleRedirectPath(user.role);
      router.push(redirectPath);
    }
  }, [user, loading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof LoginForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginForm> = {};

    if (!formData.email) {
      newErrors.email = 'Email harus diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        // Login successful, AuthProvider will handle user state
        // Redirect will be handled by useEffect above
      } else {
        setErrors({ email: 'Email atau password salah' });
      }
    } catch (error) {
      setErrors({ email: 'Terjadi kesalahan. Silakan coba lagi.' });
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    {
      role: 'Admin',
      email: 'admin@rumahtahfidz.com',
      password: 'admin123',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      role: 'Musyrif',
      email: 'musyrif@rumahtahfidz.com',
      password: 'musyrif123',
      icon: UserCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      role: 'Wali Santri',
      email: 'wali@rumahtahfidz.com',
      password: 'wali123',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const fillDemoAccount = (email: string, password: string) => {
    setFormData(prev => ({
      ...prev,
      email,
      password
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 islamic-pattern opacity-5"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-gold">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">
                  TPQ Baitus Shuffah
                </h1>
                <p className="text-sm text-gray-600">Rumah Tahfidz Al-Qur'an</p>
              </div>
            </div>
          </Link>
          
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Masuk ke Akun Anda
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Atau{' '}
            <Link href="/register" className="font-medium text-teal-600 hover:text-teal-500">
              daftar sebagai santri baru
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="shadow-xl border-0">
            <CardContent className="py-8 px-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Masukkan email Anda"
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={errors.email}
                  required
                />

                {/* Password Input */}
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Masukkan password Anda"
                  leftIcon={<Lock className="h-4 w-4" />}
                  error={errors.password}
                  required
                />

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      checked={formData.remember}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                      Ingat saya
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link href="/forgot-password" className="font-medium text-teal-600 hover:text-teal-500">
                      Lupa password?
                    </Link>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  loading={isLoading}
                >
                  {isLoading ? 'Memproses...' : 'Masuk'}
                </Button>
              </form>

              {/* Demo Accounts */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Demo Akun</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {demoAccounts.map((account) => {
                    const Icon = account.icon;
                    return (
                      <button
                        key={account.role}
                        onClick={() => fillDemoAccount(account.email, account.password)}
                        className={`w-full flex items-center p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors ${account.bgColor}`}
                      >
                        <div className={`p-2 rounded ${account.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="ml-3 text-left">
                          <div className="text-sm font-medium text-gray-900">
                            Login sebagai {account.role}
                          </div>
                          <div className="text-xs text-gray-500">
                            {account.email}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
