import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ProdErrorHandler } from './utils/prodErrorHandler';
import { initSentry } from './lib/sentry';
import { validateSecurityConfig } from './utils/securityConfig';
import { SessionSecurity } from './lib/securityEnhancements';

// Initialize error monitoring
initSentry();
ProdErrorHandler.initializeGlobalErrorHandling();

// Initialize security configurations
validateSecurityConfig();
SessionSecurity.validateSession();

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
  logs: [] as Array<{
    message: string;
    timestamp: string;
    url: string;
  }>,
  
  init() {
    // Capture all console methods
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;
    
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
    
    console.log = (...args) => {
      this.logs.push({
        message: args.join(' '),
        timestamp: new Date().toISOString(),
        url: window.location.href
      });
      originalLog.apply(console, args);
    };
  },
  
  sendToMonitoring(level: string, args: any[]) {
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
  },
  
  getErrors() { return this.errors; },
  getWarnings() { return this.warnings; },
  getLogs() { return this.logs; },
  
  clearAll() {
    this.errors = [];
    this.warnings = [];
    this.logs = [];
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
  }
};

// Initialize console monitoring
ConsoleMonitor.init();

// === CRITICAL ERROR NOTIFICATION SYSTEM ===
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

// Development error widget removed - no visible debug elements

// Add global error handler for production monitoring
window.addEventListener('error', (event) => {
  const errorData = {
    error: event.error?.message,
    stack: event.error?.stack,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  };
  
  if (event.error) {
    notifyCriticalError(event.error);
  }
  
  fetch('/api/console-monitor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      level: 'error',
      message: errorData.error,
      stack: errorData.stack,
      timestamp: errorData.timestamp,
      url: errorData.url,
      userAgent: errorData.userAgent
    })
  }).catch(console.error);
});

window.addEventListener('unhandledrejection', (event) => {
  const errorData = {
    error: event.reason?.message || 'Unhandled Promise Rejection',
    stack: event.reason?.stack,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  };
  
  if (event.reason) {
    notifyCriticalError(event.reason);
  }
  
  fetch('/api/console-monitor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      level: 'error',
      message: errorData.error,
      stack: errorData.stack,
      timestamp: errorData.timestamp,
      url: errorData.url,
      userAgent: errorData.userAgent
    })
  }).catch(console.error);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
