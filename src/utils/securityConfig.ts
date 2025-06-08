
import { supabase } from '@/integrations/supabase/client';
import { 
  validateEnhancedSecurityConfig,
  getEnhancedSecurityHeaders,
  logProductionError 
} from './enhancedSecurityConfig';

export const validateSecurityConfig = async (): Promise<string[]> => {
  try {
    const validation = await validateEnhancedSecurityConfig();
    
    if (validation.status !== 'secure') {
      return validation.issues;
    }
    
    return [];
  } catch (error) {
    console.error('Security config validation failed:', error);
    return ['Security validation system error'];
  }
};

export const validateOTPSecurity = async (): Promise<boolean> => {
  try {
    const validation = await validateEnhancedSecurityConfig();
    return validation.otpConfig === 'enhanced';
  } catch (error) {
    console.error('OTP security validation failed:', error);
    await logProductionError('otp_validation_error', 
      error instanceof Error ? error.message : 'Unknown error'
    );
    return false;
  }
};

export const getSecurityHeaders = getEnhancedSecurityHeaders;

export const logSecurityEvent = async (eventType: string, details: any = {}) => {
  await logProductionError(`security_${eventType}`, 
    `Security event: ${eventType}`, details
  );
};

// Enhanced security monitor class for backwards compatibility
export class SecurityMonitor {
  private static instance: SecurityMonitor;
  
  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }
  
  async logSecurityViolation(type: string, message: string): Promise<void> {
    console.warn(`Security violation [${type}]: ${message}`);
    await logSecurityEvent('violation', { type, message });
  }
}
