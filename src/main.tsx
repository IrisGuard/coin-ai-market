
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ProdErrorHandler } from './utils/prodErrorHandler';
import { initSentry } from './lib/sentry';

// Initialize error monitoring
initSentry();
ProdErrorHandler.initializeGlobalErrorHandling();

// === ENHANCED CONSOLE MONITORING SYSTEM ===
const ConsoleMonitor = {
  errors: [],
  warnings: [],
  logs: [],
  
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
  
  sendToMonitoring(level, args) {
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
const notifyCriticalError = async (error) => {
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

// === DEVELOPMENT ERROR WIDGET ===
if (import.meta.env.DEV) {
  const createErrorWidget = () => {
    const widget = document.createElement('div');
    widget.id = 'error-widget';
    widget.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: green;
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 12px;
      z-index: 9999;
      cursor: pointer;
      font-family: monospace;
      border: 2px solid #333;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;
    widget.textContent = 'Errors: 0';
    widget.onclick = () => window.CoinAI.showErrors();
    widget.title = 'Click to view errors in console';
    document.body.appendChild(widget);
    
    // Update counter
    setInterval(() => {
      const errorCount = ConsoleMonitor.getErrors().length;
      const warningCount = ConsoleMonitor.getWarnings().length;
      widget.textContent = `E: ${errorCount} W: ${warningCount}`;
      
      if (errorCount > 0) {
        widget.style.background = 'red';
      } else if (warningCount > 0) {
        widget.style.background = 'orange';
      } else {
        widget.style.background = 'green';
      }
    }, 1000);
  };
  
  // Create widget after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createErrorWidget);
  } else {
    createErrorWidget();
  }
}

// Add global error handler for production monitoring
window.addEventListener('error', (event) => {
  const errorData = {
    error: event.error?.message,
    stack: event.error?.stack,
    url: window.location.href,
    userAgent: navigator.userAgent
  };
  
  notifyCriticalError(event.error);
  
  fetch('/api/console-monitor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      level: 'error',
      message: errorData.error,
      stack: errorData.stack,
      timestamp: new Date().toISOString(),
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
    userAgent: navigator.userAgent
  };
  
  notifyCriticalError(event.reason);
  
  fetch('/api/console-monitor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      level: 'error',
      message: errorData.error,
      stack: errorData.stack,
      timestamp: new Date().toISOString(),
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
