
// Global type declarations for window extensions
declare global {
  interface Window {
    CoinAI: {
      showMonitoringStatus(): void;
      testConsoleMonitoring(): void;
      exportMonitoringReport(): void;
      clearConsole(): void;
      testSecurity(): Promise<void>;
      help(): void;
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
