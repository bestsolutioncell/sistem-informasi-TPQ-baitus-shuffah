'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Award,
  AlertTriangle,
  Calendar,
  Filter,
  Download,
  Eye,
  Star,
  Heart,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Brain,
  Lightbulb,
  Zap,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  BehaviorRecord,
  BehaviorSummary,
  BehaviorCategory,
  BehaviorType,
  getBehaviorCategoryColor,
  getBehaviorCategoryText,
  getCharacterGrade,
  getGradeColor,
  calculateBehaviorScore,
  calculateTrend
} from '@/lib/behavior-data';

export default function BehaviorAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('MONTHLY');
  const [selectedHalaqah, setSelectedHalaqah] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock analytics data
  const mockAnalyticsData = {
    overview: {
      totalStudents: 25,
      totalRecords: 156,
      averageScore: 78.5,
      improvingStudents: 18,
      needsAttention: 3,
      perfectBehavior: 4
    },
    categoryStats: [
      { category: 'AKHLAQ', count: 45, positiveCount: 38, negativeCount: 7, averagePoints: 3.2 },
      { category: 'IBADAH', count: 32, positiveCount: 29, negativeCount: 3, averagePoints: 4.1 },
      { category: 'ACADEMIC', count: 28, positiveCount: 22, negativeCount: 6, averagePoints: 2.8 },
      { category: 'SOCIAL', count: 25, positiveCount: 18, negativeCount: 7, averagePoints: 1.9 },
      { category: 'DISCIPLINE', count: 20, positiveCount: 8, negativeCount: 12, averagePoints: -1.2 },
      { category: 'LEADERSHIP', count: 6, positiveCount: 6, negativeCount: 0, averagePoints: 5.0 }
    ],
    topPerformers: [
      { santriId: 'santri_1', santriName: 'Ahmad Fauzi', score: 95, grade: 'A+', totalPoints: 48, trend: 'improving' },
      { santriId: 'santri_2', santriName: 'Siti Aisyah', score: 92, grade: 'A', totalPoints: 45, trend: 'stable' },
      { santriId: 'santri_4', santriName: 'Fatimah Zahra', score: 89, grade: 'A-', totalPoints: 42, trend: 'improving' },
      { santriId: 'santri_5', santriName: 'Abdullah Rahman', score: 85, grade: 'B+', totalPoints: 38, trend: 'improving' },
      { santriId: 'santri_8', santriName: 'Khadijah Binti Ali', score: 83, grade: 'B+', totalPoints: 36, trend: 'stable' }
    ],
    needsAttention: [
      { santriId: 'santri_3', santriName: 'Muhammad Rizki', score: 45, grade: 'D', totalPoints: -8, trend: 'declining', issues: ['Sering mengganggu kelas', 'Kurang disiplin'] },
      { santriId: 'santri_7', santriName: 'Umar Ibn Khattab', score: 52, grade: 'C-', totalPoints: -2, trend: 'declining', issues: ['Terlambat berulang', 'Kurang partisipasi'] },
      { santriId: 'santri_12', santriName: 'Zaynab Binti Ahmad', score: 58, grade: 'C', totalPoints: 2, trend: 'stable', issues: ['Interaksi sosial kurang', 'Perlu motivasi'] }
    ],
    weeklyTrends: [
      { week: 'Minggu 1', positiveCount: 28, negativeCount: 8, averageScore: 76 },
      { week: 'Minggu 2', positiveCount: 32, negativeCount: 6, averageScore: 79 },
      { week: 'Minggu 3', positiveCount: 35, negativeCount: 5, averageScore: 81 },
      { week: 'Minggu 4', positiveCount: 38, negativeCount: 4, averageScore: 83 }
    ],
    halaqahComparison: [
      { halaqahId: 'halaqah_1', halaqahName: 'Halaqah Al-Fatihah', studentCount: 12, averageScore: 82, positiveRate: 85 },
      { halaqahId: 'halaqah_2', halaqahName: 'Halaqah Al-Baqarah', studentCount: 8, averageScore: 75, positiveRate: 78 },
      { halaqahId: 'halaqah_3', halaqahName: 'Halaqah Ali Imran', studentCount: 5, averageScore: 73, positiveRate: 72 }
    ],
    aiInsights: [
      {
        type: 'POSITIVE_TREND',
        title: 'Peningkatan Signifikan dalam Akhlaq',
        description: 'Terjadi peningkatan 15% dalam kategori akhlaq selama 3 bulan terakhir. Pola ini menunjukkan efektivitas program pembinaan karakter.',
        impact: 'HIGH',
        confidence: 0.92,
        recommendation: 'Pertahankan dan replikasi metode pembinaan akhlaq ke kategori lain',
        actionItems: ['Dokumentasi best practices', 'Training musyrif lain', 'Evaluasi metode yang efektif']
      },
      {
        type: 'ATTENTION_NEEDED',
        title: 'Penurunan Performa Akademik',
        description: '8 santri menunjukkan penurunan konsisten dalam kategori akademik. Analisis menunjukkan korelasi dengan faktor eksternal.',
        impact: 'MEDIUM',
        confidence: 0.87,
        recommendation: 'Implementasi program remedial dan bimbingan khusus',
        actionItems: ['Identifikasi faktor penyebab', 'Program bimbingan individual', 'Koordinasi dengan orang tua']
      },
      {
        type: 'OPPORTUNITY',
        title: 'Potensi Kepemimpinan Teridentifikasi',
        description: '12 santri menunjukkan karakteristik kepemimpinan yang dapat dikembangkan berdasarkan pola perilaku positif.',
        impact: 'MEDIUM',
        confidence: 0.89,
        recommendation: 'Buat program pengembangan kepemimpinan khusus',
        actionItems: ['Seleksi calon pemimpin', 'Program leadership training', 'Mentoring berkelanjutan']
      },
      {
        type: 'PATTERN_DETECTED',
        title: 'Pola Perilaku Musiman',
        description: 'Terdeteksi pola penurunan disiplin pada minggu pertama setelah libur. Pola ini konsisten selama 6 bulan.',
        impact: 'LOW',
        confidence: 0.94,
        recommendation: 'Siapkan program transisi khusus setelah libur',
        actionItems: ['Program re-orientasi', 'Aktivitas ice breaking', 'Reminder rutinitas']
      }
    ],
    predictions: [
      {
        santriId: 'santri_1',
        santriName: 'Ahmad Fauzi',
        currentScore: 95,
        predictedScore: 97,
        confidence: 0.91,
        timeframe: '1 bulan',
        factors: ['Konsistensi tinggi dalam 3 bulan', 'Trend positif stabil', 'Dukungan keluarga optimal'],
        risks: [],
        recommendation: 'Berikan tantangan lebih untuk mengoptimalkan potensi kepemimpinan'
      },
      {
        santriId: 'santri_3',
        santriName: 'Muhammad Rizki',
        currentScore: 45,
        predictedScore: 58,
        confidence: 0.85,
        timeframe: '2 bulan',
        factors: ['Respon positif terhadap intervensi', 'Dukungan keluarga meningkat', 'Motivasi mulai tumbuh'],
        risks: ['Konsistensi masih rendah', 'Pengaruh teman sebaya'],
        recommendation: 'Intensifkan program bimbingan dan monitoring ketat'
      },
      {
        santriId: 'santri_2',
        santriName: 'Siti Aisyah',
        currentScore: 92,
        predictedScore: 94,
        confidence: 0.88,
        timeframe: '1 bulan',
        factors: ['Peningkatan stabil', 'Motivasi tinggi', 'Respon baik terhadap feedback'],
        risks: ['Potensi plateau'],
        recommendation: 'Lanjutkan pendampingan dengan variasi metode untuk mencegah stagnasi'
      }
    ],
    interventionRecommendations: [
      {
        priority: 'HIGH',
        category: 'DISCIPLINE',
        issue: 'Tingkat keterlambatan tinggi pada Halaqah Ali Imran',
        affectedStudents: 3,
        suggestedActions: [
          'Implementasi sistem reward untuk ketepatan waktu',
          'Koordinasi dengan orang tua untuk monitoring di rumah',
          'Program motivasi khusus tentang pentingnya disiplin waktu'
        ],
        expectedOutcome: 'Penurunan tingkat keterlambatan 50% dalam 1 bulan',
        timeline: '4 minggu'
      },
      {
        priority: 'MEDIUM',
        category: 'SOCIAL',
        issue: 'Beberapa santri menunjukkan kesulitan interaksi sosial',
        affectedStudents: 5,
        suggestedActions: [
          'Program buddy system untuk santri pemalu',
          'Aktivitas kelompok yang terstruktur',
          'Training komunikasi dan empati'
        ],
        expectedOutcome: 'Peningkatan skor kategori sosial 20%',
        timeline: '6 minggu'
      }
    ]
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod, selectedHalaqah, selectedCategory]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast.error('Gagal memuat data analytics');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <ArrowDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600 bg-green-100';
      case 'declining': return 'text-red-600 bg-red-100';
      case 'stable': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'POSITIVE_TREND': return 'border-green-200 bg-green-50';
      case 'ATTENTION_NEEDED': return 'border-red-200 bg-red-50';
      case 'OPPORTUNITY': return 'border-blue-200 bg-blue-50';
      case 'PATTERN_DETECTED': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'POSITIVE_TREND': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'ATTENTION_NEEDED': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'OPPORTUNITY': return <Lightbulb className="h-5 w-5 text-blue-600" />;
      case 'PATTERN_DETECTED': return <Brain className="h-5 w-5 text-purple-600" />;
      default: return <Brain className="h-5 w-5 text-gray-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH': return 'text-red-600 bg-red-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-100 border-red-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'LOW': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
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
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights Perilaku</h1>
          <p className="text-gray-600">Analisis mendalam dengan AI-powered insights dan prediksi perkembangan karakter santri</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline">
            <Brain className="h-4 w-4 mr-2" />
            AI Insights
          </Button>
          <Button variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            Predictions
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">Period:</label>
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="WEEKLY">Mingguan</option>
              <option value="MONTHLY">Bulanan</option>
              <option value="QUARTERLY">Triwulan</option>
              <option value="YEARLY">Tahunan</option>
            </select>
            <select
              value={selectedHalaqah}
              onChange={(e) => setSelectedHalaqah(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">Semua Halaqah</option>
              <option value="halaqah_1">Halaqah Al-Fatihah</option>
              <option value="halaqah_2">Halaqah Al-Baqarah</option>
              <option value="halaqah_3">Halaqah Ali Imran</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">Semua Kategori</option>
              <option value="AKHLAQ">Akhlaq</option>
              <option value="IBADAH">Ibadah</option>
              <option value="ACADEMIC">Akademik</option>
              <option value="SOCIAL">Sosial</option>
              <option value="DISCIPLINE">Disiplin</option>
              <option value="LEADERSHIP">Kepemimpinan</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Santri</p>
                <p className="text-2xl font-bold text-gray-900">{mockAnalyticsData.overview.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Catatan</p>
                <p className="text-2xl font-bold text-gray-900">{mockAnalyticsData.overview.totalRecords}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Target className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rata-rata Skor</p>
                <p className="text-2xl font-bold text-teal-600">{mockAnalyticsData.overview.averageScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Berkembang</p>
                <p className="text-2xl font-bold text-green-600">{mockAnalyticsData.overview.improvingStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Perlu Perhatian</p>
                <p className="text-2xl font-bold text-red-600">{mockAnalyticsData.overview.needsAttention}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Perilaku Sempurna</p>
                <p className="text-2xl font-bold text-yellow-600">{mockAnalyticsData.overview.perfectBehavior}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistik per Kategori Perilaku</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAnalyticsData.categoryStats.map((category) => (
              <div key={category.category} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getBehaviorCategoryColor(category.category)}`}>
                    {getBehaviorCategoryText(category.category)}
                  </span>
                  <span className="text-lg font-bold text-gray-900">{category.count}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Positif:</span>
                    <span className="font-medium">{category.positiveCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600">Negatif:</span>
                    <span className="font-medium">{category.negativeCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rata-rata Poin:</span>
                    <span className={`font-medium ${category.averagePoints > 0 ? 'text-green-600' : category.averagePoints < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {category.averagePoints > 0 ? '+' : ''}{category.averagePoints}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(category.positiveCount / category.count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-600" />
            <span>Santri Berprestasi</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnalyticsData.topPerformers.map((student, index) => (
              <div key={student.santriId} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{student.santriName}</h4>
                    <p className="text-sm text-gray-600">Total Poin: {student.totalPoints}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{student.score}</p>
                    <p className="text-xs text-gray-600">Skor</p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-bold rounded-full ${getGradeColor(student.grade)}`}>
                    {student.grade}
                  </span>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${getTrendColor(student.trend)}`}>
                    {getTrendIcon(student.trend)}
                    <span className="text-xs font-medium capitalize">{student.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Students Needing Attention */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Santri yang Memerlukan Perhatian</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnalyticsData.needsAttention.map((student) => (
              <div key={student.santriId} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{student.santriName}</h4>
                    <p className="text-sm text-gray-600">Total Poin: {student.totalPoints}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-red-600">{student.score}</p>
                      <p className="text-xs text-gray-600">Skor</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${getGradeColor(student.grade)}`}>
                      {student.grade}
                    </span>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${getTrendColor(student.trend)}`}>
                      {getTrendIcon(student.trend)}
                      <span className="text-xs font-medium capitalize">{student.trend}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-800 mb-2">Area yang perlu diperbaiki:</p>
                  <ul className="text-sm text-red-700 space-y-1">
                    {student.issues.map((issue, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <XCircle className="h-3 w-3" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Halaqah Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Perbandingan Antar Halaqah</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnalyticsData.halaqahComparison.map((halaqah) => (
              <div key={halaqah.halaqahId} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{halaqah.halaqahName}</h4>
                    <p className="text-sm text-gray-600">{halaqah.studentCount} santri</p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{halaqah.averageScore}</p>
                      <p className="text-xs text-gray-600">Rata-rata Skor</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{halaqah.positiveRate}%</p>
                      <p className="text-xs text-gray-600">Tingkat Positif</p>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full"
                    style={{ width: `${halaqah.positiveRate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI-Powered Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnalyticsData.aiInsights.map((insight, index) => (
              <div key={index} className={`p-4 border rounded-lg ${getInsightColor(insight.type)}`}>
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImpactColor(insight.impact)}`}>
                          Impact: {insight.impact}
                        </span>
                        <span className="text-xs text-gray-600">
                          Confidence: {Math.round(insight.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm font-medium text-gray-900 mb-2">Rekomendasi:</p>
                      <p className="text-sm text-gray-700 mb-2">{insight.recommendation}</p>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-700">Action Items:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {insight.actionItems.map((item, idx) => (
                            <li key={idx} className="flex items-center space-x-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span>Prediksi Perkembangan Santri</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnalyticsData.predictions.map((prediction) => (
              <div key={prediction.santriId} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{prediction.santriName}</h4>
                    <p className="text-sm text-gray-600">Prediksi {prediction.timeframe}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{prediction.currentScore}</p>
                      <p className="text-xs text-gray-600">Skor Saat Ini</p>
                    </div>
                    <ArrowUp className="h-4 w-4 text-blue-600" />
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">{prediction.predictedScore}</p>
                      <p className="text-xs text-gray-600">Prediksi</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-green-600">{Math.round(prediction.confidence * 100)}%</p>
                      <p className="text-xs text-gray-600">Confidence</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Faktor Pendukung:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {prediction.factors.map((factor, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {prediction.risks.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Risiko:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {prediction.risks.map((risk, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <AlertTriangle className="h-3 w-3 text-red-600" />
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-3 p-3 bg-blue-50 rounded">
                  <p className="text-sm font-medium text-blue-900 mb-1">Rekomendasi:</p>
                  <p className="text-sm text-blue-800">{prediction.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Intervention Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <span>Rekomendasi Intervensi</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnalyticsData.interventionRecommendations.map((intervention, index) => (
              <div key={index} className={`p-4 border rounded-lg ${getPriorityColor(intervention.priority)}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{intervention.issue}</h4>
                    <p className="text-sm text-gray-600">
                      Kategori: {intervention.category} • {intervention.affectedStudents} santri terpengaruh
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(intervention.priority)}`}>
                    {intervention.priority} Priority
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Tindakan yang Disarankan:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {intervention.suggestedActions.map((action, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Target Hasil:</p>
                      <p className="text-sm text-gray-600">{intervention.expectedOutcome}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Timeline:</p>
                      <p className="text-sm text-gray-600">{intervention.timeline}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
