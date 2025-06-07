
import { ConsoleMonitor } from './consoleMonitoring';
import { validateOTPSecurity, validateSecurityConfig, logSecurityEvent } from '../utils/securityConfig';

export const setupDevToolsExtensions = () => {
  const consoleMonitor = ConsoleMonitor.getInstance();

  // Browser DevTools Integration
  window.CoinAI = {
    // View console monitoring status
    showMonitoringStatus() {
      console.group('🔍 Console Monitoring Status');
      console.log('Console monitoring is active');
      console.log('All console logs are being captured and sent to monitoring in production');
      console.groupEnd();
    },
    
    // Test console monitoring
    testConsoleMonitoring() {
      console.group('🧪 Testing Console Monitoring');
      console.log('This is a test log message');
      console.warn('This is a test warning message');
      console.error('This is a test error message');
      console.info('This is a test info message');
      console.log('✅ Console monitoring test completed - check production logs');
      console.groupEnd();
    },
    
    // Export monitoring report (placeholder for future implementation)
    exportMonitoringReport() {
      const report = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        monitoringActive: true,
        note: 'Console logs are sent to /api/console-monitor in production'
      };
      
      const blob = new Blob([JSON.stringify(report, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `monitoring-report-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
    
    // Clear console
    clearConsole() {
      console.clear();
      console.log('✅ Console cleared');
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
    },

    // Show available commands
    help() {
      console.group('🚀 CoinAI DevTools Commands');
      console.log('showMonitoringStatus() - Check console monitoring status');
      console.log('testConsoleMonitoring() - Test console monitoring functionality');
      console.log('exportMonitoringReport() - Export monitoring configuration');
      console.log('clearConsole() - Clear console logs');
      console.log('testSecurity() - Run security validation tests');
      console.log('help() - Show this help message');
      console.groupEnd();
    }
  };

  // Show welcome message
  console.log('🔧 CoinAI DevTools loaded - type CoinAI.help() for available commands');
};
