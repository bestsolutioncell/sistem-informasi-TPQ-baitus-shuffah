'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import QRCodeGenerator from '@/components/qr/QRCodeGenerator';
import QRScanner from '@/components/qr/QRScanner';
import { 
  Calendar, 
  Search, 
  Filter,
  Download,
  Plus,
  QrCode,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  UserCheck,
  UserX
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  santriId: string;
  santriName: string;
  santriNis: string;
  halaqahId: string;
  halaqahName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'EXCUSED';
  notes?: string;
  scannedBy: string;
}

interface AttendanceSession {
  id: string;
  halaqahId: string;
  halaqahName: string;
  date: string;
  startTime: string;
  endTime: string;
  qrCode: string;
  isActive: boolean;
  totalSantri: number;
  presentCount: number;
}

const AttendancePage = () => {
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('TODAY');
  const [activeTab, setActiveTab] = useState<'records' | 'sessions' | 'scanner'>('records');
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'ADMIN') {
        router.push('/login');
      } else {
        setUser(parsedUser);
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Mock data
  const attendanceRecords: AttendanceRecord[] = [
    {
      id: '1',
      santriId: '1',
      santriName: 'Ahmad Fauzi',
      santriNis: '24001',
      halaqahId: '1',
      halaqahName: 'Halaqah Al-Fatihah',
      date: '2024-02-12',
      checkIn: '08:00',
      checkOut: '09:30',
      status: 'PRESENT',
      scannedBy: 'Ustadz Abdullah'
    },
    {
      id: '2',
      santriId: '2',
      santriName: 'Siti Aisyah',
      santriNis: '24002',
      halaqahId: '1',
      halaqahName: 'Halaqah Al-Fatihah',
      date: '2024-02-12',
      checkIn: '08:15',
      status: 'LATE',
      notes: 'Terlambat 15 menit',
      scannedBy: 'Ustadz Abdullah'
    },
    {
      id: '3',
      santriId: '3',
      santriName: 'Muhammad Rizki',
      santriNis: '24003',
      halaqahId: '2',
      halaqahName: 'Halaqah Al-Baqarah',
      date: '2024-02-12',
      checkIn: '10:00',
      status: 'PRESENT',
      scannedBy: 'Ustadzah Fatimah'
    }
  ];

  const attendanceSessions: AttendanceSession[] = [
    {
      id: '1',
      halaqahId: '1',
      halaqahName: 'Halaqah Al-Fatihah',
      date: '2024-02-12',
      startTime: '08:00',
      endTime: '09:30',
      qrCode: 'attendance_2024-02-12_halaqah-1',
      isActive: true,
      totalSantri: 15,
      presentCount: 12
    },
    {
      id: '2',
      halaqahId: '2',
      halaqahName: 'Halaqah Al-Baqarah',
      date: '2024-02-12',
      startTime: '10:00',
      endTime: '11:30',
      qrCode: 'attendance_2024-02-12_halaqah-2',
      isActive: false,
      totalSantri: 18,
      presentCount: 16
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'LATE':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'ABSENT':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'EXCUSED':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-100 text-green-800';
      case 'LATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ABSENT':
        return 'bg-red-100 text-red-800';
      case 'EXCUSED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleQRScan = (data: string) => {
    console.log('QR Scanned:', data);
    // Process attendance scan
    alert(`QR Code scanned: ${data}`);
  };

  const createAttendanceSession = () => {
    // Mock create new session
    alert('Fitur create session akan diimplementasikan');
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = record.santriName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.santriNis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.halaqahName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalToday: attendanceRecords.filter(r => r.date === '2024-02-12').length,
    presentToday: attendanceRecords.filter(r => r.date === '2024-02-12' && r.status === 'PRESENT').length,
    lateToday: attendanceRecords.filter(r => r.date === '2024-02-12' && r.status === 'LATE').length,
    absentToday: attendanceRecords.filter(r => r.date === '2024-02-12' && r.status === 'ABSENT').length,
    activeSessions: attendanceSessions.filter(s => s.isActive).length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Sistem Absensi QR Code
            </h1>
            <p className="text-gray-600">
              Kelola absensi santri dengan teknologi QR Code
            </p>
          </div>
          <Button onClick={createAttendanceSession}>
            <Plus className="h-4 w-4 mr-2" />
            Buat Sesi Absensi
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalToday}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hadir</p>
                  <p className="text-2xl font-bold text-green-600">{stats.presentToday}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Terlambat</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.lateToday}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tidak Hadir</p>
                  <p className="text-2xl font-bold text-red-600">{stats.absentToday}</p>
                </div>
                <UserX className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sesi Aktif</p>
                  <p className="text-2xl font-bold text-teal-600">{stats.activeSessions}</p>
                </div>
                <QrCode className="h-8 w-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'records', label: 'Rekap Absensi', icon: Calendar },
              { id: 'sessions', label: 'Sesi Absensi', icon: QrCode },
              { id: 'scanner', label: 'QR Scanner', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'records' && (
          <Card>
            <CardHeader>
              <CardTitle>Rekap Absensi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Cari santri, NIS, atau halaqah..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search className="h-4 w-4" />}
                  />
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 bg-white"
                  >
                    <option value="ALL">Semua Status</option>
                    <option value="PRESENT">Hadir</option>
                    <option value="LATE">Terlambat</option>
                    <option value="ABSENT">Tidak Hadir</option>
                    <option value="EXCUSED">Izin</option>
                  </select>
                  
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Santri</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Halaqah</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Tanggal</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Check In</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Check Out</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{record.santriName}</p>
                            <p className="text-sm text-gray-500">NIS: {record.santriNis}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-900">{record.halaqahName}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-900">
                            {new Date(record.date).toLocaleDateString('id-ID')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-900">{record.checkIn}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-900">{record.checkOut || '-'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(record.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                              {record.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'sessions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {attendanceSessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{session.halaqahName}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {session.isActive ? 'Aktif' : 'Selesai'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Tanggal:</span>
                        <p className="font-medium">{new Date(session.date).toLocaleDateString('id-ID')}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Waktu:</span>
                        <p className="font-medium">{session.startTime} - {session.endTime}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Santri:</span>
                        <p className="font-medium">{session.totalSantri}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Hadir:</span>
                        <p className="font-medium text-green-600">{session.presentCount}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <QRCodeGenerator
                        data={session.qrCode}
                        title="QR Code Absensi"
                        size={200}
                        showControls={false}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'scanner' && (
          <div className="max-w-2xl mx-auto">
            <QRScanner
              onScan={handleQRScan}
              title="Scanner Absensi"
              description="Scan QR code santri untuk mencatat kehadiran"
              continuous={true}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AttendancePage;
