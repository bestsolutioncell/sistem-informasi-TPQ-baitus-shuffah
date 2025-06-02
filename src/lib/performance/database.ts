/**
 * Database Optimization for TPQ Baitus Shuffah
 * Implements connection pooling, query optimization, and performance monitoring
 */

interface QueryMetrics {
  query: string;
  executionTime: number;
  timestamp: number;
  params?: any[];
}

interface ConnectionPoolConfig {
  min: number;
  max: number;
  acquireTimeoutMillis: number;
  createTimeoutMillis: number;
  destroyTimeoutMillis: number;
  idleTimeoutMillis: number;
  reapIntervalMillis: number;
  createRetryIntervalMillis: number;
}

class DatabaseOptimizer {
  private queryMetrics: QueryMetrics[] = [];
  private slowQueryThreshold = 1000; // 1 second
  private maxMetricsSize = 1000;

  /**
   * Optimized connection pool configuration
   */
  getPoolConfig(): ConnectionPoolConfig {
    return {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      destroyTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100
    };
  }

  /**
   * Track query performance
   */
  trackQuery(query: string, executionTime: number, params?: any[]): void {
    const metric: QueryMetrics = {
      query,
      executionTime,
      timestamp: Date.now(),
      params
    };

    this.queryMetrics.push(metric);

    // Keep only recent metrics
    if (this.queryMetrics.length > this.maxMetricsSize) {
      this.queryMetrics.shift();
    }

    // Log slow queries
    if (executionTime > this.slowQueryThreshold) {
      console.warn('Slow query detected:', {
        query,
        executionTime,
        params
      });
    }
  }

  /**
   * Get query performance statistics
   */
  getQueryStats() {
    const now = Date.now();
    const recentMetrics = this.queryMetrics.filter(
      m => now - m.timestamp < 3600000 // Last hour
    );

    const totalQueries = recentMetrics.length;
    const slowQueries = recentMetrics.filter(
      m => m.executionTime > this.slowQueryThreshold
    ).length;

    const avgExecutionTime = totalQueries > 0
      ? recentMetrics.reduce((sum, m) => sum + m.executionTime, 0) / totalQueries
      : 0;

    return {
      totalQueries,
      slowQueries,
      slowQueryPercentage: totalQueries > 0 ? (slowQueries / totalQueries) * 100 : 0,
      avgExecutionTime,
      slowQueryThreshold: this.slowQueryThreshold
    };
  }

  /**
   * Get slow queries for analysis
   */
  getSlowQueries(limit = 10): QueryMetrics[] {
    return this.queryMetrics
      .filter(m => m.executionTime > this.slowQueryThreshold)
      .sort((a, b) => b.executionTime - a.executionTime)
      .slice(0, limit);
  }

  /**
   * Optimize query with best practices
   */
  optimizeQuery(query: string): string {
    let optimized = query;

    // Add LIMIT if not present in SELECT queries
    if (optimized.toLowerCase().includes('select') && 
        !optimized.toLowerCase().includes('limit') &&
        !optimized.toLowerCase().includes('count(')) {
      optimized += ' LIMIT 1000';
    }

    // Suggest indexes for WHERE clauses
    this.suggestIndexes(optimized);

    return optimized;
  }

  private suggestIndexes(query: string): void {
    const whereMatch = query.match(/WHERE\s+(\w+)/i);
    if (whereMatch) {
      const column = whereMatch[1];
      console.info(`Consider adding index on column: ${column}`);
    }
  }
}

/**
 * Database query builder with optimization
 */
export class OptimizedQueryBuilder {
  private query = '';
  private params: any[] = [];
  private optimizer = new DatabaseOptimizer();

  select(columns: string[] | string = '*'): this {
    const cols = Array.isArray(columns) ? columns.join(', ') : columns;
    this.query = `SELECT ${cols}`;
    return this;
  }

  from(table: string): this {
    this.query += ` FROM ${table}`;
    return this;
  }

  where(condition: string, value?: any): this {
    const whereClause = this.query.includes('WHERE') ? ' AND' : ' WHERE';
    this.query += `${whereClause} ${condition}`;
    if (value !== undefined) {
      this.params.push(value);
    }
    return this;
  }

  join(table: string, condition: string): this {
    this.query += ` JOIN ${table} ON ${condition}`;
    return this;
  }

  leftJoin(table: string, condition: string): this {
    this.query += ` LEFT JOIN ${table} ON ${condition}`;
    return this;
  }

  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.query += ` ORDER BY ${column} ${direction}`;
    return this;
  }

  limit(count: number): this {
    this.query += ` LIMIT ${count}`;
    return this;
  }

  offset(count: number): this {
    this.query += ` OFFSET ${count}`;
    return this;
  }

  build(): { query: string; params: any[] } {
    const optimizedQuery = this.optimizer.optimizeQuery(this.query);
    return {
      query: optimizedQuery,
      params: this.params
    };
  }
}

/**
 * Database indexes for optimal performance
 */
export const RECOMMENDED_INDEXES = {
  // Student indexes
  students: [
    'CREATE INDEX idx_students_nis ON students(nis)',
    'CREATE INDEX idx_students_halaqah_id ON students(halaqah_id)',
    'CREATE INDEX idx_students_status ON students(status)',
    'CREATE INDEX idx_students_created_at ON students(created_at)'
  ],

  // Behavior records indexes
  behavior_records: [
    'CREATE INDEX idx_behavior_student_id ON behavior_records(student_id)',
    'CREATE INDEX idx_behavior_category ON behavior_records(category)',
    'CREATE INDEX idx_behavior_date ON behavior_records(date)',
    'CREATE INDEX idx_behavior_musyrif_id ON behavior_records(musyrif_id)',
    'CREATE INDEX idx_behavior_student_date ON behavior_records(student_id, date)',
    'CREATE INDEX idx_behavior_category_date ON behavior_records(category, date)'
  ],

  // Goals indexes
  character_goals: [
    'CREATE INDEX idx_goals_student_id ON character_goals(student_id)',
    'CREATE INDEX idx_goals_status ON character_goals(status)',
    'CREATE INDEX idx_goals_target_date ON character_goals(target_date)',
    'CREATE INDEX idx_goals_category ON character_goals(category)'
  ],

  // Attendance indexes
  attendance: [
    'CREATE INDEX idx_attendance_student_id ON attendance(student_id)',
    'CREATE INDEX idx_attendance_date ON attendance(date)',
    'CREATE INDEX idx_attendance_status ON attendance(status)',
    'CREATE INDEX idx_attendance_student_date ON attendance(student_id, date)'
  ],

  // Users indexes
  users: [
    'CREATE INDEX idx_users_email ON users(email)',
    'CREATE INDEX idx_users_role ON users(role)',
    'CREATE INDEX idx_users_status ON users(status)'
  ]
};

/**
 * Query optimization patterns
 */
export const QUERY_PATTERNS = {
  // Efficient student behavior summary
  studentBehaviorSummary: `
    SELECT 
      s.id,
      s.name,
      s.nis,
      COUNT(br.id) as total_records,
      AVG(br.points) as avg_points,
      SUM(CASE WHEN br.points > 0 THEN 1 ELSE 0 END) as positive_count,
      SUM(CASE WHEN br.points < 0 THEN 1 ELSE 0 END) as negative_count
    FROM students s
    LEFT JOIN behavior_records br ON s.id = br.student_id
    WHERE s.status = 'ACTIVE'
      AND (br.date >= ? OR br.date IS NULL)
    GROUP BY s.id, s.name, s.nis
    ORDER BY avg_points DESC
  `,

  // Efficient halaqah performance
  halaqahPerformance: `
    SELECT 
      h.id,
      h.name,
      COUNT(DISTINCT s.id) as student_count,
      AVG(br.points) as avg_behavior_score,
      COUNT(br.id) as total_records
    FROM halaqah h
    LEFT JOIN students s ON h.id = s.halaqah_id AND s.status = 'ACTIVE'
    LEFT JOIN behavior_records br ON s.id = br.student_id AND br.date >= ?
    GROUP BY h.id, h.name
    ORDER BY avg_behavior_score DESC
  `,

  // Efficient monthly trends
  monthlyTrends: `
    SELECT 
      DATE_FORMAT(date, '%Y-%m') as month,
      category,
      AVG(points) as avg_points,
      COUNT(*) as record_count
    FROM behavior_records
    WHERE date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    GROUP BY month, category
    ORDER BY month, category
  `
};

/**
 * Database performance monitor
 */
export class DatabaseMonitor {
  private static instance: DatabaseMonitor;
  private optimizer = new DatabaseOptimizer();

  static getInstance(): DatabaseMonitor {
    if (!DatabaseMonitor.instance) {
      DatabaseMonitor.instance = new DatabaseMonitor();
    }
    return DatabaseMonitor.instance;
  }

  /**
   * Execute query with performance tracking
   */
  async executeQuery<T>(
    query: string, 
    params: any[] = []
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      // Here you would execute the actual database query
      // For now, we'll simulate the execution
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
      
      const executionTime = Date.now() - startTime;
      this.optimizer.trackQuery(query, executionTime, params);
      
      // Return mock result
      return {} as T;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.optimizer.trackQuery(query, executionTime, params);
      throw error;
    }
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats() {
    return this.optimizer.getQueryStats();
  }

  /**
   * Get slow queries for optimization
   */
  getSlowQueries(limit = 10) {
    return this.optimizer.getSlowQueries(limit);
  }

  /**
   * Health check for database performance
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    metrics: any;
    recommendations: string[];
  }> {
    const stats = this.getPerformanceStats();
    const slowQueries = this.getSlowQueries(5);
    
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    const recommendations: string[] = [];

    if (stats.slowQueryPercentage > 20) {
      status = 'critical';
      recommendations.push('High percentage of slow queries detected');
    } else if (stats.slowQueryPercentage > 10) {
      status = 'warning';
      recommendations.push('Moderate slow query activity');
    }

    if (stats.avgExecutionTime > 500) {
      status = status === 'critical' ? 'critical' : 'warning';
      recommendations.push('Average query execution time is high');
    }

    if (slowQueries.length > 0) {
      recommendations.push('Consider optimizing slow queries');
      recommendations.push('Review database indexes');
    }

    return {
      status,
      metrics: stats,
      recommendations
    };
  }
}

// Export singleton instance
export const dbMonitor = DatabaseMonitor.getInstance();
export const queryBuilder = () => new OptimizedQueryBuilder();
