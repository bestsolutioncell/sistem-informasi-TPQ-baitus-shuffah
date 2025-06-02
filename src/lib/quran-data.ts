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
  surahId: number;
  targetAyahs: number;
  targetDate: string;
  createdBy: string;
  createdAt: string;
  status: 'ACTIVE' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';
  progress: number; // 0-100
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
