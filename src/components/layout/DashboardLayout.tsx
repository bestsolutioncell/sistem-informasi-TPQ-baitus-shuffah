'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavigationLink } from '@/components/providers/NavigationProvider';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
  CreditCard,
  Heart,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  BarChart3,
  FileText,
  UserCheck,
  MessageSquare,
  Mail,
  Zap,
  Brain,
  Monitor,
  Database,
  DollarSign,
  TrendingUp,
  Target,
  Award
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

interface NavGroup {
  name: string;
  items: NavItem[];
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const navigationGroups: NavGroup[] = [
    {
      name: 'DASHBOARD',
      items: [
        {
          name: 'Dashboard',
          href: `/dashboard/${user?.role?.toLowerCase()}`,
          icon: Home,
          roles: ['ADMIN', 'MUSYRIF', 'WALI']
        }
      ]
    },
    {
      name: 'AKADEMIK',
      items: [
        {
          name: 'Santri',
          href: `/dashboard/${user?.role?.toLowerCase()}/santri`,
          icon: Users,
          roles: ['ADMIN', 'MUSYRIF', 'WALI']
        },
        {
          name: 'Halaqah',
          href: `/dashboard/${user?.role?.toLowerCase()}/halaqah`,
          icon: BookOpen,
          roles: ['ADMIN', 'MUSYRIF']
        },
        {
          name: 'Hafalan',
          href: `/dashboard/${user?.role?.toLowerCase()}/hafalan`,
          icon: GraduationCap,
          roles: ['ADMIN', 'MUSYRIF', 'WALI']
        },
        {
          name: 'Progress Hafalan',
          href: `/dashboard/${user?.role?.toLowerCase()}/hafalan/progress`,
          icon: TrendingUp,
          roles: ['ADMIN', 'MUSYRIF', 'WALI']
        },
        {
          name: 'Target Hafalan',
          href: `/dashboard/${user?.role?.toLowerCase()}/hafalan/targets`,
          icon: Target,
          roles: ['ADMIN', 'MUSYRIF']
        },
        {
          name: 'Achievement System',
          href: `/dashboard/${user?.role?.toLowerCase()}/achievements`,
          icon: Award,
          roles: ['ADMIN', 'MUSYRIF', 'WALI']
        },
        {
          name: 'Absensi',
          href: `/dashboard/${user?.role?.toLowerCase()}/attendance`,
          icon: Calendar,
          roles: ['ADMIN', 'MUSYRIF', 'WALI']
        },
        {
          name: 'Advanced Attendance',
          href: `/dashboard/${user?.role?.toLowerCase()}/attendance/advanced`,
          icon: UserCheck,
          roles: ['ADMIN', 'MUSYRIF']
        },
        {
          name: 'Evaluasi Perilaku',
          href: `/dashboard/${user?.role?.toLowerCase()}/behavior`,
          icon: Heart,
          roles: ['ADMIN', 'MUSYRIF']
        },
        {
          name: 'Analytics Perilaku',
          href: `/dashboard/${user?.role?.toLowerCase()}/behavior/analytics`,
          icon: BarChart3,
          roles: ['ADMIN', 'MUSYRIF']
        },
        {
          name: 'Laporan Karakter',
          href: `/dashboard/${user?.role?.toLowerCase()}/behavior/reports`,
          icon: FileText,
          roles: ['ADMIN', 'MUSYRIF']
        }
      ]
    },
    {
      name: 'KEUANGAN',
      items: [
        {
          name: 'SPP',
          href: `/dashboard/${user?.role?.toLowerCase()}/spp`,
          icon: CreditCard,
          roles: ['ADMIN']
        },
        {
          name: 'Keuangan',
          href: `/dashboard/${user?.role?.toLowerCase()}/financial`,
          icon: DollarSign,
          roles: ['ADMIN']
        },
        {
          name: 'Pembayaran',
          href: `/dashboard/${user?.role?.toLowerCase()}/payments`,
          icon: CreditCard,
          roles: ['ADMIN', 'WALI']
        },
        {
          name: 'Donasi',
          href: `/dashboard/${user?.role?.toLowerCase()}/donations`,
          icon: Heart,
          roles: ['ADMIN']
        },
        {
          name: 'Pembayaran Online',
          href: `/dashboard/${user?.role?.toLowerCase()}/payment`,
          icon: CreditCard,
          roles: ['ADMIN', 'MUSYRIF', 'WALI']
        },
        {
          name: 'Analytics Dashboard',
          href: `/dashboard/${user?.role?.toLowerCase()}/analytics`,
          icon: BarChart3,
          roles: ['ADMIN']
        },
        {
          name: 'Analytics Pembayaran',
          href: `/dashboard/${user?.role?.toLowerCase()}/analytics/payments`,
          icon: TrendingUp,
          roles: ['ADMIN']
        },
        {
          name: 'Subscription SPP',
          href: `/dashboard/${user?.role?.toLowerCase()}/subscriptions`,
          icon: CreditCard,
          roles: ['ADMIN']
        }
      ]
    },
    {
      name: 'LAPORAN & ANALISIS',
      items: [
        {
          name: 'Laporan',
          href: `/dashboard/${user?.role?.toLowerCase()}/reports`,
          icon: BarChart3,
          roles: ['ADMIN', 'MUSYRIF']
        },
        {
          name: 'Laporan Keuangan',
          href: `/dashboard/${user?.role?.toLowerCase()}/financial-reports`,
          icon: FileText,
          roles: ['ADMIN']
        },
        {
          name: 'AI Insights',
          href: `/dashboard/${user?.role?.toLowerCase()}/insights`,
          icon: Brain,
          roles: ['ADMIN']
        }
      ]
    },
    {
      name: 'SISTEM & MONITORING',
      items: [
        {
          name: 'Monitoring',
          href: `/dashboard/${user?.role?.toLowerCase()}/monitoring`,
          icon: Monitor,
          roles: ['ADMIN']
        },
        {
          name: 'System Audit',
          href: `/dashboard/${user?.role?.toLowerCase()}/audit`,
          icon: Database,
          roles: ['ADMIN']
        }
      ]
    },
    {
      name: 'KOMUNIKASI',
      items: [
        {
          name: 'Notifikasi',
          href: `/dashboard/${user?.role?.toLowerCase()}/notifications`,
          icon: Bell,
          roles: ['ADMIN']
        },
        {
          name: 'Trigger Notifikasi',
          href: `/dashboard/${user?.role?.toLowerCase()}/notifications/triggers`,
          icon: Zap,
          roles: ['ADMIN']
        },
        {
          name: 'Berita',
          href: `/dashboard/${user?.role?.toLowerCase()}/news`,
          icon: FileText,
          roles: ['ADMIN']
        },
        {
          name: 'WhatsApp',
          href: `/dashboard/${user?.role?.toLowerCase()}/whatsapp`,
          icon: MessageSquare,
          roles: ['ADMIN']
        },
        {
          name: 'Email',
          href: `/dashboard/${user?.role?.toLowerCase()}/email`,
          icon: Mail,
          roles: ['ADMIN']
        }
      ]
    },
    {
      name: 'ADMINISTRASI',
      items: [
        {
          name: 'Pengguna',
          href: `/dashboard/${user?.role?.toLowerCase()}/users`,
          icon: UserCheck,
          roles: ['ADMIN']
        },
        {
          name: 'Pengaturan',
          href: `/dashboard/${user?.role?.toLowerCase()}/settings`,
          icon: Settings,
          roles: ['ADMIN', 'MUSYRIF', 'WALI']
        },
        {
          name: 'Integrasi Sistem',
          href: `/dashboard/${user?.role?.toLowerCase()}/settings/integrations`,
          icon: Zap,
          roles: ['ADMIN']
        }
      ]
    }
  ];

  // Filter navigation groups based on user role
  const filteredNavigationGroups = navigationGroups.map(group => ({
    ...group,
    items: group.items.filter(item => item.roles.includes(user?.role || ''))
  })).filter(group => group.items.length > 0);

  const isActive = (href: string) => pathname === href;

  const handleSignOut = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex lg:flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-gold">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gradient">
                  Dashboard BTS
                </h1>
              </div>
            </Link>
            
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-teal-600">
                  {user?.name?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {filteredNavigationGroups.map((group, groupIndex) => (
              <div key={group.name} className={groupIndex > 0 ? "mt-6" : ""}>
                {/* Group Header */}
                <div className="px-3 py-2 mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-1">
                    {group.name}
                  </h3>
                </div>

                {/* Group Items */}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavigationLink
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                          isActive(item.href)
                            ? "bg-teal-50 text-teal-700 border-r-2 border-teal-600"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </NavigationLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Keluar
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <NotificationDropdown />

              {/* Profile dropdown would go here */}
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-teal-600">
                  {user?.name?.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
