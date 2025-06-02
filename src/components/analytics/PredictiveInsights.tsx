'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Brain,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  Star,
  Award,
  Users,
  Calendar,
  BarChart3,
  LineChart,
  Activity,
  Lightbulb,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus,
  Clock,
  Filter
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PredictiveModel {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  lastTrained: string;
  predictions: number;
  type: 'BEHAVIOR_PREDICTION' | 'RISK_ASSESSMENT' | 'ACHIEVEMENT_FORECAST' | 'INTERVENTION_TIMING';
}

interface StudentPrediction {
  santriId: string;
  santriName: string;
  currentScore: number;
  predictedScore: number;
  confidence: number;
  timeframe: string;
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  factors: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  interventionSuggestions: {
    type: 'ACADEMIC' | 'BEHAVIORAL' | 'SOCIAL' | 'MOTIVATIONAL';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
    expectedImpact: number;
  }[];
}

interface PredictiveInsightsProps {
  selectedPeriod: string;
  selectedClass: string;
}

export default function PredictiveInsights({
  selectedPeriod,
  selectedClass
}: PredictiveInsightsProps) {
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState('behavior_prediction');
  const [viewType, setViewType] = useState('overview');

  // Mock predictive models
  const mockModels: PredictiveModel[] = [
    {
      id: 'behavior_prediction',
      name: 'Behavior Prediction Model',
      description: 'Prediksi perkembangan perilaku santri berdasarkan pola historis',
      accuracy: 87.5,
      lastTrained: '2024-02-10',
      predictions: 125,
      type: 'BEHAVIOR_PREDICTION'
    },
    {
      id: 'risk_assessment',
      name: 'Risk Assessment Model',
      description: 'Identifikasi santri yang berisiko mengalami penurunan performa',
      accuracy: 92.3,
      lastTrained: '2024-02-08',
      predictions: 15,
      type: 'RISK_ASSESSMENT'
    },
    {
      id: 'achievement_forecast',
      name: 'Achievement Forecast Model',
      description: 'Prediksi pencapaian dan potensi penghargaan santri',
      accuracy: 84.7,
      lastTrained: '2024-02-12',
      predictions: 45,
      type: 'ACHIEVEMENT_FORECAST'
    },
    {
      id: 'intervention_timing',
      name: 'Intervention Timing Model',
      description: 'Menentukan waktu optimal untuk intervensi dan bimbingan',
      accuracy: 89.1,
      lastTrained: '2024-02-09',
      predictions: 32,
      type: 'INTERVENTION_TIMING'
    }
  ];

  // Mock student predictions
  const mockPredictions: StudentPrediction[] = [
    {
      santriId: 'santri_1',
      santriName: 'Ahmad Fauzi',
      currentScore: 95,
      predictedScore: 97,
      confidence: 0.91,
      timeframe: '1 bulan',
      trend: 'IMPROVING',
      riskLevel: 'LOW',
      factors: {
        positive: [
          'Konsistensi tinggi dalam 3 bulan terakhir',
          'Trend positif yang stabil',
          'Dukungan keluarga yang optimal',
          'Motivasi intrinsik yang kuat',
          'Respon baik terhadap feedback'
        ],
        negative: [],
        neutral: ['Potensi plateau jika tidak ada tantangan baru']
      },
      recommendations: {
        immediate: [
          'Berikan tantangan akademik yang lebih tinggi',
          'Libatkan dalam program mentoring junior'
        ],
        shortTerm: [
          'Kembangkan potensi kepemimpinan',
          'Berikan tanggung jawab tambahan'
        ],
        longTerm: [
          'Persiapkan untuk kompetisi tingkat regional',
          'Program akselerasi pembelajaran'
        ]
      },
      interventionSuggestions: [
        {
          type: 'ACADEMIC',
          priority: 'MEDIUM',
          description: 'Program enrichment untuk mencegah kebosanan',
          expectedImpact: 15
        },
        {
          type: 'SOCIAL',
          priority: 'HIGH',
          description: 'Peran sebagai mentor untuk santri junior',
          expectedImpact: 25
        }
      ]
    },
    {
      santriId: 'santri_3',
      santriName: 'Muhammad Rizki',
      currentScore: 45,
      predictedScore: 62,
      confidence: 0.85,
      timeframe: '3 bulan',
      trend: 'IMPROVING',
      riskLevel: 'MEDIUM',
      factors: {
        positive: [
          'Respon positif terhadap intervensi terbaru',
          'Dukungan keluarga mulai meningkat',
          'Motivasi mulai tumbuh',
          'Hubungan dengan musyrif membaik'
        ],
        negative: [
          'Konsistensi masih rendah',
          'Pengaruh teman sebaya negatif',
          'Riwayat absensi yang buruk'
        ],
        neutral: ['Potensi akademik yang belum tereksplorasi']
      },
      recommendations: {
        immediate: [
          'Intensifkan program bimbingan individual',
          'Monitoring ketat selama 2 minggu'
        ],
        shortTerm: [
          'Program buddy system dengan santri berprestasi',
          'Koordinasi intensif dengan orang tua'
        ],
        longTerm: [
          'Program rehabilitasi perilaku komprehensif',
          'Evaluasi berkala setiap bulan'
        ]
      },
      interventionSuggestions: [
        {
          type: 'BEHAVIORAL',
          priority: 'HIGH',
          description: 'Program modifikasi perilaku intensif',
          expectedImpact: 35
        },
        {
          type: 'MOTIVATIONAL',
          priority: 'HIGH',
          description: 'Konseling motivasi dan goal setting',
          expectedImpact: 28
        },
        {
          type: 'SOCIAL',
          priority: 'MEDIUM',
          description: 'Integrasi dengan kelompok positif',
          expectedImpact: 20
        }
      ]
    },
    {
      santriId: 'santri_2',
      santriName: 'Siti Aisyah',
      currentScore: 88,
      predictedScore: 91,
      confidence: 0.89,
      timeframe: '2 bulan',
      trend: 'IMPROVING',
      riskLevel: 'LOW',
      factors: {
        positive: [
          'Peningkatan stabil dan konsisten',
          'Motivasi tinggi untuk berprestasi',
          'Respon sangat baik terhadap feedback',
          'Dukungan keluarga yang kuat',
          'Hubungan sosial yang positif'
        ],
        negative: [],
        neutral: [
          'Kecenderungan perfeksionis yang berlebihan',
          'Tekanan diri sendiri yang tinggi'
        ]
      },
      recommendations: {
        immediate: [
          'Berikan apresiasi atas konsistensi',
          'Monitoring stress level'
        ],
        shortTerm: [
          'Program manajemen stress',
          'Variasi metode pembelajaran'
        ],
        longTerm: [
          'Pengembangan leadership skills',
          'Persiapan untuk peran mentor'
        ]
      },
      interventionSuggestions: [
        {
          type: 'ACADEMIC',
          priority: 'LOW',
          description: 'Variasi metode untuk mencegah stagnasi',
          expectedImpact: 12
        },
        {
          type: 'SOCIAL',
          priority: 'MEDIUM',
          description: 'Program peer tutoring sebagai tutor',
          expectedImpact: 18
        }
      ]
    }
  ];

  useEffect(() => {
    loadPredictiveData();
  }, [selectedPeriod, selectedClass, selectedModel]);

  const loadPredictiveData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error loading predictive data:', error);
      toast.error('Gagal memuat data prediksi');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'IMPROVING': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'DECLINING': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'STABLE': return <Minus className="h-4 w-4 text-gray-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'IMPROVING': return 'text-green-600 bg-green-100';
      case 'DECLINING': return 'text-red-600 bg-red-100';
      case 'STABLE': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH': return 'text-red-600 bg-red-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getInterventionTypeIcon = (type: string) => {
    switch (type) {
      case 'ACADEMIC': return <BookOpen className="h-4 w-4" />;
      case 'BEHAVIORAL': return <Target className="h-4 w-4" />;
      case 'SOCIAL': return <Users className="h-4 w-4" />;
      case 'MOTIVATIONAL': return <Star className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
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
      {/* Model Selection */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Brain className="h-5 w-5 text-purple-600" />
            <label className="text-sm font-medium text-gray-700">Model Prediksi:</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {mockModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name} (Akurasi: {model.accuracy}%)
                </option>
              ))}
            </select>
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="overview">Overview</option>
              <option value="detailed">Detailed Analysis</option>
              <option value="interventions">Intervention Recommendations</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Model Information */}
      {mockModels.filter(m => m.id === selectedModel).map(model => (
        <Card key={model.id}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <span>{model.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Deskripsi</p>
                <p className="text-sm text-gray-900">{model.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Akurasi Model</p>
                <p className="text-lg font-bold text-green-600">{model.accuracy}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Terakhir Dilatih</p>
                <p className="text-sm text-gray-900">{model.lastTrained}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Prediksi</p>
                <p className="text-lg font-bold text-blue-600">{model.predictions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Student Predictions */}
      <div className="space-y-6">
        {mockPredictions.map((prediction) => (
          <Card key={prediction.santriId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{prediction.santriName}</CardTitle>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTrendColor(prediction.trend)}`}>
                    {getTrendIcon(prediction.trend)}
                    <span className="ml-1">{prediction.trend}</span>
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(prediction.riskLevel)}`}>
                    Risk: {prediction.riskLevel}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Prediction Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Skor Saat Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{prediction.currentScore}</p>
                </div>
                <div className="text-center">
                  <ArrowUp className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-600">Prediksi</p>
                  <p className="text-2xl font-bold text-blue-600">{prediction.predictedScore}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Confidence</p>
                  <p className="text-2xl font-bold text-green-600">{Math.round(prediction.confidence * 100)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Timeframe</p>
                  <p className="text-lg font-bold text-purple-600">{prediction.timeframe}</p>
                </div>
              </div>

              {/* Factors Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {prediction.factors.positive.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Faktor Positif
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      {prediction.factors.positive.map((factor, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {prediction.factors.negative.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                      Faktor Risiko
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      {prediction.factors.negative.map((factor, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {prediction.factors.neutral.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <Clock className="h-4 w-4 text-gray-600 mr-2" />
                      Faktor Netral
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      {prediction.factors.neutral.map((factor, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Tindakan Segera</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {prediction.recommendations.immediate.map((rec, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Jangka Pendek</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {prediction.recommendations.shortTerm.map((rec, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Jangka Panjang</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {prediction.recommendations.longTerm.map((rec, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Intervention Suggestions */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Saran Intervensi</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prediction.interventionSuggestions.map((intervention, idx) => (
                    <div key={idx} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getInterventionTypeIcon(intervention.type)}
                          <span className="text-sm font-medium text-gray-900">{intervention.type}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(intervention.priority)}`}>
                          {intervention.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{intervention.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Expected Impact:</span>
                        <span className="text-sm font-medium text-green-600">+{intervention.expectedImpact}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
