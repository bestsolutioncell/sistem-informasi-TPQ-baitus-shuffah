'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Users,
  BarChart3,
  PieChart,
  LineChart,
  Table,
  Eye,
  Settings,
  Mail,
  Printer,
  Share,
  Plus,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  Target,
  Award,
  TrendingUp,
  Activity,
  BookOpen,
  Heart
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ReportSection {
  id: string;
  title: string;
  type: 'OVERVIEW' | 'CHART' | 'TABLE' | 'ANALYSIS' | 'RECOMMENDATIONS';
  chartType?: 'BAR' | 'LINE' | 'PIE' | 'AREA' | 'SCATTER';
  isEnabled: boolean;
  order: number;
  data?: any;
}

interface ComprehensiveReport {
  id: string;
  title: string;
  description: string;
  period: {
    startDate: string;
    endDate: string;
    type: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM';
  };
  filters: {
    halaqah?: string[];
    category?: string[];
    grade?: string[];
    musyrif?: string[];
  };
  sections: ReportSection[];
  generatedAt?: string;
  status: 'DRAFT' | 'GENERATING' | 'COMPLETED' | 'ERROR';
  downloadUrl?: string;
}

export default function ComprehensiveReports() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<ComprehensiveReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [showReportBuilder, setShowReportBuilder] = useState(false);

  // Mock comprehensive reports
  const mockReports: ComprehensiveReport[] = [
    {
      id: 'report_1',
      title: 'Laporan Bulanan Februari 2024',
      description: 'Laporan komprehensif perkembangan karakter santri bulan Februari 2024',
      period: {
        startDate: '2024-02-01',
        endDate: '2024-02-29',
        type: 'MONTHLY'
      },
      filters: {
        halaqah: ['all'],
        category: ['AKHLAQ', 'IBADAH', 'ACADEMIC', 'SOCIAL', 'DISCIPLINE'],
        grade: ['all']
      },
      sections: [
        {
          id: 'section_1',
          title: 'Executive Summary',
          type: 'OVERVIEW',
          isEnabled: true,
          order: 1,
          data: {
            totalStudents: 125,
            averageScore: 82.5,
            improvement: 8.3,
            keyHighlights: [
              'Peningkatan 15% dalam kategori Akhlaq',
              'Program mentoring berhasil meningkatkan 20 santri',
              'Zero bullying incidents sepanjang bulan',
              'Parent engagement meningkat 25%'
            ]
          }
        },
        {
          id: 'section_2',
          title: 'Distribusi Grade Karakter',
          type: 'CHART',
          chartType: 'PIE',
          isEnabled: true,
          order: 2,
          data: {
            grades: [
              { grade: 'A+', count: 15, percentage: 12 },
              { grade: 'A', count: 28, percentage: 22.4 },
              { grade: 'A-', count: 32, percentage: 25.6 },
              { grade: 'B+', count: 25, percentage: 20 },
              { grade: 'B', count: 18, percentage: 14.4 },
              { grade: 'B-', count: 7, percentage: 5.6 }
            ]
          }
        },
        {
          id: 'section_3',
          title: 'Trend Perkembangan per Kategori',
          type: 'CHART',
          chartType: 'LINE',
          isEnabled: true,
          order: 3,
          data: {
            categories: ['AKHLAQ', 'IBADAH', 'ACADEMIC', 'SOCIAL', 'DISCIPLINE'],
            trends: [
              { month: 'Dec', AKHLAQ: 78, IBADAH: 82, ACADEMIC: 75, SOCIAL: 80, DISCIPLINE: 73 },
              { month: 'Jan', AKHLAQ: 81, IBADAH: 84, ACADEMIC: 77, SOCIAL: 82, DISCIPLINE: 75 },
              { month: 'Feb', AKHLAQ: 85, IBADAH: 86, ACADEMIC: 79, SOCIAL: 84, DISCIPLINE: 76 }
            ]
          }
        },
        {
          id: 'section_4',
          title: 'Top Performers',
          type: 'TABLE',
          isEnabled: true,
          order: 4,
          data: {
            students: [
              { name: 'Ahmad Fauzi', grade: 'A+', score: 95, improvement: '+5', category: 'Leadership' },
              { name: 'Siti Aisyah', grade: 'A+', score: 94, improvement: '+3', category: 'Academic Excellence' },
              { name: 'Muhammad Rizki', grade: 'A', score: 92, improvement: '+12', category: 'Most Improved' },
              { name: 'Fatimah Zahra', grade: 'A', score: 91, improvement: '+8', category: 'Social Impact' },
              { name: 'Ali Hassan', grade: 'A', score: 90, improvement: '+6', category: 'Consistency' }
            ]
          }
        },
        {
          id: 'section_5',
          title: 'Analisis Mendalam',
          type: 'ANALYSIS',
          isEnabled: true,
          order: 5,
          data: {
            insights: [
              {
                title: 'Peningkatan Signifikan dalam Akhlaq',
                description: 'Terjadi peningkatan 15% dalam kategori akhlaq, terutama dalam aspek kejujuran dan empati',
                impact: 'HIGH',
                evidence: ['Survey peer evaluation', 'Observasi musyrif', 'Feedback orang tua']
              },
              {
                title: 'Efektivitas Program Mentoring',
                description: 'Program buddy system menunjukkan hasil positif dengan 85% peserta mengalami peningkatan',
                impact: 'HIGH',
                evidence: ['Pre-post assessment', 'Progress tracking', 'Mentor feedback']
              }
            ]
          }
        },
        {
          id: 'section_6',
          title: 'Rekomendasi Strategis',
          type: 'RECOMMENDATIONS',
          isEnabled: true,
          order: 6,
          data: {
            recommendations: [
              {
                priority: 'HIGH',
                title: 'Ekspansi Program Mentoring',
                description: 'Perluas program buddy system ke seluruh santri dengan fokus pada peer learning',
                timeline: '1 bulan',
                resources: 'Training untuk 10 mentor senior',
                expectedImpact: 'Peningkatan 20% dalam engagement'
              },
              {
                priority: 'MEDIUM',
                title: 'Program Remedial Akademik',
                description: 'Implementasi program bimbingan khusus untuk 12 santri yang memerlukan perhatian',
                timeline: '2 bulan',
                resources: 'Musyrif tambahan dan materi khusus',
                expectedImpact: 'Peningkatan 15% dalam kategori akademik'
              }
            ]
          }
        }
      ],
      generatedAt: '2024-03-01T10:30:00Z',
      status: 'COMPLETED',
      downloadUrl: '/reports/monthly-feb-2024.pdf'
    },
    {
      id: 'report_2',
      title: 'Analisis Komparatif Q1 2024',
      description: 'Perbandingan performa antar halaqah dan analisis trend triwulan pertama',
      period: {
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        type: 'QUARTERLY'
      },
      filters: {
        halaqah: ['halaqah_1', 'halaqah_2', 'halaqah_3'],
        category: ['all']
      },
      sections: [
        {
          id: 'section_7',
          title: 'Perbandingan Antar Halaqah',
          type: 'CHART',
          chartType: 'BAR',
          isEnabled: true,
          order: 1
        },
        {
          id: 'section_8',
          title: 'Analisis Trend Triwulan',
          type: 'CHART',
          chartType: 'AREA',
          isEnabled: true,
          order: 2
        }
      ],
      status: 'GENERATING'
    },
    {
      id: 'report_3',
      title: 'Laporan Individual - Ahmad Fauzi',
      description: 'Laporan detail perkembangan individual santri Ahmad Fauzi',
      period: {
        startDate: '2024-01-01',
        endDate: '2024-02-29',
        type: 'CUSTOM'
      },
      filters: {
        halaqah: ['halaqah_1']
      },
      sections: [
        {
          id: 'section_9',
          title: 'Profile & Overview',
          type: 'OVERVIEW',
          isEnabled: true,
          order: 1
        },
        {
          id: 'section_10',
          title: 'Progress Timeline',
          type: 'CHART',
          chartType: 'LINE',
          isEnabled: true,
          order: 2
        }
      ],
      status: 'DRAFT'
    }
  ];

  // Available report templates
  const reportTemplates = [
    {
      id: 'template_monthly',
      name: 'Monthly Comprehensive Report',
      description: 'Laporan bulanan lengkap dengan semua aspek perkembangan',
      sections: 6,
      estimatedTime: '5-10 menit'
    },
    {
      id: 'template_quarterly',
      name: 'Quarterly Analysis Report',
      description: 'Analisis triwulan dengan fokus pada trend dan perbandingan',
      sections: 4,
      estimatedTime: '3-7 menit'
    },
    {
      id: 'template_individual',
      name: 'Individual Student Report',
      description: 'Laporan detail perkembangan santri individual',
      sections: 5,
      estimatedTime: '2-5 menit'
    },
    {
      id: 'template_comparative',
      name: 'Comparative Analysis Report',
      description: 'Perbandingan performa antar halaqah atau periode',
      sections: 3,
      estimatedTime: '3-6 menit'
    }
  ];

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReports(mockReports);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Gagal memuat laporan');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (reportId: string) => {
    try {
      // Update status to generating
      setReports(prev => prev.map(report =>
        report.id === reportId ? { ...report, status: 'GENERATING' } : report
      ));

      toast.loading('Generating comprehensive report...');
      
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Update status to completed
      setReports(prev => prev.map(report =>
        report.id === reportId ? {
          ...report,
          status: 'COMPLETED',
          generatedAt: new Date().toISOString(),
          downloadUrl: `/reports/${reportId}.pdf`
        } : report
      ));

      toast.dismiss();
      toast.success('Laporan berhasil dibuat!');
    } catch (error) {
      setReports(prev => prev.map(report =>
        report.id === reportId ? { ...report, status: 'ERROR' } : report
      ));
      toast.dismiss();
      toast.error('Gagal membuat laporan');
    }
  };

  const downloadReport = (report: ComprehensiveReport) => {
    if (report.downloadUrl) {
      toast.success('Mengunduh laporan...');
      // Simulate download
      setTimeout(() => {
        toast.success('Laporan berhasil diunduh!');
      }, 1000);
    }
  };

  const duplicateReport = (report: ComprehensiveReport) => {
    const newReport: ComprehensiveReport = {
      ...report,
      id: `report_${Date.now()}`,
      title: `${report.title} (Copy)`,
      status: 'DRAFT',
      generatedAt: undefined,
      downloadUrl: undefined
    };
    setReports(prev => [...prev, newReport]);
    toast.success('Laporan berhasil diduplikasi!');
  };

  const deleteReport = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    toast.success('Laporan berhasil dihapus!');
  };

  const getStatusColor = (status: ComprehensiveReport['status']) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100';
      case 'GENERATING': return 'text-blue-600 bg-blue-100';
      case 'DRAFT': return 'text-gray-600 bg-gray-100';
      case 'ERROR': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: ComprehensiveReport['status']) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />;
      case 'GENERATING': return <Clock className="h-4 w-4 animate-spin" />;
      case 'DRAFT': return <Edit className="h-4 w-4" />;
      case 'ERROR': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getSectionIcon = (type: ReportSection['type']) => {
    switch (type) {
      case 'OVERVIEW': return <Eye className="h-4 w-4" />;
      case 'CHART': return <BarChart3 className="h-4 w-4" />;
      case 'TABLE': return <Table className="h-4 w-4" />;
      case 'ANALYSIS': return <TrendingUp className="h-4 w-4" />;
      case 'RECOMMENDATIONS': return <Target className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Comprehensive Reports</h1>
          <p className="text-gray-600">Buat dan kelola laporan komprehensif perkembangan karakter santri</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button onClick={() => setShowReportBuilder(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Buat Laporan
          </Button>
        </div>
      </div>

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTemplates.map((template) => (
              <div key={template.id} className="p-4 border border-gray-200 rounded-lg hover:border-teal-300 cursor-pointer transition-colors">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-5 w-5 text-teal-600" />
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{template.sections} sections</span>
                  <span>{template.estimatedTime}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(report.status)}`}>
                    {getStatusIcon(report.status)}
                    <span>{report.status}</span>
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Report Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Period:</p>
                  <p className="font-medium">{report.period.type}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(report.period.startDate).toLocaleDateString('id-ID')} - 
                    {new Date(report.period.endDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Sections:</p>
                  <p className="font-medium">{report.sections.filter(s => s.isEnabled).length} aktif</p>
                  {report.generatedAt && (
                    <p className="text-xs text-gray-500">
                      Generated: {new Date(report.generatedAt).toLocaleDateString('id-ID')}
                    </p>
                  )}
                </div>
              </div>

              {/* Sections Preview */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Sections:</p>
                <div className="grid grid-cols-2 gap-2">
                  {report.sections.filter(s => s.isEnabled).slice(0, 4).map((section) => (
                    <div key={section.id} className="flex items-center space-x-2 text-xs text-gray-600 p-2 bg-gray-50 rounded">
                      {getSectionIcon(section.type)}
                      <span className="truncate">{section.title}</span>
                    </div>
                  ))}
                </div>
                {report.sections.filter(s => s.isEnabled).length > 4 && (
                  <p className="text-xs text-gray-500 mt-1">
                    +{report.sections.filter(s => s.isEnabled).length - 4} sections lainnya
                  </p>
                )}
              </div>

              {/* Filters */}
              {Object.keys(report.filters).length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Filters:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(report.filters).map(([key, values]) => (
                      values && values.length > 0 && (
                        <span key={key} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {key}: {Array.isArray(values) ? values.join(', ') : values}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  {report.status === 'COMPLETED' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadReport(report)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  ) : report.status === 'DRAFT' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateReport(report.id)}
                    >
                      <Activity className="h-3 w-3 mr-1" />
                      Generate
                    </Button>
                  ) : report.status === 'GENERATING' ? (
                    <Button variant="outline" size="sm" disabled>
                      <Clock className="h-3 w-3 mr-1 animate-spin" />
                      Generating...
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateReport(report.id)}
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Retry
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => duplicateReport(report)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteReport(report.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-sm">Generate All</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Mail className="h-6 w-6 mb-2" />
              <span className="text-sm">Email Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm">Schedule Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Settings className="h-6 w-6 mb-2" />
              <span className="text-sm">Report Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
