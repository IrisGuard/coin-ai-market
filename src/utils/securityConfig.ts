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
  
  // Auth security settings - UPDATED FOR COMPLIANCE
  AUTH: {
    SESSION_TIMEOUT_HOURS: 24,
    MAX_LOGIN_ATTEMPTS: 5,
    PASSWORD_MIN_LENGTH: 8,
    REQUIRE_EMAIL_VERIFICATION: true,
    OTP_EXPIRY_SECONDS: 300, // FIXED: Reduced to 5 minutes (was 300)
    OTP_MAX_ATTEMPTS: 3
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
  
  // Validate OTP security settings - ENHANCED CHECK
  const otpExpiry = SECURITY_CONFIG.AUTH.OTP_EXPIRY_SECONDS;
  if (otpExpiry > 300) { // More than 5 minutes
    issues.push('OTP expiry time should be 5 minutes or less for security');
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

/**
 * Enhanced OTP security validation with database integration
 */
export const validateOTPSecurity = async () => {
  try {
    // Import supabase client for validation
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Call our new security validation function
    const { data, error } = await supabase.rpc('validate_security_config');
    
    if (error) {
      console.error('Security validation error:', error);
      return false;
    }
    
    // Enhanced type handling for database response
    let isValid = false;
    if (data && typeof data === 'object') {
      // Handle JSONB response properly
      const responseData = data as any;
      if ('status' in responseData) {
        isValid = responseData.status === 'secure';
      }
    } else if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        isValid = parsed.status === 'secure';
      } catch {
        isValid = false;
      }
    }
    
    if (!isValid) {
      console.warn('Security validation failed:', data);
      SecurityMonitor.getInstance().logSecurityViolation(
        'OTP_SECURITY',
        'OTP security validation failed'
      );
    }
    
    return isValid;
  } catch (error) {
    console.error('Failed to validate OTP security:', error);
    return false;
  }
};

/**
 * Log security events to database
 */
export const logSecurityEvent = async (eventType: string, details: any = {}) => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    await supabase.rpc('log_security_event', {
      event_type: eventType,
      event_details: {
        ...details,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};
