// Quran Data Structure for Hafalan Tracking
export interface Surah {
  id: number;
  name: string;
  nameArabic: string;
  nameEnglish: string;
  totalAyahs: number;
  revelation: 'Makkiyyah' | 'Madaniyyah';
  juz: number[];
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: 'SHORT' | 'MEDIUM' | 'LONG';
  recommendedAge: string;
  description: string;
}

export const QURAN_SURAHS: Surah[] = [
  {
    id: 1,
    name: 'Al-Fatihah',
    nameArabic: 'الفاتحة',
    nameEnglish: 'The Opening',
    totalAyahs: 7,
    revelation: 'Makkiyyah',
    juz: [1],
    difficulty: 'EASY',
    category: 'SHORT',
    recommendedAge: '5-7 tahun',
    description: 'Surah pembuka Al-Quran, wajib dikuasai untuk shalat'
  },
  {
    id: 2,
    name: 'Al-Baqarah',
    nameArabic: 'البقرة',
    nameEnglish: 'The Cow',
    totalAyahs: 286,
    revelation: 'Madaniyyah',
    juz: [1, 2, 3],
    difficulty: 'HARD',
    category: 'LONG',
    recommendedAge: '15+ tahun',
    description: 'Surah terpanjang dalam Al-Quran dengan banyak hukum'
  },
  {
    id: 3,
    name: 'Ali Imran',
    nameArabic: 'آل عمران',
    nameEnglish: 'The Family of Imran',
    totalAyahs: 200,
    revelation: 'Madaniyyah',
    juz: [3, 4],
    difficulty: 'HARD',
    category: 'LONG',
    recommendedAge: '14+ tahun',
    description: 'Surah tentang keluarga Imran dan kisah Maryam'
  },
  {
    id: 4,
    name: 'An-Nisa',
    nameArabic: 'النساء',
    nameEnglish: 'The Women',
    totalAyahs: 176,
    revelation: 'Madaniyyah',
    juz: [4, 5, 6],
    difficulty: 'HARD',
    category: 'LONG',
    recommendedAge: '16+ tahun',
    description: 'Surah tentang hukum-hukum yang berkaitan dengan wanita'
  },
  {
    id: 5,
    name: 'Al-Maidah',
    nameArabic: 'المائدة',
    nameEnglish: 'The Table Spread',
    totalAyahs: 120,
    revelation: 'Madaniyyah',
    juz: [6, 7],
    difficulty: 'MEDIUM',
    category: 'MEDIUM',
    recommendedAge: '13+ tahun',
    description: 'Surah tentang hidangan dan hukum halal-haram'
  },
  // Surah-surah pendek untuk pemula
  {
    id: 78,
    name: 'An-Naba',
    nameArabic: 'النبأ',
    nameEnglish: 'The Great News',
    totalAyahs: 40,
    revelation: 'Makkiyyah',
    juz: [30],
    difficulty: 'MEDIUM',
    category: 'SHORT',
    recommendedAge: '8-10 tahun',
    description: 'Surah tentang berita besar (hari kiamat)'
  },
  {
    id: 79,
    name: 'An-Naziat',
    nameArabic: 'النازعات',
    nameEnglish: 'Those Who Drag Forth',
    totalAyahs: 46,
    revelation: 'Makkiyyah',
    juz: [30],
    difficulty: 'MEDIUM',
    category: 'SHORT',
    recommendedAge: '8-10 tahun',
    description: 'Surah tentang malaikat pencabut nyawa'
  },
  {
    id: 80,
    name: 'Abasa',
    nameArabic: 'عبس',
    nameEnglish: 'He Frowned',
    totalAyahs: 42,
    revelation: 'Makkiyyah',
    juz: [30],
    difficulty: 'MEDIUM',
    category: 'SHORT',
    recommendedAge: '9-11 tahun',
    description: 'Surah tentang sikap Nabi terhadap orang buta'
  },
  // Juz Amma (Surah-surah pendek)
  {
    id: 109,
    name: 'Al-Kafirun',
    nameArabic: 'الكافرون',
    nameEnglish: 'The Disbelievers',
    totalAyahs: 6,
    revelation: 'Makkiyyah',
    juz: [30],
    difficulty: 'EASY',
    category: 'SHORT',
    recommendedAge: '6-8 tahun',
    description: 'Surah tentang penolakan terhadap kekafiran'
  },
  {
    id: 110,
    name: 'An-Nasr',
    nameArabic: 'النصر',
    nameEnglish: 'The Divine Support',
    totalAyahs: 3,
    revelation: 'Madaniyyah',
    juz: [30],
    difficulty: 'EASY',
    category: 'SHORT',
    recommendedAge: '5-7 tahun',
    description: 'Surah tentang pertolongan dan kemenangan Allah'
  },
  {
    id: 111,
    name: 'Al-Masad',
    nameArabic: 'المسد',
    nameEnglish: 'The Palm Fibre',
    totalAyahs: 5,
    revelation: 'Makkiyyah',
    juz: [30],
    difficulty: 'EASY',
    category: 'SHORT',
    recommendedAge: '6-8 tahun',
    description: 'Surah tentang Abu Lahab dan istrinya'
  },
  {
    id: 112,
    name: 'Al-Ikhlas',
    nameArabic: 'الإخلاص',
    nameEnglish: 'The Sincerity',
    totalAyahs: 4,
    revelation: 'Makkiyyah',
    juz: [30],
    difficulty: 'EASY',
    category: 'SHORT',
    recommendedAge: '5-7 tahun',
    description: 'Surah tentang keesaan Allah, setara dengan 1/3 Al-Quran'
  },
  {
    id: 113,
    name: 'Al-Falaq',
    nameArabic: 'الفلق',
    nameEnglish: 'The Daybreak',
    totalAyahs: 5,
    revelation: 'Makkiyyah',
    juz: [30],
    difficulty: 'EASY',
    category: 'SHORT',
    recommendedAge: '5-7 tahun',
    description: 'Surah perlindungan dari kejahatan makhluk'
  },
  {
    id: 114,
    name: 'An-Nas',
    nameArabic: 'الناس',
    nameEnglish: 'Mankind',
    totalAyahs: 6,
    revelation: 'Makkiyyah',
    juz: [30],
    difficulty: 'EASY',
    category: 'SHORT',
    recommendedAge: '5-7 tahun',
    description: 'Surah perlindungan dari bisikan setan'
  }
];

// Hafalan Types
export type HafalanType = 'SETORAN' | 'MURAJA' | 'TASMI' | 'EVALUASI';
export type HafalanStatus = 'PENDING' | 'APPROVED' | 'REVISION' | 'REJECTED';
export type HafalanGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'E';

export interface HafalanRecord {
  id: string;
  santriId: string;
  santriName: string;
  surahId: number;
  surahName: string;
  ayahStart: number;
  ayahEnd: number;
  type: HafalanType;
  status: HafalanStatus;
  grade?: HafalanGrade;
  score?: number; // 0-100
  notes?: string;
  musyrifId: string;
  musyrifName: string;
  recordedAt: string;
  evaluatedAt?: string;
  audioUrl?: string;
  videoUrl?: string;
  metadata?: {
    tajwid: number; // 0-100
    makhorijul_huruf: number; // 0-100
    kelancaran: number; // 0-100
    adab: number; // 0-100
  };
}

// Hafalan Progress
export interface HafalanProgress {
  santriId: string;
  surahId: number;
  totalAyahs: number;
  completedAyahs: number;
  percentage: number;
  lastUpdated: string;
  averageGrade?: HafalanGrade;
  averageScore?: number;
  totalSessions: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'MASTERED';
}

// Hafalan Target
export interface HafalanTarget {
  id: string;
  santriId: string;
  santriName: string;
  surahId: number;
  surahName: string;
  targetType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'CUSTOM';
  targetAyahs: number;
  completedAyahs: number;
  targetDate: string;
  startDate: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  status: 'ACTIVE' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED' | 'PAUSED';
  progress: number; // 0-100
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  description?: string;
  notes?: string;
  reminders: {
    enabled: boolean;
    frequency: 'DAILY' | 'WEEKLY' | 'BEFORE_DEADLINE';
    lastSent?: string;
  };
  milestones: {
    percentage: number;
    achievedAt?: string;
    reward?: string;
  }[];
}

// Target Template
export interface TargetTemplate {
  id: string;
  name: string;
  description: string;
  targetType: HafalanTarget['targetType'];
  surahIds: number[];
  duration: number; // in days
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  recommendedAge: string;
  estimatedHours: number;
  isActive: boolean;
}

// Target Achievement
export interface TargetAchievement {
  id: string;
  targetId: string;
  santriId: string;
  achievementType: 'MILESTONE' | 'COMPLETION' | 'EARLY_COMPLETION' | 'PERFECT_SCORE';
  achievedAt: string;
  description: string;
  reward?: string;
  certificateUrl?: string;
}

// Helper Functions
export const getSurahById = (id: number): Surah | undefined => {
  return QURAN_SURAHS.find(surah => surah.id === id);
};

export const getSurahsByDifficulty = (difficulty: Surah['difficulty']): Surah[] => {
  return QURAN_SURAHS.filter(surah => surah.difficulty === difficulty);
};

export const getSurahsByCategory = (category: Surah['category']): Surah[] => {
  return QURAN_SURAHS.filter(surah => surah.category === category);
};

export const getRecommendedSurahsForAge = (age: number): Surah[] => {
  if (age <= 7) {
    return QURAN_SURAHS.filter(surah => surah.difficulty === 'EASY');
  } else if (age <= 12) {
    return QURAN_SURAHS.filter(surah => surah.difficulty === 'EASY' || surah.difficulty === 'MEDIUM');
  } else {
    return QURAN_SURAHS;
  }
};

export const calculateHafalanProgress = (records: HafalanRecord[], surahId: number): HafalanProgress => {
  const surah = getSurahById(surahId);
  if (!surah) {
    throw new Error(`Surah with ID ${surahId} not found`);
  }

  const surahRecords = records.filter(record => 
    record.surahId === surahId && record.status === 'APPROVED'
  );

  const completedAyahs = surahRecords.reduce((total, record) => {
    return total + (record.ayahEnd - record.ayahStart + 1);
  }, 0);

  const percentage = Math.min((completedAyahs / surah.totalAyahs) * 100, 100);
  
  const averageScore = surahRecords.length > 0 
    ? surahRecords.reduce((sum, record) => sum + (record.score || 0), 0) / surahRecords.length
    : 0;

  let status: HafalanProgress['status'] = 'NOT_STARTED';
  if (percentage === 0) {
    status = 'NOT_STARTED';
  } else if (percentage < 100) {
    status = 'IN_PROGRESS';
  } else if (percentage === 100 && averageScore >= 90) {
    status = 'MASTERED';
  } else {
    status = 'COMPLETED';
  }

  return {
    santriId: surahRecords[0]?.santriId || '',
    surahId,
    totalAyahs: surah.totalAyahs,
    completedAyahs,
    percentage,
    lastUpdated: surahRecords[surahRecords.length - 1]?.recordedAt || new Date().toISOString(),
    averageScore,
    totalSessions: surahRecords.length,
    status
  };
};

export const getGradeColor = (grade: HafalanGrade): string => {
  switch (grade) {
    case 'A+': return 'text-green-600 bg-green-50';
    case 'A': return 'text-green-600 bg-green-50';
    case 'A-': return 'text-green-500 bg-green-50';
    case 'B+': return 'text-blue-600 bg-blue-50';
    case 'B': return 'text-blue-600 bg-blue-50';
    case 'B-': return 'text-blue-500 bg-blue-50';
    case 'C+': return 'text-yellow-600 bg-yellow-50';
    case 'C': return 'text-yellow-600 bg-yellow-50';
    case 'C-': return 'text-yellow-500 bg-yellow-50';
    case 'D': return 'text-orange-600 bg-orange-50';
    case 'E': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

export const getStatusColor = (status: HafalanStatus): string => {
  switch (status) {
    case 'APPROVED': return 'text-green-600 bg-green-50';
    case 'PENDING': return 'text-yellow-600 bg-yellow-50';
    case 'REVISION': return 'text-orange-600 bg-orange-50';
    case 'REJECTED': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

// Target Helper Functions
export const getTargetStatusColor = (status: HafalanTarget['status']): string => {
  switch (status) {
    case 'ACTIVE': return 'text-blue-600 bg-blue-50';
    case 'COMPLETED': return 'text-green-600 bg-green-50';
    case 'OVERDUE': return 'text-red-600 bg-red-50';
    case 'CANCELLED': return 'text-gray-600 bg-gray-50';
    case 'PAUSED': return 'text-yellow-600 bg-yellow-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

export const getTargetStatusText = (status: HafalanTarget['status']): string => {
  switch (status) {
    case 'ACTIVE': return 'Aktif';
    case 'COMPLETED': return 'Selesai';
    case 'OVERDUE': return 'Terlambat';
    case 'CANCELLED': return 'Dibatalkan';
    case 'PAUSED': return 'Dijeda';
    default: return status;
  }
};

export const getPriorityColor = (priority: HafalanTarget['priority']): string => {
  switch (priority) {
    case 'URGENT': return 'text-red-600 bg-red-50';
    case 'HIGH': return 'text-orange-600 bg-orange-50';
    case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
    case 'LOW': return 'text-green-600 bg-green-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

export const getPriorityText = (priority: HafalanTarget['priority']): string => {
  switch (priority) {
    case 'URGENT': return 'Mendesak';
    case 'HIGH': return 'Tinggi';
    case 'MEDIUM': return 'Sedang';
    case 'LOW': return 'Rendah';
    default: return priority;
  }
};

export const calculateTargetProgress = (target: HafalanTarget): number => {
  if (target.targetAyahs === 0) return 0;
  return Math.min((target.completedAyahs / target.targetAyahs) * 100, 100);
};

export const calculateDaysRemaining = (targetDate: string): number => {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const isTargetOverdue = (target: HafalanTarget): boolean => {
  const daysRemaining = calculateDaysRemaining(target.targetDate);
  return daysRemaining < 0 && target.status === 'ACTIVE';
};

export const getTargetTypeText = (type: HafalanTarget['targetType']): string => {
  switch (type) {
    case 'DAILY': return 'Harian';
    case 'WEEKLY': return 'Mingguan';
    case 'MONTHLY': return 'Bulanan';
    case 'YEARLY': return 'Tahunan';
    case 'CUSTOM': return 'Kustom';
    default: return type;
  }
};

// Target Templates
export const TARGET_TEMPLATES: TargetTemplate[] = [
  {
    id: 'template_juz_amma',
    name: 'Juz Amma (Surah Pendek)',
    description: 'Target hafalan surah-surah pendek dalam Juz 30 untuk pemula',
    targetType: 'MONTHLY',
    surahIds: [114, 113, 112, 111, 110, 109],
    duration: 30,
    difficulty: 'BEGINNER',
    recommendedAge: '5-8 tahun',
    estimatedHours: 20,
    isActive: true
  },
  {
    id: 'template_al_fatihah',
    name: 'Al-Fatihah',
    description: 'Target hafalan surah Al-Fatihah untuk pemula',
    targetType: 'WEEKLY',
    surahIds: [1],
    duration: 7,
    difficulty: 'BEGINNER',
    recommendedAge: '5-7 tahun',
    estimatedHours: 5,
    isActive: true
  },
  {
    id: 'template_al_baqarah',
    name: 'Al-Baqarah',
    description: 'Target hafalan surah Al-Baqarah untuk santri advanced',
    targetType: 'YEARLY',
    surahIds: [2],
    duration: 365,
    difficulty: 'ADVANCED',
    recommendedAge: '15+ tahun',
    estimatedHours: 200,
    isActive: true
  },
  {
    id: 'template_3_qul',
    name: '3 Qul (Al-Ikhlas, Al-Falaq, An-Nas)',
    description: 'Target hafalan 3 surah perlindungan',
    targetType: 'WEEKLY',
    surahIds: [112, 113, 114],
    duration: 14,
    difficulty: 'BEGINNER',
    recommendedAge: '5-8 tahun',
    estimatedHours: 8,
    isActive: true
  },
  {
    id: 'template_monthly_progress',
    name: 'Progress Bulanan',
    description: 'Target hafalan bulanan disesuaikan dengan kemampuan santri',
    targetType: 'MONTHLY',
    surahIds: [],
    duration: 30,
    difficulty: 'INTERMEDIATE',
    recommendedAge: '8-15 tahun',
    estimatedHours: 40,
    isActive: true
  }
];
