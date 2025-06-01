'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { 
  Menu, 
  X, 
  BookOpen, 
  Users, 
  Heart, 
  Phone, 
  Info,
  LogIn,
  UserPlus
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Beranda', href: '/', icon: BookOpen },
    { name: 'Tentang Kami', href: '/about', icon: Info },
    { name: 'Program', href: '/programs', icon: Users },
    { name: 'Donasi', href: '/donate', icon: Heart },
    { name: 'Kontak', href: '/contact', icon: Phone },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-gold">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gradient">
                  TPQ BAITUS SHUFFAH
                </h1>
                <p className="text-xs text-gray-600">Rumah Tahfidz Al-Qur'an</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Daftar
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-teal-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 bg-white">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors',
                      isActive(item.href)
                        ? 'text-teal-600 bg-teal-50'
                        : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 space-y-2">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <LogIn className="h-4 w-4 mr-2" />
                    Masuk
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="primary" className="w-full justify-start">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Daftar Santri
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
