
import { initSentry } from './sentry';
import { ProdErrorHandler } from '../utils/prodErrorHandler';
import { validateSecurityConfig, validateOTPSecurity, logSecurityEvent } from '../utils/securityConfig';
import { SessionSecurity } from './securityEnhancements';

export const initializeSecurity = async () => {
  try {
    // Initialize error monitoring
    initSentry();
    ProdErrorHandler.initializeGlobalErrorHandling();

    // Validate basic security config
    const configIssues = validateSecurityConfig();
    if (configIssues.length > 0) {
      await logSecurityEvent('config_validation_failed', { issues: configIssues });
    }

    // Validate session security
    SessionSecurity.validateSession();

    // Validate OTP security settings with database integration
    const otpValid = await validateOTPSecurity();
    if (!otpValid) {
      console.warn('OTP security settings may need attention');
      await logSecurityEvent('otp_validation_failed', { timestamp: new Date().toISOString() });
    } else {
      await logSecurityEvent('security_validation_passed', { timestamp: new Date().toISOString() });
    }
  } catch (error) {
    console.error('Security initialization failed:', error);
    await logSecurityEvent('security_init_failed', { error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
