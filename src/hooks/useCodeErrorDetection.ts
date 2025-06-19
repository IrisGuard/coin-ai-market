
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CodeError {
  type: 'typescript' | 'syntax' | 'import' | 'deprecated';
  severity: 'critical' | 'high' | 'medium' | 'low';
  line: number;
  message: string;
  file: string;
}

interface ErrorScanResult {
  errors: CodeError[];
  totalFiles: number;
  scanDuration: number;
  productionReadiness: number;
}

export const useCodeErrorDetection = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ErrorScanResult | null>(null);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);

  const scanForErrors = useCallback(async () => {
    setIsScanning(true);
    const startTime = Date.now();

    try {
      // Simulate scanning multiple files for errors
      const mockErrors: CodeError[] = [
        {
          type: 'typescript',
          severity: 'critical',
          line: 27,
          message: 'Unterminated regular expression literal',
          file: 'src/utils/testUtils.ts'
        }
      ];

      const scanDuration = Date.now() - startTime;
      const totalFiles = 45; // Mock file count
      const errorCount = mockErrors.length;
      const productionReadiness = Math.max(0, Math.round((1 - errorCount / 10) * 100));

      const result: ErrorScanResult = {
        errors: mockErrors,
        totalFiles,
        scanDuration,
        productionReadiness
      };

      setScanResults(result);
      setLastScanTime(new Date());

      // Log scan to database
      await supabase.from('admin_activity_logs').insert({
        admin_user_id: (await supabase.auth.getUser()).data.user?.id,
        action: 'code_error_scan',
        target_type: 'development_system',
        details: {
          errors_found: errorCount,
          files_scanned: totalFiles,
          scan_duration: scanDuration,
          production_readiness: productionReadiness
        }
      });

    } catch (error) {
      console.error('Error scanning code:', error);
    } finally {
      setIsScanning(false);
    }
  }, []);

  const exportErrors = useCallback((format: 'json' | 'clipboard') => {
    if (!scanResults) return;

    const exportData = {
      timestamp: lastScanTime?.toISOString(),
      productionReadiness: scanResults.productionReadiness,
      summary: {
        totalErrors: scanResults.errors.length,
        criticalErrors: scanResults.errors.filter(e => e.severity === 'critical').length,
        highErrors: scanResults.errors.filter(e => e.severity === 'high').length,
        mediumErrors: scanResults.errors.filter(e => e.severity === 'medium').length,
        lowErrors: scanResults.errors.filter(e => e.severity === 'low').length
      },
      errors: scanResults.errors
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `code-errors-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    }
  }, [scanResults, lastScanTime]);

  return {
    isScanning,
    scanResults,
    lastScanTime,
    scanForErrors,
    exportErrors
  };
};
