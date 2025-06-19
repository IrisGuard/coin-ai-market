
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Scan, Shield, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mockDataBlocker, validateNoMockData } from '@/utils/mockDataBlocker';

const MockDataMonitor = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);

  // Fetch system status
  const { data: systemStatus, refetch: refetchStatus } = useQuery({
    queryKey: ['system-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_status')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching system status:', error);
        return { is_production_ready: false, mock_data_violations: 0, scan_status: 'unknown' };
      }

      return data;
    }
  });

  // Fetch violations
  const { data: violations = [], refetch: refetchViolations } = useQuery({
    queryKey: ['mock-data-violations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mock_data_violations')
        .select('*')
        .eq('status', 'active')
        .order('detected_at', { ascending: false });

      if (error) {
        console.error('Error fetching violations:', error);
        return [];
      }

      return data || [];
    }
  });

  const performMockDataScan = async () => {
    setIsScanning(true);
    try {
      console.log('🔍 Starting comprehensive mock data scan...');
      
      // Real-time scan implementation
      const scanResults = await mockDataBlocker.scanEntireProject();
      setLastScanTime(new Date());
      
      // Validate current component data
      try {
        validateNoMockData({ component: 'MockDataMonitor', scanResults }, 'MockDataMonitor');
        console.log('✅ Component validation passed');
      } catch (error) {
        console.error('❌ Component validation failed:', error);
      }
      
      // Refresh data
      await refetchStatus();
      await refetchViolations();
      
      if (scanResults.length > 0) {
        console.error(`🚨 ${scanResults.length} mock data violations found!`);
      } else {
        console.log('✅ System is 100% clean - no mock data detected');
      }
      
    } catch (error) {
      console.error('❌ Mock data scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const getStatusColor = () => {
    if (!systemStatus) return 'text-yellow-600';
    return systemStatus.is_production_ready ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = () => {
    if (!systemStatus) return <AlertCircle className="h-12 w-12 text-yellow-600" />;
    return systemStatus.is_production_ready ? 
      <CheckCircle className="h-12 w-12 text-green-600" /> : 
      <AlertTriangle className="h-12 w-12 text-red-600" />;
  };

  const getStatusMessage = () => {
    if (!systemStatus) return 'SYSTEM STATUS UNKNOWN';
    return systemStatus.is_production_ready ? 
      'SYSTEM CLEAN - 100% PRODUCTION READY' : 
      `${systemStatus.mock_data_violations} VIOLATIONS DETECTED - PRODUCTION BLOCKED`;
  };

  const criticalViolations = violations.filter(v => v.severity === 'critical');
  const highViolations = violations.filter(v => v.severity === 'high');

  return (
    <div className="space-y-6">
      <Card className={`border-2 ${systemStatus?.is_production_ready ? 'border-green-200' : 'border-red-200'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            🚨 Mock Data Protection System
            <Badge variant={systemStatus?.is_production_ready ? 'default' : 'destructive'}>
              {systemStatus?.is_production_ready ? 'SECURE' : 'ALERT'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            {getStatusIcon()}
            <h3 className={`text-lg font-semibold mt-4 ${getStatusColor()}`}>
              {getStatusMessage()}
            </h3>
            <p className="text-gray-600 mt-2">
              {lastScanTime 
                ? `Last scan: ${lastScanTime.toLocaleString()}`
                : systemStatus?.last_scan
                ? `Last scan: ${new Date(systemStatus.last_scan).toLocaleString()}`
                : 'No scan performed yet'
              }
            </p>
          </div>

          {violations.length > 0 && (
            <Alert className="border-red-300 bg-red-50 mt-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="text-red-800 font-semibold">
                  🚨 CRITICAL: {violations.length} VIOLATIONS FOUND
                </div>
                <div className="text-red-600 mt-2">
                  System must be cleaned before production deployment
                </div>
                <div className="mt-3 space-y-2">
                  {violations.slice(0, 5).map((violation, index) => (
                    <div key={violation.id || index} className="text-sm bg-white p-2 rounded border">
                      <div className="flex items-center justify-between">
                        <strong>{violation.violation_type}</strong>
                        <Badge variant="destructive">{violation.severity}</Badge>
                      </div>
                      <div className="text-gray-600">
                        {violation.file_path}:{violation.line_number}
                      </div>
                      <code className="text-xs text-red-600">{violation.violation_content}</code>
                    </div>
                  ))}
                  {violations.length > 5 && (
                    <div className="text-sm text-red-600">
                      +{violations.length - 5} more violations...
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {systemStatus?.is_production_ready && (
            <Alert className="border-green-300 bg-green-50 mt-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="text-green-800 font-semibold">
                  ✅ PRODUCTION READY
                </div>
                <div className="text-green-600">
                  No mock data detected. System is safe for deployment.
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={performMockDataScan} 
            disabled={isScanning}
            className="w-full mt-6"
            variant={violations.length > 0 ? "destructive" : "default"}
          >
            {isScanning ? (
              <>
                <Scan className="w-4 h-4 mr-2 animate-spin" />
                Scanning for Mock Data...
              </>
            ) : (
              <>
                <Scan className="w-4 h-4 mr-2" />
                🔍 Scan for Mock Data
              </>
            )}
          </Button>

          {/* Production Status Summary */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getStatusColor()}`}>
                {violations.length}
              </div>
              <div className="text-xs text-gray-500">Total Violations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {criticalViolations.length}
              </div>
              <div className="text-xs text-gray-500">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {highViolations.length}
              </div>
              <div className="text-xs text-gray-500">High Priority</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${systemStatus?.is_production_ready ? 'text-green-600' : 'text-red-600'}`}>
                {systemStatus?.is_production_ready ? '✓' : '✗'}
              </div>
              <div className="text-xs text-gray-500">Production Ready</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Protection Features */}
      <Card>
        <CardHeader>
          <CardTitle>Protection Features Active</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Runtime Mock Data Blocker</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Math.random() Protection</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Demo Data Detection</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Real-time Validation</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MockDataMonitor;
