'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Mail,
  Calendar,
  Clock,
  Users,
  Settings,
  Play,
  Pause,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  AlertTriangle,
  Send,
  FileText,
  Download,
  Eye,
  Copy,
  Filter,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DistributionSchedule {
  id: string;
  name: string;
  description: string;
  reportType: 'EXECUTIVE' | 'COMPREHENSIVE' | 'METRICS' | 'CUSTOM';
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  time: string; // HH:MM format
  recipients: Recipient[];
  isActive: boolean;
  lastRun?: string;
  nextRun: string;
  status: 'ACTIVE' | 'PAUSED' | 'ERROR' | 'COMPLETED';
  createdAt: string;
  createdBy: string;
}

interface Recipient {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'BOARD_MEMBER' | 'PARENT' | 'MUSYRIF' | 'EXTERNAL';
  isActive: boolean;
}

interface DistributionLog {
  id: string;
  scheduleId: string;
  scheduleName: string;
  executedAt: string;
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  recipientCount: number;
  successCount: number;
  failedCount: number;
  errorMessage?: string;
  reportUrl?: string;
}

export default function AutomatedDistribution() {
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState<DistributionSchedule[]>([]);
  const [logs, setLogs] = useState<DistributionLog[]>([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState('schedules');

  // Mock distribution schedules
  const mockSchedules: DistributionSchedule[] = [
    {
      id: 'schedule_1',
      name: 'Monthly Executive Report',
      description: 'Laporan eksekutif bulanan untuk board dan kepala TPQ',
      reportType: 'EXECUTIVE',
      frequency: 'MONTHLY',
      dayOfMonth: 1,
      time: '08:00',
      recipients: [
        { id: 'rec_1', name: 'Dr. Ahmad Syafi\'i', email: 'ahmad.syafii@tpq.com', role: 'BOARD_MEMBER', isActive: true },
        { id: 'rec_2', name: 'Ustadz Abdullah', email: 'abdullah@tpq.com', role: 'ADMIN', isActive: true },
        { id: 'rec_3', name: 'Ustadzah Fatimah', email: 'fatimah@tpq.com', role: 'ADMIN', isActive: true }
      ],
      isActive: true,
      lastRun: '2024-02-01T08:00:00Z',
      nextRun: '2024-03-01T08:00:00Z',
      status: 'ACTIVE',
      createdAt: '2024-01-15T00:00:00Z',
      createdBy: 'Admin TPQ'
    },
    {
      id: 'schedule_2',
      name: 'Weekly Performance Metrics',
      description: 'Laporan metrics mingguan untuk tim musyrif',
      reportType: 'METRICS',
      frequency: 'WEEKLY',
      dayOfWeek: 1, // Monday
      time: '07:30',
      recipients: [
        { id: 'rec_4', name: 'Ustadz Ahmad', email: 'ahmad@tpq.com', role: 'MUSYRIF', isActive: true },
        { id: 'rec_5', name: 'Ustadz Muhammad', email: 'muhammad@tpq.com', role: 'MUSYRIF', isActive: true },
        { id: 'rec_6', name: 'Ustadzah Aisyah', email: 'aisyah@tpq.com', role: 'MUSYRIF', isActive: true }
      ],
      isActive: true,
      lastRun: '2024-02-26T07:30:00Z',
      nextRun: '2024-03-04T07:30:00Z',
      status: 'ACTIVE',
      createdAt: '2024-01-20T00:00:00Z',
      createdBy: 'Admin TPQ'
    },
    {
      id: 'schedule_3',
      name: 'Quarterly Parent Report',
      description: 'Laporan triwulan untuk semua orang tua santri',
      reportType: 'COMPREHENSIVE',
      frequency: 'QUARTERLY',
      dayOfMonth: 15,
      time: '09:00',
      recipients: [
        { id: 'rec_7', name: 'Parent Group', email: 'parents@tpq.com', role: 'PARENT', isActive: true }
      ],
      isActive: false,
      nextRun: '2024-04-15T09:00:00Z',
      status: 'PAUSED',
      createdAt: '2024-01-10T00:00:00Z',
      createdBy: 'Admin TPQ'
    }
  ];

  // Mock distribution logs
  const mockLogs: DistributionLog[] = [
    {
      id: 'log_1',
      scheduleId: 'schedule_1',
      scheduleName: 'Monthly Executive Report',
      executedAt: '2024-02-01T08:00:00Z',
      status: 'SUCCESS',
      recipientCount: 3,
      successCount: 3,
      failedCount: 0,
      reportUrl: '/reports/executive-feb-2024.pdf'
    },
    {
      id: 'log_2',
      scheduleId: 'schedule_2',
      scheduleName: 'Weekly Performance Metrics',
      executedAt: '2024-02-26T07:30:00Z',
      status: 'SUCCESS',
      recipientCount: 3,
      successCount: 3,
      failedCount: 0,
      reportUrl: '/reports/metrics-week-8-2024.pdf'
    },
    {
      id: 'log_3',
      scheduleId: 'schedule_2',
      scheduleName: 'Weekly Performance Metrics',
      executedAt: '2024-02-19T07:30:00Z',
      status: 'PARTIAL',
      recipientCount: 3,
      successCount: 2,
      failedCount: 1,
      errorMessage: 'Failed to send to ahmad@tpq.com - Invalid email address',
      reportUrl: '/reports/metrics-week-7-2024.pdf'
    },
    {
      id: 'log_4',
      scheduleId: 'schedule_1',
      scheduleName: 'Monthly Executive Report',
      executedAt: '2024-01-01T08:00:00Z',
      status: 'SUCCESS',
      recipientCount: 3,
      successCount: 3,
      failedCount: 0,
      reportUrl: '/reports/executive-jan-2024.pdf'
    }
  ];

  useEffect(() => {
    loadDistributionData();
  }, []);

  const loadDistributionData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSchedules(mockSchedules);
      setLogs(mockLogs);
    } catch (error) {
      console.error('Error loading distribution data:', error);
      toast.error('Gagal memuat data distribusi');
    } finally {
      setLoading(false);
    }
  };

  const toggleSchedule = (scheduleId: string) => {
    setSchedules(prev => prev.map(schedule =>
      schedule.id === scheduleId
        ? { 
            ...schedule, 
            isActive: !schedule.isActive,
            status: !schedule.isActive ? 'ACTIVE' : 'PAUSED'
          }
        : schedule
    ));
    toast.success('Status schedule berhasil diubah!');
  };

  const runScheduleNow = async (scheduleId: string) => {
    try {
      const schedule = schedules.find(s => s.id === scheduleId);
      if (!schedule) return;

      toast.loading('Menjalankan distribusi laporan...');
      
      // Simulate report generation and distribution
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Add new log entry
      const newLog: DistributionLog = {
        id: `log_${Date.now()}`,
        scheduleId: schedule.id,
        scheduleName: schedule.name,
        executedAt: new Date().toISOString(),
        status: 'SUCCESS',
        recipientCount: schedule.recipients.filter(r => r.isActive).length,
        successCount: schedule.recipients.filter(r => r.isActive).length,
        failedCount: 0,
        reportUrl: `/reports/${schedule.reportType.toLowerCase()}-${Date.now()}.pdf`
      };

      setLogs(prev => [newLog, ...prev]);
      
      // Update last run time
      setSchedules(prev => prev.map(s =>
        s.id === scheduleId
          ? { ...s, lastRun: new Date().toISOString() }
          : s
      ));

      toast.dismiss();
      toast.success('Laporan berhasil didistribusikan!');
    } catch (error) {
      toast.dismiss();
      toast.error('Gagal mendistribusikan laporan');
    }
  };

  const deleteSchedule = (scheduleId: string) => {
    setSchedules(prev => prev.filter(s => s.id !== scheduleId));
    toast.success('Schedule berhasil dihapus!');
  };

  const duplicateSchedule = (schedule: DistributionSchedule) => {
    const newSchedule: DistributionSchedule = {
      ...schedule,
      id: `schedule_${Date.now()}`,
      name: `${schedule.name} (Copy)`,
      isActive: false,
      status: 'PAUSED',
      createdAt: new Date().toISOString(),
      lastRun: undefined
    };
    setSchedules(prev => [...prev, newSchedule]);
    toast.success('Schedule berhasil diduplikasi!');
  };

  const getStatusColor = (status: DistributionSchedule['status']) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-100';
      case 'PAUSED': return 'text-gray-600 bg-gray-100';
      case 'ERROR': return 'text-red-600 bg-red-100';
      case 'COMPLETED': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLogStatusColor = (status: DistributionLog['status']) => {
    switch (status) {
      case 'SUCCESS': return 'text-green-600 bg-green-100';
      case 'FAILED': return 'text-red-600 bg-red-100';
      case 'PARTIAL': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getFrequencyText = (frequency: DistributionSchedule['frequency'], dayOfWeek?: number, dayOfMonth?: number) => {
    switch (frequency) {
      case 'DAILY': return 'Setiap hari';
      case 'WEEKLY': 
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return `Setiap ${days[dayOfWeek || 0]}`;
      case 'MONTHLY': return `Setiap tanggal ${dayOfMonth}`;
      case 'QUARTERLY': return `Setiap triwulan tanggal ${dayOfMonth}`;
      default: return frequency;
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
          <h2 className="text-2xl font-bold text-gray-900">Automated Distribution</h2>
          <p className="text-gray-600">Kelola distribusi laporan otomatis ke stakeholder</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowScheduleForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Buat Schedule
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'schedules', name: 'Schedules', icon: Calendar },
            { id: 'logs', name: 'Distribution Logs', icon: FileText },
            { id: 'recipients', name: 'Recipients', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.id
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {selectedTab === 'schedules' && (
          <div className="space-y-6">
            {schedules.map((schedule) => (
              <Card key={schedule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{schedule.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{schedule.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(schedule.status)}`}>
                        {schedule.status}
                      </span>
                      {schedule.isActive ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Pause className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Schedule Info */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Report Type:</p>
                      <p className="font-medium">{schedule.reportType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Frequency:</p>
                      <p className="font-medium">{getFrequencyText(schedule.frequency, schedule.dayOfWeek, schedule.dayOfMonth)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Time:</p>
                      <p className="font-medium">{schedule.time}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Recipients:</p>
                      <p className="font-medium">{schedule.recipients.filter(r => r.isActive).length} active</p>
                    </div>
                  </div>

                  {/* Next Run & Last Run */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Next Run:</p>
                      <p className="font-medium">{new Date(schedule.nextRun).toLocaleString('id-ID')}</p>
                    </div>
                    {schedule.lastRun && (
                      <div>
                        <p className="text-gray-600">Last Run:</p>
                        <p className="font-medium">{new Date(schedule.lastRun).toLocaleString('id-ID')}</p>
                      </div>
                    )}
                  </div>

                  {/* Recipients Preview */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Recipients:</p>
                    <div className="flex flex-wrap gap-2">
                      {schedule.recipients.filter(r => r.isActive).slice(0, 3).map((recipient) => (
                        <span key={recipient.id} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {recipient.name} ({recipient.role})
                        </span>
                      ))}
                      {schedule.recipients.filter(r => r.isActive).length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          +{schedule.recipients.filter(r => r.isActive).length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runScheduleNow(schedule.id)}
                        disabled={!schedule.isActive}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Run Now
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
                        onClick={() => toggleSchedule(schedule.id)}
                      >
                        {schedule.isActive ? (
                          <Pause className="h-3 w-3" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => duplicateSchedule(schedule)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSchedule(schedule.id)}
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
        )}

        {selectedTab === 'logs' && (
          <Card>
            <CardHeader>
              <CardTitle>Distribution History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{log.scheduleName}</h4>
                        <p className="text-sm text-gray-600">{new Date(log.executedAt).toLocaleString('id-ID')}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLogStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Total Recipients:</p>
                        <p className="font-medium">{log.recipientCount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Successful:</p>
                        <p className="font-medium text-green-600">{log.successCount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Failed:</p>
                        <p className="font-medium text-red-600">{log.failedCount}</p>
                      </div>
                    </div>

                    {log.errorMessage && (
                      <div className="p-2 bg-red-50 rounded text-sm text-red-700 mb-3">
                        <strong>Error:</strong> {log.errorMessage}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Success Rate: {Math.round((log.successCount / log.recipientCount) * 100)}%
                      </div>
                      {log.reportUrl && (
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Download Report
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
