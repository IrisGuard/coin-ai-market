
import { supabase } from '@/integrations/supabase/client';

export const validateEnhancedSecurityConfig = async (): Promise<{
  status: string;
  issues: string[];
  securityLevel: string;
  otpConfig: string;
  otpExpiry?: string;
  sessionTimeout?: string;
}> => {
  try {
    const { data, error } = await supabase.rpc('validate_enhanced_security_config');
    
    if (error) {
      console.error('Security validation error:', error);
      return {
        status: 'error',
        issues: ['Security validation failed'],
        securityLevel: 'unknown',
        otpConfig: 'unknown'
      };
    }

    // Safely parse the data with proper type checking
    const result = data as any;
    return {
      status: result?.status || 'unknown',
      issues: Array.isArray(result?.issues) ? result.issues : [],
      securityLevel: result?.security_level || 'unknown',
      otpConfig: result?.otp_config || 'unknown',
      otpExpiry: result?.otp_expiry || 'unknown',
      sessionTimeout: result?.session_timeout || 'unknown'
    };
  } catch (error) {
    console.error('Enhanced security config validation failed:', error);
    return {
      status: 'error',
      issues: ['Validation system error'],
      securityLevel: 'unknown',
      otpConfig: 'unknown'
    };
  }
};

export const configureEnhancedAuthSecurity = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('configure_enhanced_auth_security');
    
    if (error) {
      console.error('Auth security configuration error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Enhanced auth security configuration failed:', error);
    return false;
  }
};

export const configureOTPSecurity = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('configure_otp_security');
    
    if (error) {
      console.error('OTP security configuration error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('OTP security configuration failed:', error);
    return false;
  }
};

export const monitorAuthSessions = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('monitor_auth_sessions');
    
    if (error) {
      console.error('Auth session monitoring error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Auth session monitoring failed:', error);
    return false;
  }
};

export const logProductionError = async (
  errorType: string,
  errorMessage: string,
  context: Record<string, any> = {}
): Promise<void> => {
  try {
    await supabase.rpc('log_production_error', {
      error_type: errorType,
      error_message: errorMessage,
      error_context: {
        ...context,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.warn('Failed to log production error:', error);
  }
};

export const getEnhancedSecurityHeaders = () => {
  return {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.anthropic.com https://api.openai.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://wdgnllgbfvjgurbqhfqb.supabase.co https://api.anthropic.com https://api.openai.com wss://wdgnllgbfvjgurbqhfqb.supabase.co;",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Auth-Session-Timeout': '86400',
    'X-OTP-Expiry': '600'
  };
};

export const initializeProductionSecurity = async () => {
  console.log('🔒 Initializing enhanced production security with OTP optimization...');
  
  try {
    // Validate security configuration
    const validation = await validateEnhancedSecurityConfig();
    
    // Configure enhanced auth security
    const authConfigured = await configureEnhancedAuthSecurity();
    
    // Configure OTP security
    const otpConfigured = await configureOTPSecurity();
    
    // Monitor auth sessions
    const sessionMonitoring = await monitorAuthSessions();
    
    // Log security initialization
    await logProductionError('security_init', 'Production security with OTP enhancement initialized', {
      validation_status: validation.status,
      auth_configured: authConfigured,
      otp_configured: otpConfigured,
      session_monitoring: sessionMonitoring,
      security_level: validation.securityLevel,
      otp_expiry: validation.otpExpiry,
      session_timeout: validation.sessionTimeout
    });
    
    console.log('✅ Enhanced production security with OTP optimization initialized successfully');
    
    return {
      securityValidation: validation,
      authConfigured,
      otpConfigured,
      sessionMonitoring,
      headers: getEnhancedSecurityHeaders()
    };
  } catch (error) {
    console.error('❌ Failed to initialize production security:', error);
    throw error;
  }
};
