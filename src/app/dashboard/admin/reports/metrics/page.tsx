'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Users,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Activity,
  Zap,
  Heart,
  BookOpen,
  Shield,
  Gauge,
  LineChart,
  PieChart
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface KPI {
  id: string;
  name: string;
  description: string;
  category: 'BEHAVIOR' | 'ACADEMIC' | 'ENGAGEMENT' | 'OPERATIONAL' | 'STRATEGIC';
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
  trendPercentage: number;
  status: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';
  lastUpdated: string;
  historicalData: { period: string; value: number }[];
}

interface Benchmark {
  id: string;
  name: string;
  category: string;
  ourValue: number;
  benchmarkValue: number;
  unit: string;
  comparison: 'ABOVE' | 'BELOW' | 'EQUAL';
  percentageDiff: number;
  source: string;
}

export default function PerformanceMetrics() {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState('MONTHLY');
  const [refreshing, setRefreshing] = useState(false);

  // Mock KPI data
  const mockKPIs: KPI[] = [
    {
      id: 'kpi_1',
      name: 'Average Behavior Score',
      description: 'Rata-rata skor perilaku seluruh santri',
      category: 'BEHAVIOR',
      currentValue: 82.5,
      targetValue: 85,
      unit: 'points',
      trend: 'UP',
      trendPercentage: 8.3,
      status: 'GOOD',
      lastUpdated: '2024-02-29T23:59:59Z',
      historicalData: [
        { period: 'Dec 2023', value: 78 },
        { period: 'Jan 2024', value: 80 },
        { period: 'Feb 2024', value: 82.5 }
      ]
    },
    {
      id: 'kpi_2',
      name: 'Character Excellence Rate',
      description: 'Persentase santri dengan grade A- ke atas',
      category: 'BEHAVIOR',
      currentValue: 78,
      targetValue: 80,
      unit: '%',
      trend: 'UP',
      trendPercentage: 12,
      status: 'GOOD',
      lastUpdated: '2024-02-29T23:59:59Z',
      historicalData: [
        { period: 'Dec 2023', value: 68 },
        { period: 'Jan 2024', value: 72 },
        { period: 'Feb 2024', value: 78 }
      ]
    },
    {
      id: 'kpi_3',
      name: 'Goal Completion Rate',
      description: 'Persentase goal karakter yang diselesaikan tepat waktu',
      category: 'STRATEGIC',
      currentValue: 68,
      targetValue: 75,
      unit: '%',
      trend: 'UP',
      trendPercentage: 5,
      status: 'WARNING',
      lastUpdated: '2024-02-29T23:59:59Z',
      historicalData: [
        { period: 'Dec 2023', value: 62 },
        { period: 'Jan 2024', value: 65 },
        { period: 'Feb 2024', value: 68 }
      ]
    },
    {
      id: 'kpi_4',
      name: 'Parent Engagement Rate',
      description: 'Tingkat keterlibatan orang tua dalam program TPQ',
      category: 'ENGAGEMENT',
      currentValue: 85,
      targetValue: 90,
      unit: '%',
      trend: 'UP',
      trendPercentage: 25,
      status: 'EXCELLENT',
      lastUpdated: '2024-02-29T23:59:59Z',
      historicalData: [
        { period: 'Dec 2023', value: 65 },
        { period: 'Jan 2024', value: 75 },
        { period: 'Feb 2024', value: 85 }
      ]
    },
    {
      id: 'kpi_5',
      name: 'Attendance Rate',
      description: 'Tingkat kehadiran santri',
      category: 'OPERATIONAL',
      currentValue: 94.2,
      targetValue: 95,
      unit: '%',
      trend: 'STABLE',
      trendPercentage: 1.2,
      status: 'GOOD',
      lastUpdated: '2024-02-29T23:59:59Z',
      historicalData: [
        { period: 'Dec 2023', value: 93 },
        { period: 'Jan 2024', value: 94 },
        { period: 'Feb 2024', value: 94.2 }
      ]
    },
    {
      id: 'kpi_6',
      name: 'Intervention Success Rate',
      description: 'Keberhasilan program intervensi perilaku',
      category: 'STRATEGIC',
      currentValue: 92,
      targetValue: 85,
      unit: '%',
      trend: 'UP',
      trendPercentage: 8,
      status: 'EXCELLENT',
      lastUpdated: '2024-02-29T23:59:59Z',
      historicalData: [
        { period: 'Dec 2023', value: 85 },
        { period: 'Jan 2024', value: 88 },
        { period: 'Feb 2024', value: 92 }
      ]
    },
    {
      id: 'kpi_7',
      name: 'Academic Progress Rate',
      description: 'Tingkat kemajuan akademik santri',
      category: 'ACADEMIC',
      currentValue: 79,
      targetValue: 82,
      unit: '%',
      trend: 'DOWN',
      trendPercentage: -2.5,
      status: 'WARNING',
      lastUpdated: '2024-02-29T23:59:59Z',
      historicalData: [
        { period: 'Dec 2023', value: 81 },
        { period: 'Jan 2024', value: 80 },
        { period: 'Feb 2024', value: 79 }
      ]
    },
    {
      id: 'kpi_8',
      name: 'Safety Incident Rate',
      description: 'Jumlah insiden keamanan per 100 santri',
      category: 'OPERATIONAL',
      currentValue: 0.8,
      targetValue: 1,
      unit: 'incidents/100',
      trend: 'DOWN',
      trendPercentage: -60,
      status: 'EXCELLENT',
      lastUpdated: '2024-02-29T23:59:59Z',
      historicalData: [
        { period: 'Dec 2023', value: 2 },
        { period: 'Jan 2024', value: 1.2 },
        { period: 'Feb 2024', value: 0.8 }
      ]
    }
  ];

  // Mock benchmark data
  const mockBenchmarks: Benchmark[] = [
    {
      id: 'bench_1',
      name: 'Average Behavior Score',
      category: 'Regional TPQ Average',
      ourValue: 82.5,
      benchmarkValue: 78,
      unit: 'points',
      comparison: 'ABOVE',
      percentageDiff: 5.8,
      source: 'Regional TPQ Network 2024'
    },
    {
      id: 'bench_2',
      name: 'Parent Engagement',
      category: 'National Islamic Education',
      ourValue: 85,
      benchmarkValue: 72,
      unit: '%',
      comparison: 'ABOVE',
      percentageDiff: 18.1,
      source: 'National Islamic Education Survey 2024'
    },
    {
      id: 'bench_3',
      name: 'Goal Completion Rate',
      category: 'Best Practice Standard',
      ourValue: 68,
      benchmarkValue: 75,
      unit: '%',
      comparison: 'BELOW',
      percentageDiff: -9.3,
      source: 'Islamic Education Best Practices 2024'
    },
    {
      id: 'bench_4',
      name: 'Attendance Rate',
      category: 'Regional Average',
      ourValue: 94.2,
      benchmarkValue: 91,
      unit: '%',
      comparison: 'ABOVE',
      percentageDiff: 3.5,
      source: 'Regional Education Statistics 2024'
    }
  ];

  useEffect(() => {
    loadMetrics();
  }, [selectedCategory, selectedPeriod]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error loading metrics:', error);
      toast.error('Gagal memuat metrics');
    } finally {
      setLoading(false);
    }
  };

  const refreshMetrics = async () => {
    try {
      setRefreshing(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Metrics berhasil diperbarui!');
    } catch (error) {
      toast.error('Gagal memperbarui metrics');
    } finally {
      setRefreshing(false);
    }
  };

  const exportMetrics = (format: 'PDF' | 'EXCEL') => {
    toast.loading(`Exporting metrics to ${format}...`);
    setTimeout(() => {
      toast.dismiss();
      toast.success(`Metrics ${format} berhasil diunduh!`);
    }, 2000);
  };

  const getStatusColor = (status: KPI['status']) => {
    switch (status) {
      case 'EXCELLENT': return 'text-green-600 bg-green-100';
      case 'GOOD': return 'text-blue-600 bg-blue-100';
      case 'WARNING': return 'text-yellow-600 bg-yellow-100';
      case 'CRITICAL': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: KPI['status']) => {
    switch (status) {
      case 'EXCELLENT': return <CheckCircle className="h-4 w-4" />;
      case 'GOOD': return <CheckCircle className="h-4 w-4" />;
      case 'WARNING': return <AlertTriangle className="h-4 w-4" />;
      case 'CRITICAL': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: KPI['trend']) => {
    switch (trend) {
      case 'UP': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'DOWN': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'STABLE': return <Activity className="h-4 w-4 text-gray-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: KPI['category']) => {
    switch (category) {
      case 'BEHAVIOR': return <Heart className="h-5 w-5" />;
      case 'ACADEMIC': return <BookOpen className="h-5 w-5" />;
      case 'ENGAGEMENT': return <Users className="h-5 w-5" />;
      case 'OPERATIONAL': return <Settings className="h-5 w-5" />;
      case 'STRATEGIC': return <Target className="h-5 w-5" />;
      default: return <BarChart3 className="h-5 w-5" />;
    }
  };

  const getComparisonColor = (comparison: Benchmark['comparison']) => {
    switch (comparison) {
      case 'ABOVE': return 'text-green-600 bg-green-100';
      case 'BELOW': return 'text-red-600 bg-red-100';
      case 'EQUAL': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredKPIs = selectedCategory === 'ALL' 
    ? mockKPIs 
    : mockKPIs.filter(kpi => kpi.category === selectedCategory);

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
          <h1 className="text-2xl font-bold text-gray-900">Performance Metrics</h1>
          <p className="text-gray-600">Monitor dan analisis KPI perkembangan karakter santri</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={refreshMetrics}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => exportMetrics('EXCEL')}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure KPIs
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="BEHAVIOR">Behavior</option>
              <option value="ACADEMIC">Academic</option>
              <option value="ENGAGEMENT">Engagement</option>
              <option value="OPERATIONAL">Operational</option>
              <option value="STRATEGIC">Strategic</option>
            </select>
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

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredKPIs.slice(0, 4).map((kpi) => (
          <Card key={kpi.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-teal-100 rounded-lg">
                  {getCategoryIcon(kpi.category)}
                </div>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(kpi.status)}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(kpi.status)}`}>
                    {kpi.status}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">{kpi.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {kpi.currentValue}{kpi.unit === 'points' ? '' : kpi.unit}
                  </span>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(kpi.trend)}
                    <span className={`text-sm font-medium ${
                      kpi.trend === 'UP' ? 'text-green-600' : 
                      kpi.trend === 'DOWN' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {kpi.trendPercentage > 0 ? '+' : ''}{kpi.trendPercentage}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Target: {kpi.targetValue}{kpi.unit === 'points' ? '' : kpi.unit}</span>
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed KPIs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gauge className="h-5 w-5 text-blue-600" />
            <span>Detailed KPI Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredKPIs.map((kpi) => (
              <div key={kpi.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getCategoryIcon(kpi.category)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{kpi.name}</h4>
                      <p className="text-sm text-gray-600">{kpi.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {kpi.currentValue}{kpi.unit === 'points' ? '' : kpi.unit}
                      </div>
                      <div className="text-xs text-gray-600">Current</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {kpi.targetValue}{kpi.unit === 'points' ? '' : kpi.unit}
                      </div>
                      <div className="text-xs text-gray-600">Target</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(kpi.trend)}
                      <span className={`text-sm font-medium ${
                        kpi.trend === 'UP' ? 'text-green-600' : 
                        kpi.trend === 'DOWN' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {kpi.trendPercentage > 0 ? '+' : ''}{kpi.trendPercentage}%
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(kpi.status)}`}>
                      {kpi.status}
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress to Target</span>
                    <span className="font-medium">
                      {Math.round((kpi.currentValue / kpi.targetValue) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        kpi.currentValue >= kpi.targetValue ? 'bg-green-600' :
                        kpi.currentValue >= kpi.targetValue * 0.8 ? 'bg-blue-600' :
                        kpi.currentValue >= kpi.targetValue * 0.6 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${Math.min((kpi.currentValue / kpi.targetValue) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Historical Data */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4 text-xs text-gray-600">
                    {kpi.historicalData.map((data, index) => (
                      <div key={index} className="text-center">
                        <div className="font-medium text-gray-900">{data.value}</div>
                        <div>{data.period}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <LineChart className="h-3 w-3 mr-1" />
                      Trend
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Benchmarking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-600" />
            <span>Benchmarking Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockBenchmarks.map((benchmark) => (
              <div key={benchmark.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{benchmark.name}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getComparisonColor(benchmark.comparison)}`}>
                    {benchmark.comparison === 'ABOVE' ? 'Above Benchmark' :
                     benchmark.comparison === 'BELOW' ? 'Below Benchmark' : 'At Benchmark'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center mb-3">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{benchmark.ourValue}{benchmark.unit}</div>
                    <div className="text-xs text-gray-600">Our Value</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-600">{benchmark.benchmarkValue}{benchmark.unit}</div>
                    <div className="text-xs text-gray-600">Benchmark</div>
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${
                      benchmark.comparison === 'ABOVE' ? 'text-green-600' : 
                      benchmark.comparison === 'BELOW' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {benchmark.percentageDiff > 0 ? '+' : ''}{benchmark.percentageDiff}%
                    </div>
                    <div className="text-xs text-gray-600">Difference</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Source:</span> {benchmark.source}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
