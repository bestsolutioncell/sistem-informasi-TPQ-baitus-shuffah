'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/providers/AuthProvider';
import AddStudentModal from '@/components/modals/AddStudentModal';
import StudentDetailModal from '@/components/modals/StudentDetailModal';
import {
  GraduationCap,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Download,
  Users,
  BookOpen,
  Calendar
} from 'lucide-react';

interface Santri {
  id: string;
  nis: string;
  name: string;
  birthDate: string;
  birthPlace: string;
  gender: 'MALE' | 'FEMALE';
  address: string;
  phone?: string;
  email?: string;
  photo?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'DROPPED_OUT';
  enrollmentDate: string;
  graduationDate?: string;
  wali: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  halaqah?: {
    id: string;
    name: string;
    level: string;
  };
  hafalan: any[];
  attendance: any[];
  payments: any[];
  createdAt: string;
  updatedAt: string;
}

export default function SantriPage() {
  const { user } = useAuth();
  const [santri, setSantri] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [halaqahFilter, setHalaqahFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingSantri, setEditingSantri] = useState<any>(null);
  const [selectedSantri, setSelectedSantri] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [halaqahList, setHalaqahList] = useState<any[]>([]);

  useEffect(() => {
    loadSantri();
    loadHalaqahList();
  }, []);

  const loadSantri = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with API call later
      const mockSantri = [
        {
          id: '1',
          name: 'Ahmad Fauzi',
          nis: '24001',
          gender: 'L',
          birthPlace: 'Jakarta',
          birthDate: '2010-05-15',
          address: 'Jl. Masjid No. 123, Jakarta Selatan',
          phone: '081234567890',
          parentName: 'Bapak Ahmad',
          parentPhone: '081234567891',
          parentEmail: 'ahmad.parent@email.com',
          parentOccupation: 'Wiraswasta',
          halaqah: 'Al-Fatihah',
          musyrif: 'Ustadz Abdullah',
          joinDate: '2024-01-15',
          status: 'ACTIVE',
          previousEducation: 'TK Al-Ikhlas',
          medicalInfo: 'Tidak ada alergi',
          notes: 'Santri yang rajin dan disiplin'
        },
        {
          id: '2',
          name: 'Siti Aisyah',
          nis: '24002',
          gender: 'P',
          birthPlace: 'Bandung',
          birthDate: '2011-03-20',
          address: 'Jl. Pondok No. 456, Jakarta Timur',
          phone: '081234567892',
          parentName: 'Ibu Siti',
          parentPhone: '081234567893',
          parentEmail: 'siti.parent@email.com',
          parentOccupation: 'Guru',
          halaqah: 'Al-Fatihah',
          musyrif: 'Ustadzah Fatimah',
          joinDate: '2024-02-01',
          status: 'ACTIVE',
          previousEducation: 'TK Pertiwi',
          medicalInfo: 'Alergi seafood',
          notes: 'Santri yang cerdas dan aktif'
        },
        {
          id: '3',
          name: 'Muhammad Rizki',
          nis: '24003',
          gender: 'L',
          birthPlace: 'Surabaya',
          birthDate: '2009-12-10',
          address: 'Jl. Tahfidz No. 789, Jakarta Barat',
          phone: '081234567894',
          parentName: 'Bapak Rizki',
          parentPhone: '081234567895',
          parentEmail: 'rizki.parent@email.com',
          parentOccupation: 'Pegawai Negeri',
          halaqah: 'Al-Baqarah',
          musyrif: 'Ustadz Abdullah',
          joinDate: '2023-12-10',
          status: 'ACTIVE',
          previousEducation: 'SD Negeri 1',
          medicalInfo: 'Sehat',
          notes: 'Santri yang tekun dalam hafalan'
        }
      ];

      setSantri(mockSantri);
    } catch (error) {
      console.error('Error loading santri:', error);
      alert('Gagal memuat data santri');
    } finally {
      setLoading(false);
    }
  };

  const loadHalaqahList = async () => {
    try {
      // Mock halaqah data
      const mockHalaqah = [
        { id: '1', name: 'Halaqah Al-Fatihah', level: 'Pemula' },
        { id: '2', name: 'Halaqah Al-Baqarah', level: 'Menengah' },
        { id: '3', name: 'Halaqah Ali Imran', level: 'Lanjutan' },
        { id: '4', name: 'Halaqah An-Nisa', level: 'Mahir' }
      ];
      setHalaqahList(mockHalaqah);
    } catch (error) {
      console.error('Error loading halaqah:', error);
    }
  };

  const handleCreateSantri = async (santriData: any) => {
    try {
      setFormLoading(true);
      // Mock create - add to local state
      const newSantri = {
        ...santriData,
        id: `student_${Date.now()}`
      };
      setSantri(prev => [...prev, newSantri]);
      alert('Santri berhasil ditambahkan!');
      setShowAddModal(false);
    } catch (error) {
      console.error('Error creating santri:', error);
      alert('Gagal menambahkan santri');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateSantri = async (santriData: any) => {
    try {
      setFormLoading(true);
      // Mock update - update local state
      setSantri(prev => prev.map(s =>
        s.id === editingSantri?.id ? { ...santriData, id: editingSantri.id } : s
      ));
      alert('Data santri berhasil diperbarui!');
      setEditingSantri(null);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error updating santri:', error);
      alert('Gagal memperbarui data santri');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSantri = async (santriId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus santri ini?')) return;

    try {
      // Mock delete - remove from local state
      setSantri(prev => prev.filter(s => s.id !== santriId));
      alert('Santri berhasil dihapus!');
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error deleting santri:', error);
      alert('Gagal menghapus santri');
    }
  };

  const handleViewDetail = (santri: any) => {
    setSelectedSantri(santri);
    setShowDetailModal(true);
  };

  const handleEditSantri = (santri: any) => {
    setEditingSantri(santri);
    setShowDetailModal(false);
    setShowAddModal(true);
  };

  const filteredSantri = santri.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (s.parentName && s.parentName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesHalaqah = halaqahFilter === 'ALL' ||
                          (halaqahFilter === 'NONE' && !s.halaqah) ||
                          s.halaqah === halaqahFilter;

    return matchesSearch && matchesStatus && matchesHalaqah;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'secondary';
      case 'GRADUATED': return 'warning';
      case 'DROPPED': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Aktif';
      case 'INACTIVE': return 'Tidak Aktif';
      case 'GRADUATED': return 'Lulus';
      case 'DROPPED': return 'Keluar';
      default: return status;
    }
  };

  const getGenderLabel = (gender: string) => {
    return gender === 'L' ? 'Laki-laki' : 'Perempuan';
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };



  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-teal-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manajemen Santri</h1>
              <p className="text-gray-600">Kelola data santri TPQ Baitus Shuffah</p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Tambah Santri
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Santri</p>
                  <p className="text-2xl font-bold text-gray-900">{santri.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Santri Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {santri.filter(s => s.status === 'ACTIVE').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lulus</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {santri.filter(s => s.status === 'GRADUATED').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Santri Baru</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {santri.filter(s => {
                      const enrollDate = new Date(s.joinDate);
                      const thisMonth = new Date();
                      return enrollDate.getMonth() === thisMonth.getMonth() &&
                             enrollDate.getFullYear() === thisMonth.getFullYear();
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Santri
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Nama, NIS, atau wali..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="ACTIVE">Aktif</option>
                  <option value="INACTIVE">Tidak Aktif</option>
                  <option value="GRADUATED">Lulus</option>
                  <option value="DROPPED_OUT">Keluar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Halaqah
                </label>
                <select
                  value={halaqahFilter}
                  onChange={(e) => setHalaqahFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="ALL">Semua Halaqah</option>
                  <option value="NONE">Belum Ada Halaqah</option>
                  {halaqahList.map((halaqah) => (
                    <option key={halaqah.id} value={halaqah.id}>
                      {halaqah.name} - {halaqah.level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Santri Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Santri ({filteredSantri.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat data santri...</p>
              </div>
            ) : filteredSantri.length === 0 ? (
              <div className="text-center py-8">
                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada santri</h3>
                <p className="text-gray-600">Belum ada data santri atau tidak sesuai filter</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Santri</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Wali</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Halaqah</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Tgl Masuk</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSantri.map((s) => (
                      <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                              <span className="text-teal-600 font-medium">
                                {s.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{s.name}</p>
                              <p className="text-sm text-gray-600">NIS: {s.nis}</p>
                              <p className="text-sm text-gray-500">
                                {getGenderLabel(s.gender)} • {calculateAge(s.birthDate)} tahun
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{s.parentName}</p>
                            <p className="text-sm text-gray-600">{s.parentPhone}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {s.halaqah ? (
                            <div>
                              <p className="font-medium text-gray-900">{s.halaqah}</p>
                              <p className="text-sm text-gray-600">{s.musyrif}</p>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">Belum ada halaqah</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={getStatusBadgeColor(s.status) as any}>
                            {getStatusLabel(s.status)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-600">
                            {new Date(s.joinDate).toLocaleDateString('id-ID')}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetail(s)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              Detail
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditSantri(s)}
                              className="flex items-center gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <AddStudentModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setEditingSantri(null);
          }}
          onSave={editingSantri ? handleUpdateSantri : handleCreateSantri}
          editData={editingSantri}
        />

        <StudentDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onEdit={() => handleEditSantri(selectedSantri)}
          onDelete={() => handleDeleteSantri(selectedSantri?.id)}
          student={selectedSantri}
        />
      </div>
    </DashboardLayout>
  );
}
