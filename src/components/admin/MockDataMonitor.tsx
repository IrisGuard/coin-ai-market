
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Scan, Shield } from 'lucide-react';
import { mockDataBlocker, validateNoMockData } from '@/utils/mockDataBlocker';
import { Badge } from '@/components/ui/badge';

const MockDataMonitor = () => {
  const [violations, setViolations] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);
  const [systemStatus, setSystemStatus] = useState<'clean' | 'violations' | 'unknown'>('unknown');

  useEffect(() => {
    // Perform initial scan
    performMockDataScan();
  }, []);

  const performMockDataScan = async () => {
    setIsScanning(true);
    try {
      console.log('🔍 Starting comprehensive mock data scan...');
      
      // Real-time scan implementation
      const scanResults = await mockDataBlocker.scanEntireProject();
      setViolations(scanResults);
      setLastScanTime(new Date());
      
      if (scanResults.length > 0) {
        setSystemStatus('violations');
        console.error(`🚨 ${scanResults.length} mock data violations found!`);
      } else {
        setSystemStatus('clean');
        console.log('✅ System is 100% clean - no mock data detected');
      }
      
      // Validate current component data
      try {
        validateNoMockData({ component: 'MockDataMonitor', scanResults });
        console.log('✅ Component validation passed');
      } catch (error) {
        console.error('❌ Component validation failed:', error);
      }
      
    } catch (error) {
      console.error('❌ Mock data scan failed:', error);
      setSystemStatus('violations');
    } finally {
      setIsScanning(false);
    }
  };

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'clean': return 'text-green-600';
      case 'violations': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusIcon = () => {
    switch (systemStatus) {
      case 'clean': return <CheckCircle className="h-12 w-12 text-green-600" />;
      case 'violations': return <AlertTriangle className="h-12 w-12 text-red-600" />;
      default: return <Shield className="h-12 w-12 text-yellow-600" />;
    }
  };

  const getStatusMessage = () => {
    switch (systemStatus) {
      case 'clean': return 'SYSTEM CLEAN - 100% PRODUCTION READY';
      case 'violations': return `${violations.length} VIOLATIONS DETECTED - PRODUCTION BLOCKED`;
      default: return 'SCANNING REQUIRED';
    }
  };

  return (
    <div className="space-y-6">
      <Card className={`border-2 ${systemStatus === 'clean' ? 'border-green-200' : 'border-red-200'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            🚨 Mock Data Protection System
            <Badge variant={systemStatus === 'clean' ? 'default' : 'destructive'}>
              {systemStatus === 'clean' ? 'SECURE' : 'ALERT'}
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
                : 'No scan performed yet'
              }
            </p>
          </div>

          {systemStatus === 'violations' && violations.length > 0 && (
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
                    <div key={index} className="text-sm bg-white p-2 rounded border">
                      <strong>{violation.violation_type}</strong> in {violation.file_path}:{violation.line_number}
                      <br />
                      <code className="text-xs">{violation.violation_content}</code>
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

          {systemStatus === 'clean' && (
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
            variant={systemStatus === 'violations' ? "destructive" : "default"}
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
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getStatusColor()}`}>
                {systemStatus === 'clean' ? '0' : violations.length}
              </div>
              <div className="text-xs text-gray-500">Violations</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${systemStatus === 'clean' ? 'text-green-600' : 'text-red-600'}`}>
                {systemStatus === 'clean' ? '100%' : '0%'}
              </div>
              <div className="text-xs text-gray-500">Production Ready</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {lastScanTime ? '✓' : '?'}
              </div>
              <div className="text-xs text-gray-500">Last Scan</div>
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
