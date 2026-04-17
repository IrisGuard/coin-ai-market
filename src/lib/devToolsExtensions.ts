import { ConsoleMonitor } from './consoleMonitoring';
import { validateOTPSecurity, validateSecurityConfig, logSecurityEvent } from '../utils/securityConfig';

export const setupDevToolsExtensions = () => {
  // Pre-touch the singleton so monitoring is wired before window.NovaCoin is bound.
  ConsoleMonitor.getInstance();

  window.NovaCoin = {
    showMonitoringStatus() {
      console.group('🔍 NovaCoin · Console Monitoring');
      console.log('Console monitoring is active');
      console.log('All console logs are captured and forwarded in production');
      console.groupEnd();
    },
    testConsoleMonitoring() {
      console.group('🧪 NovaCoin · Console Monitoring Test');
      console.log('test log');
      console.warn('test warning');
      console.error('test error');
      console.info('test info');
      console.groupEnd();
    },
    exportMonitoringReport() {
      const report = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        monitoringActive: true,
      };
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `novacoin-monitoring-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
    clearConsole() { console.clear(); console.log('✅ Console cleared'); },
    async testSecurity() {
      try {
        const otpValid = await validateOTPSecurity();
        console.log('OTP Security Valid:', otpValid);
        const configIssues = validateSecurityConfig();
        console.log('Config Issues:', configIssues);
        await logSecurityEvent('manual_security_test', { timestamp: new Date().toISOString() });
        console.log('✅ Security test completed');
      } catch (e) {
        console.error('❌ Security test failed:', e);
      }
    },
    help() {
      console.group('🚀 NovaCoin DevTools');
      console.log('NovaCoin.showMonitoringStatus()');
      console.log('NovaCoin.testConsoleMonitoring()');
      console.log('NovaCoin.exportMonitoringReport()');
      console.log('NovaCoin.clearConsole()');
      console.log('NovaCoin.testSecurity()');
      console.groupEnd();
    },
  };

  console.log('🔧 NovaCoin DevTools loaded — type NovaCoin.help() for commands');
};
