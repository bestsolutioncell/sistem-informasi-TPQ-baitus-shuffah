'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  Target,
  Award,
  TrendingUp,
  Settings,
  Eye,
  Save,
  Share,
  Mail,
  Printer,
  Plus,
  Trash2,
  Edit,
  Copy,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'BEHAVIOR_SUMMARY' | 'PROGRESS_TRACKING' | 'COMPARATIVE_ANALYSIS' | 'PREDICTIVE_REPORT' | 'CUSTOM';
  sections: ReportSection[];
  filters: ReportFilter[];
  schedule?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
    recipients: string[];
    nextRun: string;
  };
  createdAt: string;
  lastGenerated?: string;
  isActive: boolean;
}

interface ReportSection {
  id: string;
  title: string;
  type: 'CHART' | 'TABLE' | 'SUMMARY' | 'INSIGHTS' | 'RECOMMENDATIONS';
  chartType?: 'BAR' | 'LINE' | 'PIE' | 'AREA';
  dataSource: string;
  filters: string[];
  isEnabled: boolean;
  order: number;
}

interface ReportFilter {
  id: string;
  field: string;
  operator: 'EQUALS' | 'CONTAINS' | 'GREATER_THAN' | 'LESS_THAN' | 'BETWEEN' | 'IN';
  value: any;
  label: string;
}

interface CustomReportsGeneratorProps {
  onReportGenerated?: (reportId: string) => void;
}

export default function CustomReportsGenerator({
  onReportGenerated
}: CustomReportsGeneratorProps) {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReportTemplate | null>(null);

  // Mock report templates
  const mockTemplates: ReportTemplate[] = [
    {
      id: 'template_1',
      name: 'Laporan Bulanan Komprehensif',
      description: 'Laporan lengkap perkembangan perilaku santri per bulan',
      type: 'BEHAVIOR_SUMMARY',
      sections: [
        {
          id: 'section_1',
          title: 'Ringkasan Eksekutif',
          type: 'SUMMARY',
          dataSource: 'behavior_summary',
          filters: ['period', 'halaqah'],
          isEnabled: true,
          order: 1
        },
        {
          id: 'section_2',
          title: 'Distribusi Grade Karakter',
          type: 'CHART',
          chartType: 'PIE',
          dataSource: 'grade_distribution',
          filters: ['period'],
          isEnabled: true,
          order: 2
        },
        {
          id: 'section_3',
          title: 'Trend Kategori Perilaku',
          type: 'CHART',
          chartType: 'LINE',
          dataSource: 'category_trends',
          filters: ['period', 'category'],
          isEnabled: true,
          order: 3
        },
        {
          id: 'section_4',
          title: 'Top Performers',
          type: 'TABLE',
          dataSource: 'top_students',
          filters: ['limit'],
          isEnabled: true,
          order: 4
        },
        {
          id: 'section_5',
          title: 'AI Insights & Rekomendasi',
          type: 'INSIGHTS',
          dataSource: 'ai_insights',
          filters: ['confidence_threshold'],
          isEnabled: true,
          order: 5
        }
      ],
      filters: [
        {
          id: 'filter_1',
          field: 'period',
          operator: 'EQUALS',
          value: 'MONTHLY',
          label: 'Periode'
        },
        {
          id: 'filter_2',
          field: 'halaqah',
          operator: 'IN',
          value: ['all'],
          label: 'Halaqah'
        }
      ],
      schedule: {
        frequency: 'MONTHLY',
        recipients: ['admin@tpq.com', 'kepala@tpq.com'],
        nextRun: '2024-03-01T00:00:00Z'
      },
      createdAt: '2024-01-15T00:00:00Z',
      lastGenerated: '2024-02-01T00:00:00Z',
      isActive: true
    },
    {
      id: 'template_2',
      name: 'Laporan Progress Individual',
      description: 'Laporan detail perkembangan santri per individu',
      type: 'PROGRESS_TRACKING',
      sections: [
        {
          id: 'section_6',
          title: 'Profile Santri',
          type: 'SUMMARY',
          dataSource: 'student_profile',
          filters: ['student_id'],
          isEnabled: true,
          order: 1
        },
        {
          id: 'section_7',
          title: 'Progress Chart',
          type: 'CHART',
          chartType: 'LINE',
          dataSource: 'student_progress',
          filters: ['student_id', 'period'],
          isEnabled: true,
          order: 2
        },
        {
          id: 'section_8',
          title: 'Goal Achievement',
          type: 'TABLE',
          dataSource: 'student_goals',
          filters: ['student_id', 'status'],
          isEnabled: true,
          order: 3
        },
        {
          id: 'section_9',
          title: 'Prediksi & Rekomendasi',
          type: 'RECOMMENDATIONS',
          dataSource: 'student_predictions',
          filters: ['student_id'],
          isEnabled: true,
          order: 4
        }
      ],
      filters: [
        {
          id: 'filter_3',
          field: 'student_id',
          operator: 'EQUALS',
          value: '',
          label: 'Santri'
        },
        {
          id: 'filter_4',
          field: 'period',
          operator: 'EQUALS',
          value: 'QUARTERLY',
          label: 'Periode'
        }
      ],
      createdAt: '2024-01-20T00:00:00Z',
      lastGenerated: '2024-02-10T00:00:00Z',
      isActive: true
    },
    {
      id: 'template_3',
      name: 'Analisis Komparatif Halaqah',
      description: 'Perbandingan performa antar halaqah',
      type: 'COMPARATIVE_ANALYSIS',
      sections: [
        {
          id: 'section_10',
          title: 'Perbandingan Skor Rata-rata',
          type: 'CHART',
          chartType: 'BAR',
          dataSource: 'halaqah_comparison',
          filters: ['period'],
          isEnabled: true,
          order: 1
        },
        {
          id: 'section_11',
          title: 'Distribusi Kategori per Halaqah',
          type: 'CHART',
          chartType: 'AREA',
          dataSource: 'category_by_halaqah',
          filters: ['period', 'category'],
          isEnabled: true,
          order: 2
        },
        {
          id: 'section_12',
          title: 'Ranking Halaqah',
          type: 'TABLE',
          dataSource: 'halaqah_ranking',
          filters: ['period', 'metric'],
          isEnabled: true,
          order: 3
        }
      ],
      filters: [
        {
          id: 'filter_5',
          field: 'period',
          operator: 'EQUALS',
          value: 'MONTHLY',
          label: 'Periode'
        }
      ],
      createdAt: '2024-01-25T00:00:00Z',
      isActive: true
    }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Gagal memuat template laporan');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (templateId: string) => {
    try {
      toast.loading('Generating report...');
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.dismiss();
      toast.success('Laporan berhasil dibuat!');
      
      // Update last generated timestamp
      setTemplates(prev => prev.map(template =>
        template.id === templateId
          ? { ...template, lastGenerated: new Date().toISOString() }
          : template
      ));

      if (onReportGenerated) {
        onReportGenerated(templateId);
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Gagal membuat laporan');
    }
  };

  const duplicateTemplate = (template: ReportTemplate) => {
    const newTemplate: ReportTemplate = {
      ...template,
      id: `template_${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      lastGenerated: undefined
    };
    setTemplates(prev => [...prev, newTemplate]);
    toast.success('Template berhasil diduplikasi!');
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast.success('Template berhasil dihapus!');
  };

  const toggleTemplateStatus = (templateId: string) => {
    setTemplates(prev => prev.map(template =>
      template.id === templateId
        ? { ...template, isActive: !template.isActive }
        : template
    ));
  };

  const getTypeColor = (type: ReportTemplate['type']) => {
    switch (type) {
      case 'BEHAVIOR_SUMMARY': return 'text-blue-600 bg-blue-100';
      case 'PROGRESS_TRACKING': return 'text-green-600 bg-green-100';
      case 'COMPARATIVE_ANALYSIS': return 'text-purple-600 bg-purple-100';
      case 'PREDICTIVE_REPORT': return 'text-orange-600 bg-orange-100';
      case 'CUSTOM': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeText = (type: ReportTemplate['type']) => {
    switch (type) {
      case 'BEHAVIOR_SUMMARY': return 'Ringkasan Perilaku';
      case 'PROGRESS_TRACKING': return 'Tracking Progress';
      case 'COMPARATIVE_ANALYSIS': return 'Analisis Komparatif';
      case 'PREDICTIVE_REPORT': return 'Laporan Prediktif';
      case 'CUSTOM': return 'Custom';
      default: return type;
    }
  };

  const getSectionIcon = (type: ReportSection['type']) => {
    switch (type) {
      case 'CHART': return <BarChart3 className="h-4 w-4" />;
      case 'TABLE': return <FileText className="h-4 w-4" />;
      case 'SUMMARY': return <Users className="h-4 w-4" />;
      case 'INSIGHTS': return <TrendingUp className="h-4 w-4" />;
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
          <h2 className="text-2xl font-bold text-gray-900">Custom Reports Generator</h2>
          <p className="text-gray-600">Buat dan kelola template laporan yang dapat disesuaikan</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={() => setShowTemplateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Buat Template
          </Button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className={`${!template.isActive ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(template.type)}`}>
                    {getTypeText(template.type)}
                  </span>
                  {template.isActive ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Template Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Sections:</p>
                  <p className="font-medium">{template.sections.filter(s => s.isEnabled).length} aktif</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Generated:</p>
                  <p className="font-medium">
                    {template.lastGenerated 
                      ? new Date(template.lastGenerated).toLocaleDateString('id-ID')
                      : 'Belum pernah'
                    }
                  </p>
                </div>
              </div>

              {/* Sections Preview */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Sections:</p>
                <div className="space-y-1">
                  {template.sections.filter(s => s.isEnabled).slice(0, 3).map((section) => (
                    <div key={section.id} className="flex items-center space-x-2 text-sm text-gray-600">
                      {getSectionIcon(section.type)}
                      <span>{section.title}</span>
                    </div>
                  ))}
                  {template.sections.filter(s => s.isEnabled).length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{template.sections.filter(s => s.isEnabled).length - 3} sections lainnya
                    </p>
                  )}
                </div>
              </div>

              {/* Schedule Info */}
              {template.schedule && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      Scheduled: {template.schedule.frequency}
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    Next run: {new Date(template.schedule.nextRun).toLocaleDateString('id-ID')}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateReport(template.id)}
                    disabled={!template.isActive}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Generate
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => duplicateTemplate(template)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTemplate(template)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTemplateStatus(template.id)}
                  >
                    {template.isActive ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border border-gray-400"></div>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteTemplate(template.id)}
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
              <span className="text-sm">Generate All Active</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Mail className="h-6 w-6 mb-2" />
              <span className="text-sm">Email Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm">Schedule Manager</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Settings className="h-6 w-6 mb-2" />
              <span className="text-sm">Global Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
