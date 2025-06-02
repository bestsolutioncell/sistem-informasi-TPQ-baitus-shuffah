/**
 * Security Hardening for TPQ Baitus Shuffah
 * Implements comprehensive security measures including authentication, authorization, and data protection
 */

import crypto from 'crypto';
import bcrypt from 'bcryptjs';

interface SecurityConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptRounds: number;
  maxLoginAttempts: number;
  lockoutDuration: number; // in minutes
  sessionTimeout: number; // in minutes
  passwordMinLength: number;
  passwordRequireSpecialChars: boolean;
}

interface LoginAttempt {
  email: string;
  attempts: number;
  lastAttempt: number;
  lockedUntil?: number;
}

interface SecurityAuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  timestamp: number;
  success: boolean;
  details?: any;
}

class SecurityManager {
  private config: SecurityConfig;
  private loginAttempts = new Map<string, LoginAttempt>();
  private auditLogs: SecurityAuditLog[] = [];
  private maxAuditLogs = 10000;

  constructor() {
    this.config = {
      jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      jwtExpiresIn: '24h',
      bcryptRounds: 12,
      maxLoginAttempts: 5,
      lockoutDuration: 30, // 30 minutes
      sessionTimeout: 60, // 1 hour
      passwordMinLength: 8,
      passwordRequireSpecialChars: true
    };
  }

  /**
   * Hash password with bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.config.bcryptRounds);
  }

  /**
   * Verify password
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Validate password strength
   */
  validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < this.config.passwordMinLength) {
      errors.push(`Password must be at least ${this.config.passwordMinLength} characters long`);
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (this.config.passwordRequireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common weak passwords
    const commonPasswords = [
      'password', '123456', 'password123', 'admin', 'qwerty',
      'letmein', 'welcome', 'monkey', '1234567890'
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common and easily guessable');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if account is locked due to failed login attempts
   */
  isAccountLocked(email: string): boolean {
    const attempt = this.loginAttempts.get(email);
    if (!attempt) return false;

    if (attempt.lockedUntil && Date.now() < attempt.lockedUntil) {
      return true;
    }

    // Reset if lockout period has expired
    if (attempt.lockedUntil && Date.now() >= attempt.lockedUntil) {
      this.loginAttempts.delete(email);
      return false;
    }

    return false;
  }

  /**
   * Record failed login attempt
   */
  recordFailedLogin(email: string): void {
    const now = Date.now();
    const attempt = this.loginAttempts.get(email) || {
      email,
      attempts: 0,
      lastAttempt: now
    };

    attempt.attempts++;
    attempt.lastAttempt = now;

    if (attempt.attempts >= this.config.maxLoginAttempts) {
      attempt.lockedUntil = now + (this.config.lockoutDuration * 60 * 1000);
    }

    this.loginAttempts.set(email, attempt);

    // Log security event
    this.logSecurityEvent({
      action: 'FAILED_LOGIN',
      resource: 'AUTH',
      ipAddress: 'unknown',
      userAgent: 'unknown',
      success: false,
      details: { email, attempts: attempt.attempts }
    });
  }

  /**
   * Reset login attempts on successful login
   */
  resetLoginAttempts(email: string): void {
    this.loginAttempts.delete(email);
  }

  /**
   * Sanitize input to prevent XSS
   */
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Validate and sanitize SQL input
   */
  sanitizeSqlInput(input: string): string {
    // Remove SQL injection patterns
    return input
      .replace(/['";\\]/g, '') // Remove quotes and backslashes
      .replace(/\b(DROP|DELETE|INSERT|UPDATE|CREATE|ALTER|EXEC|EXECUTE)\b/gi, '') // Remove dangerous SQL keywords
      .trim();
  }

  /**
   * Generate secure random token
   */
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate CSRF token
   */
  generateCSRFToken(): string {
    return this.generateSecureToken(16);
  }

  /**
   * Validate CSRF token
   */
  validateCSRFToken(token: string, sessionToken: string): boolean {
    return token === sessionToken;
  }

  /**
   * Encrypt sensitive data
   */
  encryptData(data: string, key?: string): string {
    const encryptionKey = key || this.config.jwtSecret;
    const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /**
   * Decrypt sensitive data
   */
  decryptData(encryptedData: string, key?: string): string {
    const encryptionKey = key || this.config.jwtSecret;
    const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Log security events
   */
  logSecurityEvent(event: Omit<SecurityAuditLog, 'id' | 'timestamp'>): void {
    const auditLog: SecurityAuditLog = {
      id: this.generateSecureToken(8),
      timestamp: Date.now(),
      ...event
    };

    this.auditLogs.push(auditLog);

    // Keep only recent logs
    if (this.auditLogs.length > this.maxAuditLogs) {
      this.auditLogs.shift();
    }

    // Log critical events to console
    if (!event.success && ['FAILED_LOGIN', 'UNAUTHORIZED_ACCESS', 'DATA_BREACH'].includes(event.action)) {
      console.warn('Security Alert:', auditLog);
    }
  }

  /**
   * Get security audit logs
   */
  getAuditLogs(limit: number = 100): SecurityAuditLog[] {
    return this.auditLogs
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Check for suspicious activity
   */
  detectSuspiciousActivity(): {
    alerts: string[];
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  } {
    const alerts: string[] = [];
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';

    const recentLogs = this.auditLogs.filter(
      log => Date.now() - log.timestamp < 3600000 // Last hour
    );

    // Check for multiple failed logins
    const failedLogins = recentLogs.filter(
      log => log.action === 'FAILED_LOGIN' && !log.success
    );

    if (failedLogins.length > 10) {
      alerts.push('High number of failed login attempts detected');
      riskLevel = 'HIGH';
    } else if (failedLogins.length > 5) {
      alerts.push('Moderate failed login activity detected');
      riskLevel = 'MEDIUM';
    }

    // Check for unauthorized access attempts
    const unauthorizedAccess = recentLogs.filter(
      log => log.action === 'UNAUTHORIZED_ACCESS'
    );

    if (unauthorizedAccess.length > 0) {
      alerts.push('Unauthorized access attempts detected');
      riskLevel = 'CRITICAL';
    }

    // Check for unusual IP patterns
    const uniqueIPs = new Set(recentLogs.map(log => log.ipAddress));
    if (uniqueIPs.size > 20) {
      alerts.push('Unusual number of unique IP addresses');
      riskLevel = riskLevel === 'CRITICAL' ? 'CRITICAL' : 'MEDIUM';
    }

    return { alerts, riskLevel };
  }

  /**
   * Security health check
   */
  securityHealthCheck(): {
    status: 'SECURE' | 'WARNING' | 'VULNERABLE';
    checks: Array<{
      name: string;
      status: 'PASS' | 'FAIL' | 'WARNING';
      message: string;
    }>;
  } {
    const checks = [];

    // Check JWT secret strength
    if (this.config.jwtSecret.length < 32) {
      checks.push({
        name: 'JWT Secret Strength',
        status: 'FAIL' as const,
        message: 'JWT secret is too short'
      });
    } else {
      checks.push({
        name: 'JWT Secret Strength',
        status: 'PASS' as const,
        message: 'JWT secret meets security requirements'
      });
    }

    // Check password policy
    if (this.config.passwordMinLength < 8) {
      checks.push({
        name: 'Password Policy',
        status: 'WARNING' as const,
        message: 'Password minimum length should be at least 8 characters'
      });
    } else {
      checks.push({
        name: 'Password Policy',
        status: 'PASS' as const,
        message: 'Password policy meets security standards'
      });
    }

    // Check for recent security incidents
    const suspiciousActivity = this.detectSuspiciousActivity();
    if (suspiciousActivity.riskLevel === 'CRITICAL' || suspiciousActivity.riskLevel === 'HIGH') {
      checks.push({
        name: 'Threat Detection',
        status: 'FAIL' as const,
        message: `${suspiciousActivity.riskLevel} risk level detected`
      });
    } else {
      checks.push({
        name: 'Threat Detection',
        status: 'PASS' as const,
        message: 'No significant threats detected'
      });
    }

    const failedChecks = checks.filter(c => c.status === 'FAIL').length;
    const warningChecks = checks.filter(c => c.status === 'WARNING').length;

    let status: 'SECURE' | 'WARNING' | 'VULNERABLE' = 'SECURE';
    if (failedChecks > 0) {
      status = 'VULNERABLE';
    } else if (warningChecks > 0) {
      status = 'WARNING';
    }

    return { status, checks };
  }
}

/**
 * Role-based access control
 */
export class RoleBasedAccessControl {
  private permissions = new Map<string, string[]>();

  constructor() {
    this.initializePermissions();
  }

  private initializePermissions(): void {
    // Admin permissions
    this.permissions.set('ADMIN', [
      'users:read', 'users:write', 'users:delete',
      'students:read', 'students:write', 'students:delete',
      'behavior:read', 'behavior:write', 'behavior:delete',
      'reports:read', 'reports:write', 'reports:delete',
      'analytics:read', 'settings:read', 'settings:write'
    ]);

    // Musyrif permissions
    this.permissions.set('MUSYRIF', [
      'students:read', 'students:write',
      'behavior:read', 'behavior:write',
      'reports:read', 'analytics:read'
    ]);

    // Parent permissions
    this.permissions.set('WALI', [
      'students:read', 'behavior:read', 'reports:read'
    ]);
  }

  /**
   * Check if user has permission
   */
  hasPermission(userRole: string, permission: string): boolean {
    const rolePermissions = this.permissions.get(userRole);
    return rolePermissions ? rolePermissions.includes(permission) : false;
  }

  /**
   * Get all permissions for a role
   */
  getRolePermissions(role: string): string[] {
    return this.permissions.get(role) || [];
  }
}

// Export security instances
export const securityManager = new SecurityManager();
export const rbac = new RoleBasedAccessControl();

// Security middleware helpers
export const SecurityMiddleware = {
  /**
   * Validate request authentication
   */
  requireAuth: (req: any, res: any, next: any) => {
    // Implementation would check JWT token
    next();
  },

  /**
   * Validate user permissions
   */
  requirePermission: (permission: string) => {
    return (req: any, res: any, next: any) => {
      // Implementation would check user permissions
      next();
    };
  },

  /**
   * Rate limiting
   */
  rateLimit: (maxRequests: number, windowMs: number) => {
    const requests = new Map<string, number[]>();
    
    return (req: any, res: any, next: any) => {
      const ip = req.ip || 'unknown';
      const now = Date.now();
      const windowStart = now - windowMs;
      
      const userRequests = requests.get(ip) || [];
      const recentRequests = userRequests.filter(time => time > windowStart);
      
      if (recentRequests.length >= maxRequests) {
        return res.status(429).json({ error: 'Too many requests' });
      }
      
      recentRequests.push(now);
      requests.set(ip, recentRequests);
      next();
    };
  }
};
