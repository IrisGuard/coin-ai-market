
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ProdErrorHandler } from './utils/prodErrorHandler';
import { initSentry } from './lib/sentry';
import { validateSecurityConfig, validateOTPSecurity, logSecurityEvent } from './utils/securityConfig';
import { SessionSecurity } from './lib/securityEnhancements';

// Initialize error monitoring
initSentry();
ProdErrorHandler.initializeGlobalErrorHandling();

// Initialize security configurations with enhanced validation
const initializeSecurity = async () => {
  try {
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

// Initialize security
initializeSecurity();

// === ENHANCED CONSOLE MONITORING SYSTEM ===
const ConsoleMonitor = {
  errors: [] as Array<{
    message: string;
    timestamp: string;
    stack?: string;
    url: string;
  }>,
  warnings: [] as Array<{
    message: string;
    timestamp: string;
    url: string;
  }>,
  
  init() {
    // Capture console errors and warnings
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args) => {
      this.errors.push({
        message: args.join(' '),
        timestamp: new Date().toISOString(),
        stack: new Error().stack,
        url: window.location.href
      });
      originalError.apply(console, args);
      this.sendToMonitoring('error', args);
    };
    
    console.warn = (...args) => {
      this.warnings.push({
        message: args.join(' '),
        timestamp: new Date().toISOString(),
        url: window.location.href
      });
      originalWarn.apply(console, args);
      this.sendToMonitoring('warning', args);
    };
  },
  
  sendToMonitoring(level: string, args: any[]) {
    // Send to monitoring in production only
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/console-monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          message: args.join(' '),
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      }).catch(() => {}); // Silent fail
    }
  },
  
  getErrors() { return this.errors; },
  getWarnings() { return this.warnings; },
  
  clearAll() {
    this.errors = [];
    this.warnings = [];
  }
};

// === BROWSER DEVTOOLS INTEGRATION ===
window.CoinAI = {
  // View all errors in console
  showErrors() {
    console.group('🔴 Application Errors');
    ConsoleMonitor.getErrors().forEach(error => {
      console.error(`[${error.timestamp}] ${error.message}`);
      if (error.stack) console.trace(error.stack);
    });
    console.groupEnd();
  },
  
  // View warnings
  showWarnings() {
    console.group('🟡 Application Warnings');
    ConsoleMonitor.getWarnings().forEach(warning => {
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
      errors: ConsoleMonitor.getErrors(),
      warnings: ConsoleMonitor.getWarnings()
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
    ConsoleMonitor.clearAll();
    console.clear();
    console.log('✅ All logs cleared');
  },
  
  // NEW: Test security validation
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

// Initialize console monitoring
ConsoleMonitor.init();

// === GLOBAL ERROR HANDLERS ===
const notifyCriticalError = async (error: Error) => {
  if (error.message.includes('database') || 
      error.message.includes('authentication') ||
      error.message.includes('payment')) {
    
    await fetch('/api/notify-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'critical_error',
        error: error.message,
        stack: error.stack,
        url: window.location.href,
        timestamp: new Date().toISOString()
      })
    }).catch(() => {});
  }
};

// Global error handlers
window.addEventListener('error', (event) => {
  if (event.error) {
    notifyCriticalError(event.error);
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason) {
    notifyCriticalError(event.reason);
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
