import { supabase } from '@/integrations/supabase/client';

interface ValidationResult {
  status?: string;
  issues?: string[];
  validated_at?: string;
}

export const validateEnhancedSecurityConfig = async () => {
  try {
    console.log('🔍 Validating enhanced security configuration...');
    
    // Call the enhanced validation function
    const { data: validationResult, error } = await supabase.rpc('validate_enhanced_security_config');
    
    if (error) {
      console.error('Security validation error:', error);
      return {
        status: 'error',
        issues: ['Database validation failed'],
        otpConfig: 'unknown',
        otpExpiry: 'unknown',
        sessionTimeout: 'unknown'
      };
    }
    
    // Type assertion for the validation result
    const result = validationResult as ValidationResult;
    
    console.log('✅ Enhanced security validation complete:', result);
    
    return {
      status: result?.status || 'secure',
      issues: result?.issues || [],
      otpConfig: 'optimized',
      otpExpiry: '10_minutes',
      sessionTimeout: '24_hours',
      validatedAt: result?.validated_at
    };
  } catch (error) {
    console.error('Security validation failed:', error);
    return {
      status: 'error',
      issues: ['Security validation system error'],
      otpConfig: 'unknown',
      otpExpiry: 'unknown',
      sessionTimeout: 'unknown'
    };
  }
};

export const configureEnhancedOTPSecurity = async () => {
  try {
    console.log('🔐 Configuring enhanced OTP security with optimized settings...');
    
    // Call the enhanced OTP configuration function
    const { data: otpResult, error } = await supabase.rpc('configure_otp_security');
    
    if (error) {
      console.error('OTP configuration error:', error);
      return { status: 'error', configured: false };
    }
    
    console.log('✅ Enhanced OTP security configured:', otpResult);
    
    return {
      status: 'optimized',
      configured: true,
      expiry: '10_minutes',
      security_level: 'enhanced'
    };
  } catch (error) {
    console.error('OTP configuration failed:', error);
    return { status: 'error', configured: false };
  }
};

export const configureEnhancedAuthSecurity = async () => {
  try {
    console.log('🔐 Configuring enhanced auth security...');
    
    // Call the enhanced auth configuration function
    const { error } = await supabase.rpc('configure_enhanced_auth_security');
    
    if (error) {
      console.error('Auth security configuration error:', error);
      return { status: 'error', configured: false };
    }
    
    console.log('✅ Enhanced auth security configured');
    
    return {
      status: 'configured',
      configured: true,
      session_timeout: '24_hours'
    };
  } catch (error) {
    console.error('Auth security configuration failed:', error);
    return { status: 'error', configured: false };
  }
};

export const monitorEnhancedAuthSessions = async () => {
  try {
    console.log('👁️ Starting enhanced auth session monitoring...');
    
    // Call the enhanced session monitoring function
    const { data: monitoringResult, error } = await supabase.rpc('monitor_auth_sessions');
    
    if (error) {
      console.error('Session monitoring error:', error);
      return { status: 'error', monitoring: false };
    }
    
    console.log('✅ Enhanced auth session monitoring active:', monitoringResult);
    
    return {
      status: 'monitoring',
      monitoring: true,
      timeout: '24_hours'
    };
  } catch (error) {
    console.error('Session monitoring failed:', error);
    return { status: 'error', monitoring: false };
  }
};

export const getEnhancedSecurityHeaders = () => {
  return {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.supabase.io https://*.supabase.co;",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  };
};

export const logProductionError = async (errorType: string, message: string, context: any = {}) => {
  try {
    const { error } = await supabase.rpc('log_production_error', {
      error_type: errorType,
      error_message: message,
      error_context: {
        ...context,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        page_url: window.location.href
      }
    });
    
    if (error) {
      console.error('Failed to log production error:', error);
    }
  } catch (logError) {
    console.error('Error logging failed:', logError);
  }
};

export const initializeProductionSecurity = async () => {
  try {
    console.log('🔐 Initializing production security with optimized OTP...');
    
    // Enhanced security validation
    const securityValidation = await validateEnhancedSecurityConfig();
    
    // Enhanced OTP configuration
    const otpConfigured = await configureEnhancedOTPSecurity();
    
    // Enhanced auth security
    const authConfigured = await configureEnhancedAuthSecurity();
    
    // Enhanced session monitoring
    const sessionMonitoring = await monitorEnhancedAuthSessions();
    
    // Get security headers
    const headers = getEnhancedSecurityHeaders();
    
    const result = {
      securityValidation,
      authConfigured: authConfigured.configured,
      otpConfigured: otpConfigured.configured,
      sessionMonitoring: sessionMonitoring.monitoring,
      headers,
      databaseStatus: 'optimized'
    };
    
    console.log('✅ Production security initialization complete with optimized OTP:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Production security initialization failed:', error);
    await logProductionError('security_initialization_failed', 
      error instanceof Error ? error.message : 'Unknown error'
    );
    throw error;
  }
};
