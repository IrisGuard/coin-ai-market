
// Global type declarations for window extensions
declare global {
  interface Window {
    CoinAI: {
      showErrors(): void;
      showWarnings(): void;
      exportErrorReport(): void;
      clearLogs(): void;
    };
    MonitoringUtils: {
      getPerformanceMetrics(): any;
      monitorNetworkRequests(): any;
      checkMemoryUsage(): any;
      exportDiagnosticReport(): any;
      setupAutomaticMonitoring(): void;
    };
    createFirstAdmin?: (email: string) => Promise<any>;
  }
}

export {};
