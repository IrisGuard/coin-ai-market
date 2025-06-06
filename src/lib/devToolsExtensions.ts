
import { ConsoleMonitor } from './consoleMonitoring';
import { validateOTPSecurity, validateSecurityConfig, logSecurityEvent } from '../utils/securityConfig';

export const setupDevToolsExtensions = () => {
  const consoleMonitor = ConsoleMonitor.getInstance();

  // Browser DevTools Integration
  window.CoinAI = {
    // View all errors in console
    showErrors() {
      console.group('🔴 Application Errors');
      consoleMonitor.getErrors().forEach(error => {
        console.error(`[${error.timestamp}] ${error.message}`);
        if (error.stack) console.trace(error.stack);
      });
      console.groupEnd();
    },
    
    // View warnings
    showWarnings() {
      console.group('🟡 Application Warnings');
      consoleMonitor.getWarnings().forEach(warning => {
        console.warn(`[${warning.timestamp}] ${warning.message}`);
      });
      console.groupEnd();
    },
    
    // Export error report
    exportErrorReport() {
      const report = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        errors: consoleMonitor.getErrors(),
        warnings: consoleMonitor.getWarnings()
      };
      
      const blob = new Blob([JSON.stringify(report, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `error-report-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
    
    // Clear all monitoring data
    clearLogs() {
      consoleMonitor.clearAll();
      console.clear();
      console.log('✅ All logs cleared');
    },
    
    // Test security validation
    async testSecurity() {
      console.group('🔒 Security Validation Test');
      try {
        const otpValid = await validateOTPSecurity();
        console.log('OTP Security Valid:', otpValid);
        
        const configIssues = validateSecurityConfig();
        console.log('Config Issues:', configIssues);
        
        await logSecurityEvent('manual_security_test', { timestamp: new Date().toISOString() });
        console.log('✅ Security test completed');
      } catch (error) {
        console.error('❌ Security test failed:', error);
      }
      console.groupEnd();
    }
  };
};
