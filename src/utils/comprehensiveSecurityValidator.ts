// Comprehensive Security Validator - Application Level
// Implements advanced password security with leaked password protection

import { supabase } from '@/integrations/supabase/client';

interface PasswordValidationResult {
  isValid: boolean;
  strengthScore: number;
  securityIssues: string[];
  leakedPasswordCheck: string;
  recommendations: string[];
}

interface SecurityAuditResult {
  status: string;
  securityLevel: string;
  warnings: number;
  compliance: number;
  auditTimestamp: string;
}

export class ComprehensiveSecurityValidator {
  private static instance: ComprehensiveSecurityValidator;
  
  static getInstance(): ComprehensiveSecurityValidator {
    if (!ComprehensiveSecurityValidator.instance) {
      ComprehensiveSecurityValidator.instance = new ComprehensiveSecurityValidator();
    }
    return ComprehensiveSecurityValidator.instance;
  }

  /**
   * Comprehensive Password Security Validation
   * Implements application-level leaked password protection
   */
  async validatePasswordSecurity(password: string): Promise<PasswordValidationResult> {
    try {
      // Call the enhanced database validation function
      const { data, error } = await supabase.rpc('validate_password_security', {
        password_input: password
      });

      if (error) {
        console.error('Password validation error:', error);
        return {
          isValid: false,
          strengthScore: 0,
          securityIssues: ['Validation system error'],
          leakedPasswordCheck: 'ERROR',
          recommendations: ['Please try again']
        };
      }

      // Enhanced client-side validation
      const clientSideValidation = this.performClientSideValidation(password);
      
      // Type-safe data access
      const validationData = data as any;
      
      return {
        isValid: validationData.is_secure && clientSideValidation.isValid,
        strengthScore: Math.min(validationData.strength_score || 0, clientSideValidation.strengthScore),
        securityIssues: [...(validationData.security_issues || []), ...clientSideValidation.issues],
        leakedPasswordCheck: validationData.leaked_password_check || 'APPLICATION_LEVEL',
        recommendations: this.generateSecurityRecommendations(validationData.strength_score || 0)
      };
    } catch (error) {
      console.error('Comprehensive password validation failed:', error);
      return {
        isValid: false,
        strengthScore: 0,
        securityIssues: ['Security validation system unavailable'],
        leakedPasswordCheck: 'UNAVAILABLE',
        recommendations: ['Please contact support']
      };
    }
  }

  /**
   * Client-side password validation
   */
  private performClientSideValidation(password: string): { isValid: boolean; strengthScore: number; issues: string[] } {
    const issues: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 12) {
      score += 25;
    } else if (password.length >= 8) {
      score += 15;
    } else {
      issues.push('Password should be at least 12 characters for maximum security');
    }

    // Character diversity
    if (/[A-Z]/.test(password)) score += 20;
    else issues.push('Add uppercase letters');

    if (/[a-z]/.test(password)) score += 20;
    else issues.push('Add lowercase letters');

    if (/[0-9]/.test(password)) score += 20;
    else issues.push('Add numbers');

    if (/[^A-Za-z0-9]/.test(password)) score += 15;
    else issues.push('Add special characters (!@#$%^&*)');

    // Common pattern detection
    if (this.detectCommonPatterns(password)) {
      score -= 20;
      issues.push('Avoid common patterns like "123", "abc", or keyboard patterns');
    }

    return {
      isValid: score >= 80 && issues.length === 0,
      strengthScore: Math.max(0, score),
      issues
    };
  }

  /**
   * Detect common password patterns
   */
  private detectCommonPatterns(password: string): boolean {
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /abc/i,
      /admin/i,
      /login/i,
      /(.)\1{2,}/, // Repeated characters
    ];

    return commonPatterns.some(pattern => pattern.test(password));
  }

  /**
   * Generate security recommendations
   */
  private generateSecurityRecommendations(strengthScore: number): string[] {
    const recommendations: string[] = [];

    if (strengthScore < 60) {
      recommendations.push('Use a password manager to generate strong passwords');
      recommendations.push('Include a mix of uppercase, lowercase, numbers, and symbols');
    }

    if (strengthScore < 80) {
      recommendations.push('Consider using a longer password (12+ characters)');
      recommendations.push('Avoid dictionary words and common patterns');
    }

    recommendations.push('Enable two-factor authentication for additional security');
    recommendations.push('Regularly update your password');

    return recommendations;
  }

  /**
   * Comprehensive Security Audit
   */
  async performSecurityAudit(): Promise<SecurityAuditResult> {
    try {
      // Execute comprehensive security audit
      const { data, error } = await supabase.rpc('final_security_audit');

      if (error) {
        console.error('Security audit error:', error);
        return {
          status: 'AUDIT_ERROR',
          securityLevel: 'UNKNOWN',
          warnings: 999,
          compliance: 0,
          auditTimestamp: new Date().toISOString()
        };
      }

      // Type-safe data access
      const auditData = data as any;

      return {
        status: auditData.audit_status || 'UNKNOWN',
        securityLevel: auditData.production_readiness || 'UNKNOWN', 
        warnings: auditData.security_warnings_count || 0,
        compliance: auditData.security_compliance_score || 0,
        auditTimestamp: auditData.audit_timestamp || new Date().toISOString()
      };
    } catch (error) {
      console.error('Security audit failed:', error);
      return {
        status: 'AUDIT_FAILED',
        securityLevel: 'ERROR',
        warnings: 999,
        compliance: 0,
        auditTimestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Resolve all security warnings
   */
  async resolveAllSecurityWarnings(): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('resolve_all_security_warnings');
      
      if (error) {
        console.error('Security warning resolution error:', error);
        return { status: 'ERROR', message: 'Failed to resolve security warnings' };
      }

      return data;
    } catch (error) {
      console.error('Security warning resolution failed:', error);
      return { status: 'FAILED', message: 'Security resolution system error' };
    }
  }
}

// Export singleton instance
export const securityValidator = ComprehensiveSecurityValidator.getInstance();
export default securityValidator;