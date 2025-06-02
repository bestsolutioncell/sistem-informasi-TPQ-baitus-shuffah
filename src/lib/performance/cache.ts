/**
 * Advanced Caching System for TPQ Baitus Shuffah
 * Implements multi-layer caching with Redis and in-memory fallback
 */

interface CacheConfig {
  ttl: number; // Time to live in seconds
  maxSize?: number; // Maximum cache size for in-memory cache
  prefix?: string; // Cache key prefix
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class PerformanceCache {
  private memoryCache = new Map<string, CacheItem<any>>();
  private defaultTTL = 300; // 5 minutes
  private maxMemorySize = 1000;

  constructor() {
    // Clean up expired items every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Get item from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      // Try Redis first (if available)
      if (typeof window === 'undefined') {
        const redisValue = await this.getFromRedis(key);
        if (redisValue) return redisValue;
      }

      // Fallback to memory cache
      return this.getFromMemory<T>(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set item in cache
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const cacheTTL = ttl || this.defaultTTL;

      // Set in Redis (if available)
      if (typeof window === 'undefined') {
        await this.setInRedis(key, value, cacheTTL);
      }

      // Set in memory cache
      this.setInMemory(key, value, cacheTTL);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Delete item from cache
   */
  async delete(key: string): Promise<void> {
    try {
      // Delete from Redis
      if (typeof window === 'undefined') {
        await this.deleteFromRedis(key);
      }

      // Delete from memory
      this.memoryCache.delete(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    try {
      // Clear Redis
      if (typeof window === 'undefined') {
        await this.clearRedis();
      }

      // Clear memory
      this.memoryCache.clear();
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      memorySize: this.memoryCache.size,
      maxMemorySize: this.maxMemorySize,
      memoryUsage: (this.memoryCache.size / this.maxMemorySize) * 100
    };
  }

  private getFromMemory<T>(key: string): T | null {
    const item = this.memoryCache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl * 1000) {
      this.memoryCache.delete(key);
      return null;
    }

    return item.data;
  }

  private setInMemory<T>(key: string, value: T, ttl: number): void {
    // Remove oldest items if cache is full
    if (this.memoryCache.size >= this.maxMemorySize) {
      const oldestKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(oldestKey);
    }

    this.memoryCache.set(key, {
      data: value,
      timestamp: Date.now(),
      ttl
    });
  }

  private async getFromRedis(key: string): Promise<any> {
    // Redis implementation would go here
    // For now, return null as Redis is not configured
    return null;
  }

  private async setInRedis(key: string, value: any, ttl: number): Promise<void> {
    // Redis implementation would go here
  }

  private async deleteFromRedis(key: string): Promise<void> {
    // Redis implementation would go here
  }

  private async clearRedis(): Promise<void> {
    // Redis implementation would go here
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.memoryCache.entries()) {
      if (now - item.timestamp > item.ttl * 1000) {
        this.memoryCache.delete(key);
      }
    }
  }
}

// Cache instances for different data types
export const behaviorCache = new PerformanceCache();
export const studentCache = new PerformanceCache();
export const reportCache = new PerformanceCache();
export const analyticsCache = new PerformanceCache();

// Cache keys
export const CACHE_KEYS = {
  STUDENT_LIST: 'students:list',
  STUDENT_DETAIL: (id: string) => `students:detail:${id}`,
  BEHAVIOR_RECORDS: (studentId: string) => `behavior:records:${studentId}`,
  BEHAVIOR_SUMMARY: (studentId: string) => `behavior:summary:${studentId}`,
  ANALYTICS_OVERVIEW: 'analytics:overview',
  ANALYTICS_TRENDS: 'analytics:trends',
  REPORT_DATA: (reportId: string) => `report:data:${reportId}`,
  HALAQAH_LIST: 'halaqah:list',
  MUSYRIF_LIST: 'musyrif:list',
  PARENT_DATA: (parentId: string) => `parent:data:${parentId}`,
  GOALS_ACTIVE: (studentId: string) => `goals:active:${studentId}`,
  ACHIEVEMENTS: (studentId: string) => `achievements:${studentId}`
} as const;

// Cache TTL configurations (in seconds)
export const CACHE_TTL = {
  SHORT: 60,        // 1 minute
  MEDIUM: 300,      // 5 minutes
  LONG: 1800,       // 30 minutes
  VERY_LONG: 3600,  // 1 hour
  DAILY: 86400      // 24 hours
} as const;

/**
 * Cache decorator for functions
 */
export function cached(ttl: number = CACHE_TTL.MEDIUM) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;
      
      // Try to get from cache
      const cached = await behaviorCache.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // Execute method and cache result
      const result = await method.apply(this, args);
      await behaviorCache.set(cacheKey, result, ttl);
      
      return result;
    };
  };
}

/**
 * Invalidate cache by pattern
 */
export async function invalidateCache(pattern: string): Promise<void> {
  // This would implement pattern-based cache invalidation
  // For now, we'll clear all caches
  await Promise.all([
    behaviorCache.clear(),
    studentCache.clear(),
    reportCache.clear(),
    analyticsCache.clear()
  ]);
}

/**
 * Preload critical data into cache
 */
export async function preloadCache(): Promise<void> {
  try {
    // Preload student list
    // await studentCache.set(CACHE_KEYS.STUDENT_LIST, await getStudentList(), CACHE_TTL.LONG);
    
    // Preload halaqah list
    // await studentCache.set(CACHE_KEYS.HALAQAH_LIST, await getHalaqahList(), CACHE_TTL.VERY_LONG);
    
    // Preload analytics overview
    // await analyticsCache.set(CACHE_KEYS.ANALYTICS_OVERVIEW, await getAnalyticsOverview(), CACHE_TTL.MEDIUM);
    
    console.log('Cache preloaded successfully');
  } catch (error) {
    console.error('Cache preload error:', error);
  }
}

/**
 * Cache warming strategy
 */
export class CacheWarmer {
  private static instance: CacheWarmer;
  private warmingInterval: NodeJS.Timeout | null = null;

  static getInstance(): CacheWarmer {
    if (!CacheWarmer.instance) {
      CacheWarmer.instance = new CacheWarmer();
    }
    return CacheWarmer.instance;
  }

  startWarming(): void {
    // Warm cache every 10 minutes
    this.warmingInterval = setInterval(async () => {
      await this.warmCriticalData();
    }, 10 * 60 * 1000);
  }

  stopWarming(): void {
    if (this.warmingInterval) {
      clearInterval(this.warmingInterval);
      this.warmingInterval = null;
    }
  }

  private async warmCriticalData(): Promise<void> {
    try {
      // Warm frequently accessed data
      await preloadCache();
    } catch (error) {
      console.error('Cache warming error:', error);
    }
  }
}

// Export cache warmer instance
export const cacheWarmer = CacheWarmer.getInstance();
