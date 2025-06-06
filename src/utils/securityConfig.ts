
/**
 * Security configuration and monitoring utilities
 * Centralizes security settings and provides monitoring capabilities
 */

export const SECURITY_CONFIG = {
  // Function security settings
  FUNCTIONS: {
    TIMEOUT_MS: 30000,
    MAX_RETRIES: 3,
    RATE_LIMIT_PER_MINUTE: 60
  },
  
  // Auth security settings
  AUTH: {
    SESSION_TIMEOUT_HOURS: 24,
    MAX_LOGIN_ATTEMPTS: 5,
    PASSWORD_MIN_LENGTH: 8,
    REQUIRE_EMAIL_VERIFICATION: true
  },
  
  // API security settings
  API: {
    MAX_REQUEST_SIZE_MB: 10,
    RATE_LIMIT_PER_HOUR: 1000,
    REQUIRE_HTTPS: true
  },
  
  // Encryption settings
  ENCRYPTION: {
    ALGORITHM: 'sha256',
    KEY_LENGTH: 32,
    SALT_ROUNDS: 12
  }
} as const;

/**
 * Security monitoring utilities
 */
export class SecurityMonitor {
  private static instance: SecurityMonitor;
  private violations: Array<{
    type: string;
    message: string;
    timestamp: string;
    userId?: string;
  }> = [];

  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }

  logSecurityViolation(type: string, message: string, userId?: string) {
    const violation = {
      type,
      message,
      timestamp: new Date().toISOString(),
      userId
    };
    
    this.violations.push(violation);
    console.warn(`Security violation [${type}]:`, message, { userId });
    
    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(violation);
    }
  }

  private async sendToMonitoring(violation: any) {
    try {
      await fetch('/api/security-monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(violation)
      });
    } catch (error) {
      console.error('Failed to send security violation to monitoring:', error);
    }
  }

  getViolations() {
    return [...this.violations];
  }

  clearViolations() {
    this.violations = [];
  }
}

/**
 * Validate security configuration on app startup
 */
export const validateSecurityConfig = () => {
  const issues: string[] = [];
  
  // Check for HTTPS in production
  if (process.env.NODE_ENV === 'production' && window.location.protocol !== 'https:') {
    issues.push('Application should use HTTPS in production');
  }
  
  // Check for proper CSP headers (would be done by the server)
  if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    issues.push('Content Security Policy not detected');
  }
  
  // Log any security configuration issues
  if (issues.length > 0) {
    console.warn('Security configuration issues detected:', issues);
    SecurityMonitor.getInstance().logSecurityViolation(
      'CONFIG',
      `Security configuration issues: ${issues.join(', ')}`
    );
  }
  
  return issues;
};
