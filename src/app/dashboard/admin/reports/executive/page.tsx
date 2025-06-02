'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Target,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Download,
  Mail,
  Printer,
  Share,
  Filter,
  RefreshCw,
  Eye,
  Star,
  Heart,
  BookOpen,
  Clock,
  Activity,
  Zap,
  Brain,
  Shield
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ExecutiveMetrics {
  overview: {
    totalStudents: number;
    activeStudents: number;
    averageBehaviorScore: number;
    overallGrade: string;
    monthlyImprovement: number;
    attendanceRate: number;
  };
  performance: {
    topPerformers: number;
    needsAttention: number;
    onTrack: number;
    exceedsExpectations: number;
  };
  trends: {
    behaviorTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
    trendPercentage: number;
    keyInsights: string[];
    riskFactors: string[];
  };
  goals: {
    totalGoals: number;
    completedGoals: number;
    activeGoals: number;
    averageProgress: number;
  };
  alerts: {
    critical: number;
    warning: number;
    info: number;
  };
}

export default function ExecutiveDashboard() {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('MONTHLY');
  const [refreshing, setRefreshing] = useState(false);

  // Mock executive metrics
  const mockMetrics: ExecutiveMetrics = {
    overview: {
      totalStudents: 125,
      activeStudents: 122,
      averageBehaviorScore: 82.5,
      overallGrade: 'B+',
      monthlyImprovement: 8.3,
      attendanceRate: 94.2
    },
    performance: {
      topPerformers: 28,
      needsAttention: 12,
      onTrack: 75,
      exceedsExpectations: 10
    },
    trends: {
      behaviorTrend: 'IMPROVING',
      trendPercentage: 15.2,
      keyInsights: [
        'Peningkatan signifikan dalam kategori Akhlaq (+18%)',
        'Program mentoring menunjukkan hasil positif',
        'Keterlibatan orang tua meningkat 25%',
        'Konsistensi ibadah harian mencapai 89%'
      ],
      riskFactors: [
        'Penurunan motivasi pada 8 santri senior',
        'Absensi menurun 3% setelah libur',
        'Perlu perhatian khusus untuk 5 santri baru'
      ]
    },
    goals: {
      totalGoals: 89,
      completedGoals: 34,
      activeGoals: 55,
      averageProgress: 67.8
    },
    alerts: {
      critical: 3,
      warning: 8,
      info: 15
    }
  };

  // Mock key performance indicators
  const kpiData = [
    {
      title: 'Character Excellence Rate',
      value: '78%',
      change: '+12%',
      trend: 'up',
      description: 'Santri dengan grade A- ke atas',
      target: '80%',
      status: 'on-track'
    },
    {
      title: 'Goal Completion Rate',
      value: '68%',
      change: '+5%',
      trend: 'up',
      description: 'Goal karakter yang diselesaikan tepat waktu',
      target: '75%',
      status: 'needs-attention'
    },
    {
      title: 'Parent Engagement',
      value: '85%',
      change: '+25%',
      trend: 'up',
      description: 'Tingkat keterlibatan orang tua',
      target: '90%',
      status: 'excellent'
    },
    {
      title: 'Intervention Success',
      value: '92%',
      change: '+8%',
      trend: 'up',
      description: 'Keberhasilan program intervensi',
      target: '85%',
      status: 'excellent'
    }
  ];

  // Mock recent achievements
  const recentAchievements = [
    {
      title: 'Program Mentoring Sukses',
      description: '15 santri menunjukkan peningkatan signifikan melalui program buddy system',
      date: '2024-02-10',
      impact: 'HIGH',
      category: 'PROGRAM_SUCCESS'
    },
    {
      title: 'Zero Bullying Month',
      description: 'Tidak ada laporan bullying selama bulan Februari 2024',
      date: '2024-02-28',
      impact: 'HIGH',
      category: 'SAFETY_MILESTONE'
    },
    {
      title: 'Parent Workshop Success',
      description: '95% kehadiran workshop parenting dengan feedback sangat positif',
      date: '2024-02-15',
      impact: 'MEDIUM',
      category: 'ENGAGEMENT'
    }
  ];

  useEffect(() => {
    loadExecutiveData();
  }, [selectedPeriod]);

  const loadExecutiveData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error loading executive data:', error);
      toast.error('Gagal memuat data executive dashboard');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Data berhasil diperbarui!');
    } catch (error) {
      toast.error('Gagal memperbarui data');
    } finally {
      setRefreshing(false);
    }
  };

  const exportReport = (format: 'PDF' | 'EXCEL' | 'POWERPOINT') => {
    toast.loading(`Generating ${format} report...`);
    setTimeout(() => {
      toast.dismiss();
      toast.success(`Executive report ${format} berhasil diunduh!`);
    }, 3000);
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'on-track': return 'text-blue-600 bg-blue-100';
      case 'needs-attention': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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
          <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-600">Ringkasan eksekutif perkembangan karakter santri TPQ Baitus Shuffah</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={refreshData}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => exportReport('POWERPOINT')}>
            <Download className="h-4 w-4 mr-2" />
            Export PPT
          </Button>
          <Button variant="outline" onClick={() => exportReport('PDF')}>
            <Printer className="h-4 w-4 mr-2" />
            Print Report
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">Periode Laporan:</label>
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
            <div className="ml-auto flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Santri</p>
                <p className="text-2xl font-bold text-blue-600">{mockMetrics.overview.totalStudents}</p>
                <p className="text-xs text-green-600">+{mockMetrics.overview.activeStudents} aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rata-rata Skor</p>
                <p className="text-2xl font-bold text-green-600">{mockMetrics.overview.averageBehaviorScore}</p>
                <p className="text-xs text-green-600">Grade {mockMetrics.overview.overallGrade}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-teal-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Peningkatan</p>
                <p className="text-2xl font-bold text-teal-600">{mockMetrics.overview.monthlyImprovement}%</p>
                <p className="text-xs text-teal-600">Bulan ini</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Goal Progress</p>
                <p className="text-2xl font-bold text-purple-600">{mockMetrics.goals.averageProgress}%</p>
                <p className="text-xs text-purple-600">{mockMetrics.goals.activeGoals} aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Kehadiran</p>
                <p className="text-2xl font-bold text-yellow-600">{mockMetrics.overview.attendanceRate}%</p>
                <p className="text-xs text-yellow-600">Rata-rata</p>
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
                <p className="text-sm font-medium text-gray-600">Alerts</p>
                <p className="text-2xl font-bold text-red-600">{mockMetrics.alerts.critical + mockMetrics.alerts.warning}</p>
                <p className="text-xs text-red-600">{mockMetrics.alerts.critical} critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Key Performance Indicators</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{kpi.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(kpi.status)}`}>
                    {kpi.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">{kpi.value}</span>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(kpi.trend)}
                    <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{kpi.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Target: {kpi.target}</span>
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <span>Distribusi Performa Santri</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Exceeds Expectations</span>
                </div>
                <span className="text-lg font-bold text-green-600">{mockMetrics.performance.exceedsExpectations}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">On Track</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{mockMetrics.performance.onTrack}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-900">Needs Attention</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">{mockMetrics.performance.needsAttention}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-900">Top Performers</span>
                </div>
                <span className="text-lg font-bold text-purple-600">{mockMetrics.performance.topPerformers}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>Key Insights & Risk Factors</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Zap className="h-4 w-4 text-green-600 mr-2" />
                  Key Insights
                </h4>
                <ul className="space-y-2">
                  {mockMetrics.trends.keyInsights.map((insight, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Shield className="h-4 w-4 text-red-600 mr-2" />
                  Risk Factors
                </h4>
                <ul className="space-y-2">
                  {mockMetrics.trends.riskFactors.map((risk, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <AlertTriangle className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-600" />
            <span>Recent Achievements & Milestones</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImpactColor(achievement.impact)}`}>
                      {achievement.impact} Impact
                    </span>
                    <span className="text-xs text-gray-500">{achievement.date}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Download className="h-6 w-6 mb-2" />
              <span className="text-sm">Download Full Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Mail className="h-6 w-6 mb-2" />
              <span className="text-sm">Email to Board</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Share className="h-6 w-6 mb-2" />
              <span className="text-sm">Share Dashboard</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm">Schedule Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
