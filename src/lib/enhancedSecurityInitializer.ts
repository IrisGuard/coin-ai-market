
import { initializeProductionSecurity } from '@/utils/enhancedSecurityConfig';
import { EnhancedSecurityMonitor } from '@/utils/enhancedSupabaseSecurityHelpers';
import { ConsoleMonitor } from '@/lib/consoleMonitoring';

export const initializeEnhancedSecurity = async () => {
  try {
    console.log('🔐 Starting enhanced security initialization with OTP optimization...');
    
    // Initialize production security with OTP enhancement
    const securityResult = await initializeProductionSecurity();
    
    // Initialize enhanced security monitoring
    const securityMonitor = EnhancedSecurityMonitor.getInstance();
    
    // Initialize console monitoring
    const consoleMonitor = ConsoleMonitor.getInstance();
    consoleMonitor.init();
    
    // Log successful initialization with OTP details
    await securityMonitor.logSecurityInfo('initialization_otp_enhanced', 
      'Enhanced security systems with OTP optimization initialized successfully', {
      security_validation: securityResult.securityValidation.status,
      auth_configured: securityResult.authConfigured,
      otp_configured: securityResult.otpConfigured,
      session_monitoring: securityResult.sessionMonitoring,
      console_monitoring: true,
      otp_expiry: securityResult.securityValidation.otpExpiry,
      session_timeout: securityResult.securityValidation.sessionTimeout
    });
    
    console.log('✅ Enhanced security systems with OTP optimization fully initialized');
    
    return {
      securityValidation: securityResult.securityValidation,
      authConfigured: securityResult.authConfigured,
      otpConfigured: securityResult.otpConfigured,
      sessionMonitoring: securityResult.sessionMonitoring,
      monitoringActive: true,
      headers: securityResult.headers
    };
  } catch (error) {
    console.error('❌ Failed to initialize enhanced security:', error);
    
    // Try to log the error even if initialization failed
    try {
      const securityMonitor = EnhancedSecurityMonitor.getInstance();
      await securityMonitor.logSecurityViolation('initialization_failure', 
        error instanceof Error ? error.message : 'Unknown initialization error'
      );
    } catch (logError) {
      console.error('Failed to log security initialization error:', logError);
    }
    
    throw error;
  }
};

// Enhanced error boundary for security
export const enhancedSecurityErrorHandler = async (
  error: Error,
  errorInfo: any
) => {
  try {
    const securityMonitor = EnhancedSecurityMonitor.getInstance();
    
    await securityMonitor.logSecurityViolation('react_error_boundary', 
      error.message, {
      stack: error.stack,
      component_stack: errorInfo?.componentStack,
      error_boundary: true
    });
  } catch (logError) {
    console.error('Failed to log error boundary security event:', logError);
  }
};
