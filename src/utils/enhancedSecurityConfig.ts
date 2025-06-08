
import { supabase } from '@/integrations/supabase/client';

export const validateEnhancedSecurityConfig = async (): Promise<{
  status: string;
  issues: string[];
  securityLevel: string;
  otpConfig: string;
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

    return {
      status: data.status || 'unknown',
      issues: data.issues || [],
      securityLevel: data.security_level || 'unknown',
      otpConfig: data.otp_config || 'unknown'
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
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  };
};

export const initializeProductionSecurity = async () => {
  console.log('🔒 Initializing enhanced production security...');
  
  try {
    // Validate security configuration
    const validation = await validateEnhancedSecurityConfig();
    
    // Configure enhanced auth security
    const authConfigured = await configureEnhancedAuthSecurity();
    
    // Log security initialization
    await logProductionError('security_init', 'Production security initialized', {
      validation_status: validation.status,
      auth_configured: authConfigured,
      security_level: validation.securityLevel
    });
    
    console.log('✅ Enhanced production security initialized successfully');
    
    return {
      securityValidation: validation,
      authConfigured,
      headers: getEnhancedSecurityHeaders()
    };
  } catch (error) {
    console.error('❌ Failed to initialize production security:', error);
    throw error;
  }
};
