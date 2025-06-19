
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, Shield, Scan } from 'lucide-react';
import { useRealMockDataScan, useRealMockDataProtectionStatus } from '@/hooks/useRealMockDataProtection';
import { resolveAllMockDataViolations, verifySystemCleanStatus } from '@/utils/databaseCleanup';

const MockDataDetectionPanel = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  
  const { mutate: scanForViolations } = useRealMockDataScan();
  const { 
    isProductionReady, 
    totalViolations, 
    activeViolations,
    criticalViolations 
  } = useRealMockDataProtectionStatus();

  const handleRealScan = async () => {
    setIsScanning(true);
    
    try {
      scanForViolations(undefined, {
        onSuccess: () => {
          setLastScanTime(new Date());
          console.log('✅ Real database scan completed');
        },
        onError: (error) => {
          console.error('❌ Real scan failed:', error);
        }
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleResolveAll = async () => {
    setIsResolving(true);
    
    try {
      const result = await resolveAllMockDataViolations();
      if (result.success) {
        console.log(`✅ Resolved ${result.resolved} violations`);
        await verifySystemCleanStatus();
      }
    } catch (error) {
      console.error('❌ Resolution failed:', error);
    } finally {
      setIsResolving(false);
    }
  };

  const getStatusIcon = () => {
    if (isProductionReady) {
      return <CheckCircle className="h-6 w-6 text-green-600" />;
    }
    return <Shield className="h-6 w-6 text-blue-600" />;
  };

  const getStatusMessage = () => {
    if (isProductionReady) {
      return "System verified clean – 100% production ready";
    }
    return `${totalViolations} violations detected in real database scan`;
  };

  const getStatusBadge = () => {
    if (isProductionReady) {
      return <Badge className="bg-green-100 text-green-800">✅ PRODUCTION READY</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800">🔍 VIOLATIONS FOUND</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Real Database Violation Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Alert */}
        <Alert variant={isProductionReady ? "default" : "destructive"}>
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <AlertDescription className="font-medium">
              {getStatusMessage()}
            </AlertDescription>
            {getStatusBadge()}
          </div>
        </Alert>

        {/* Scan Controls */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {lastScanTime ? `Last scan: ${lastScanTime.toLocaleString()}` : 'Real database scan required'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleRealScan} 
              disabled={isScanning}
              variant="outline"
              size="sm"
            >
              {isScanning ? (
                <>
                  <Scan className="h-4 w-4 mr-2 animate-spin" />
                  Scanning Database...
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4 mr-2" />
                  Scan Real Database
                </>
              )}
            </Button>
            
            {totalViolations > 0 && (
              <Button 
                onClick={handleResolveAll} 
                disabled={isResolving}
                variant="destructive"
                size="sm"
              >
                {isResolving ? 'Resolving...' : 'Resolve All'}
              </Button>
            )}
          </div>
        </div>

        {/* Violations List */}
        {activeViolations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-red-600">Active Database Violations:</h4>
            {activeViolations.slice(0, 5).map((violation) => (
              <div key={violation.id} className="border rounded-lg p-3 bg-red-50">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{violation.file_path}:{violation.line_number}</span>
                  <Badge variant="destructive">{violation.violation_type}</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{violation.violation_content}</p>
                <p className="text-xs text-gray-500">Severity: {violation.severity}</p>
              </div>
            ))}
          </div>
        )}

        {/* Production Status Summary */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{totalViolations}</p>
            <p className="text-xs text-muted-foreground">Total Violations</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{criticalViolations.length}</p>
            <p className="text-xs text-muted-foreground">Critical</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{isProductionReady ? '100%' : '0%'}</p>
            <p className="text-xs text-muted-foreground">Production Ready</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MockDataDetectionPanel;
