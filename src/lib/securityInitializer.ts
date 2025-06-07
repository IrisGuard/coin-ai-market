
import { validateSecurityConfig, validateOTPSecurity } from '@/utils/securityConfig';
import { ConsoleMonitor } from '@/lib/consoleMonitoring';

export const initializeSecurity = async () => {
  // Validate security configuration
  const issues = validateSecurityConfig();
  
  if (issues.length > 0) {
    console.warn('Security configuration issues detected:', issues);
  }
  
  // Initialize console monitoring
  const monitor = ConsoleMonitor.getInstance();
  monitor.init();
  
  // Validate OTP security settings
  const otpValid = await validateOTPSecurity();
  if (!otpValid) {
    console.warn('OTP security validation failed');
  }
  
  // Log security initialization
  console.log('🔒 Security systems initialized');
  
  return {
    configurationIssues: issues,
    otpSecurityValid: otpValid,
    monitoringActive: true
  };
};
