'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SetTargetModal from '@/components/modals/SetTargetModal';
import {
  Target,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Zap,
  Bell
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  HafalanTarget,
  getSurahById,
  getTargetStatusColor,
  getTargetStatusText,
  getPriorityColor,
  getPriorityText,
  getTargetTypeText,
  calculateTargetProgress,
  calculateDaysRemaining,
  isTargetOverdue
} from '@/lib/quran-data';

export default function HafalanTargetsPage() {
  const [targets, setTargets] = useState<HafalanTarget[]>([]);
  const [filteredTargets, setFilteredTargets] = useState<HafalanTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isSetTargetModalOpen, setIsSetTargetModalOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<HafalanTarget | null>(null);
  const [editingTarget, setEditingTarget] = useState<HafalanTarget | null>(null);

  // Mock data
  const mockTargets: HafalanTarget[] = [
    {
      id: 'target_1',
      santriId: 'santri_1',
      santriName: 'Ahmad Fauzi',
      surahId: 114,
      surahName: 'An-Nas',
      targetType: 'WEEKLY',
      targetAyahs: 6,
      completedAyahs: 6,
      targetDate: '2024-01-20T00:00:00Z',
      startDate: '2024-01-13T00:00:00Z',
      createdBy: 'admin_1',
      createdByName: 'Admin TPQ',
      createdAt: '2024-01-13T08:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      status: 'COMPLETED',
      progress: 100,
      priority: 'MEDIUM',
      description: 'Target hafalan surah An-Nas untuk pemula',
      notes: 'Santri sudah menguasai dengan baik',
      reminders: {
        enabled: true,
        frequency: 'DAILY',
        lastSent: '2024-01-15T07:00:00Z'
      },
      milestones: [
        { percentage: 25, achievedAt: '2024-01-14T09:00:00Z', reward: 'Sticker Bintang' },
        { percentage: 50, achievedAt: '2024-01-14T15:00:00Z', reward: 'Sertifikat Progress' },
        { percentage: 75, achievedAt: '2024-01-15T09:00:00Z', reward: 'Hadiah Kecil' },
        { percentage: 100, achievedAt: '2024-01-15T10:00:00Z', reward: 'Sertifikat Completion' }
      ]
    },
    {
      id: 'target_2',
      santriId: 'santri_2',
      santriName: 'Siti Aisyah',
      surahId: 112,
      surahName: 'Al-Ikhlas',
      targetType: 'WEEKLY',
      targetAyahs: 4,
      completedAyahs: 3,
      targetDate: '2024-01-25T00:00:00Z',
      startDate: '2024-01-18T00:00:00Z',
      createdBy: 'admin_1',
      createdByName: 'Admin TPQ',
      createdAt: '2024-01-18T08:00:00Z',
      updatedAt: '2024-01-20T14:00:00Z',
      status: 'ACTIVE',
      progress: 75,
      priority: 'HIGH',
      description: 'Target hafalan surah Al-Ikhlas',
      notes: 'Progress sangat baik, tinggal 1 ayat lagi',
      reminders: {
        enabled: true,
        frequency: 'DAILY'
      },
      milestones: [
        { percentage: 25, achievedAt: '2024-01-19T10:00:00Z', reward: 'Sticker Bintang' },
        { percentage: 50, achievedAt: '2024-01-19T16:00:00Z', reward: 'Sertifikat Progress' },
        { percentage: 75, achievedAt: '2024-01-20T14:00:00Z', reward: 'Hadiah Kecil' }
      ]
    },
    {
      id: 'target_3',
      santriId: 'santri_3',
      santriName: 'Muhammad Rizki',
      surahId: 1,
      surahName: 'Al-Fatihah',
      targetType: 'MONTHLY',
      targetAyahs: 7,
      completedAyahs: 2,
      targetDate: '2024-01-15T00:00:00Z',
      startDate: '2024-01-01T00:00:00Z',
      createdBy: 'admin_1',
      createdByName: 'Admin TPQ',
      createdAt: '2024-01-01T08:00:00Z',
      updatedAt: '2024-01-10T11:00:00Z',
      status: 'OVERDUE',
      progress: 28,
      priority: 'URGENT',
      description: 'Target hafalan surah Al-Fatihah',
      notes: 'Perlu perhatian khusus, progress lambat',
      reminders: {
        enabled: true,
        frequency: 'DAILY',
        lastSent: '2024-01-16T07:00:00Z'
      },
      milestones: [
        { percentage: 25, achievedAt: '2024-01-08T11:00:00Z', reward: 'Sticker Bintang' }
      ]
    },
    {
      id: 'target_4',
      santriId: 'santri_4',
      santriName: 'Fatimah Zahra',
      surahId: 110,
      surahName: 'An-Nasr',
      targetType: 'WEEKLY',
      targetAyahs: 3,
      completedAyahs: 1,
      targetDate: '2024-01-30T00:00:00Z',
      startDate: '2024-01-23T00:00:00Z',
      createdBy: 'admin_1',
      createdByName: 'Admin TPQ',
      createdAt: '2024-01-23T08:00:00Z',
      updatedAt: '2024-01-24T09:00:00Z',
      status: 'ACTIVE',
      progress: 33,
      priority: 'LOW',
      description: 'Target hafalan surah An-Nasr untuk pemula',
      notes: 'Baru memulai, progress sesuai rencana',
      reminders: {
        enabled: false,
        frequency: 'WEEKLY'
      },
      milestones: []
    }
  ];

  useEffect(() => {
    loadTargets();
  }, []);

  useEffect(() => {
    filterTargets();
  }, [targets, searchTerm, statusFilter, priorityFilter, typeFilter]);

  const loadTargets = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update target status based on current date
      const updatedTargets = mockTargets.map(target => {
        if (isTargetOverdue(target) && target.status === 'ACTIVE') {
          return { ...target, status: 'OVERDUE' as const };
        }
        return target;
      });
      
      setTargets(updatedTargets);
    } catch (error) {
      console.error('Error loading targets:', error);
      toast.error('Gagal memuat data target');
    } finally {
      setLoading(false);
    }
  };

  const filterTargets = () => {
    let filtered = targets;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(target =>
        target.santriName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        target.surahName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        target.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(target => target.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(target => target.priority === priorityFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(target => target.targetType === typeFilter);
    }

    setFilteredTargets(filtered);
  };

  const handleCreateTarget = (target: HafalanTarget) => {
    setTargets(prev => [...prev, target]);
    toast.success('Target berhasil dibuat!');
  };

  const handleUpdateTarget = (updatedTarget: HafalanTarget) => {
    setTargets(prev => prev.map(target => 
      target.id === updatedTarget.id ? updatedTarget : target
    ));
    setEditingTarget(null);
    toast.success('Target berhasil diperbarui!');
  };

  const handleDeleteTarget = async (targetId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus target ini?')) return;

    try {
      setTargets(prev => prev.filter(target => target.id !== targetId));
      toast.success('Target berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting target:', error);
      toast.error('Gagal menghapus target');
    }
  };

  const calculateStats = () => {
    const totalTargets = targets.length;
    const activeTargets = targets.filter(t => t.status === 'ACTIVE').length;
    const completedTargets = targets.filter(t => t.status === 'COMPLETED').length;
    const overdueTargets = targets.filter(t => t.status === 'OVERDUE').length;
    const averageProgress = targets.reduce((sum, t) => sum + t.progress, 0) / totalTargets || 0;

    return {
      totalTargets,
      activeTargets,
      completedTargets,
      overdueTargets,
      averageProgress: Math.round(averageProgress)
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Target Hafalan</h1>
          <p className="text-gray-600">Kelola target hafalan santri dan monitor progress</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsSetTargetModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Set Target
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Target</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTargets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif</p>
                <p className="text-2xl font-bold text-blue-600">{stats.activeTargets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Selesai</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedTargets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Terlambat</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdueTargets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rata-rata Progress</p>
                <p className="text-2xl font-bold text-purple-600">{stats.averageProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Cari santri, surah, atau deskripsi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="ACTIVE">Aktif</option>
                <option value="COMPLETED">Selesai</option>
                <option value="OVERDUE">Terlambat</option>
                <option value="PAUSED">Dijeda</option>
                <option value="CANCELLED">Dibatalkan</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">Semua Prioritas</option>
                <option value="URGENT">Mendesak</option>
                <option value="HIGH">Tinggi</option>
                <option value="MEDIUM">Sedang</option>
                <option value="LOW">Rendah</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">Semua Jenis</option>
                <option value="DAILY">Harian</option>
                <option value="WEEKLY">Mingguan</option>
                <option value="MONTHLY">Bulanan</option>
                <option value="YEARLY">Tahunan</option>
                <option value="CUSTOM">Kustom</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Targets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Target Hafalan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Santri</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Surah</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Jenis</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Progress</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Prioritas</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Deadline</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTargets.map((target) => {
                  const daysRemaining = calculateDaysRemaining(target.targetDate);
                  const isOverdue = isTargetOverdue(target);
                  
                  return (
                    <tr key={target.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{target.santriName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{target.surahName}</div>
                          <div className="text-sm text-gray-500">
                            {target.completedAyahs}/{target.targetAyahs} ayat
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {getTargetTypeText(target.targetType)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                          <div
                            className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(target.progress, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-600">{target.progress}%</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTargetStatusColor(target.status)}`}>
                          {getTargetStatusText(target.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(target.priority)}`}>
                          {getPriorityText(target.priority)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900">
                          {new Date(target.targetDate).toLocaleDateString('id-ID')}
                        </div>
                        <div className={`text-xs ${isOverdue ? 'text-red-600' : daysRemaining <= 3 ? 'text-orange-600' : 'text-gray-500'}`}>
                          {isOverdue 
                            ? `Terlambat ${Math.abs(daysRemaining)} hari`
                            : daysRemaining === 0 
                              ? 'Hari ini'
                              : `${daysRemaining} hari lagi`
                          }
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTarget(target)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingTarget(target);
                              setIsSetTargetModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTarget(target.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredTargets.length === 0 && (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada target</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || typeFilter !== 'all'
                    ? 'Tidak ada target yang sesuai dengan filter'
                    : 'Belum ada target hafalan yang dibuat'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Set Target Modal */}
      <SetTargetModal
        isOpen={isSetTargetModalOpen}
        onClose={() => {
          setIsSetTargetModalOpen(false);
          setEditingTarget(null);
        }}
        onSuccess={editingTarget ? handleUpdateTarget : handleCreateTarget}
        existingTarget={editingTarget || undefined}
      />
    </div>
  );
}
