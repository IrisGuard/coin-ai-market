
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, Activity, Lock } from 'lucide-react';
import { useRealMockDataProtectionStatus } from '@/hooks/useRealMockDataProtection';

const ProductionSecurityMonitor = () => {
  const {
    isLoading,
    activeViolations,
    criticalViolations,
    isProductionReady,
    securityLevel,
    totalViolations,
    lastScanTime
  } = useRealMockDataProtectionStatus();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Loading real security data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-red-600" />
          Production Security Monitor - REAL DATA
          <Badge variant={isProductionReady ? "default" : "destructive"}>
            {isProductionReady ? 'SECURE' : 'VIOLATIONS'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Real Security Status */}
        <Alert variant={isProductionReady ? "default" : "destructive"}>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span className={`font-semibold ${isProductionReady ? 'text-green-700' : 'text-red-700'}`}>
                {isProductionReady 
                  ? '✅ PRODUCTION SECURE - Real database scan clean'
                  : `🚨 SECURITY ALERT - ${totalViolations} real violations detected`
                }
              </span>
              <Badge variant={securityLevel === 'secure' ? 'default' : 'destructive'}>
                {securityLevel.toUpperCase()}
              </Badge>
            </div>
          </AlertDescription>
        </Alert>

        {/* Real Security Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-green-600">
              {isProductionReady ? 'CLEAN' : 'ALERT'}
            </p>
            <p className="text-xs text-muted-foreground">Security Status</p>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <Shield className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="text-2xl font-bold text-orange-600">{criticalViolations.length}</p>
            <p className="text-xs text-muted-foreground">Critical Issues</p>
          </div>
          
          <div className="text-center p-4 border rounded-lg">
            <Activity className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-blue-600">LIVE</p>
            <p className="text-xs text-muted-foreground">Monitoring</p>
          </div>
        </div>

        {/* Real Active Protection Features */}
        <div className="space-y-2">
          <h4 className="font-semibold">Active Protection (Real Data):</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Real Database Validation</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Live GitHub Scanning</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Production Data Only</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Zero Tolerance Policy</span>
            </div>
          </div>
        </div>

        {/* Last Scan Info */}
        {lastScanTime && (
          <div className="text-center text-sm text-muted-foreground">
            Last real scan: {new Date(lastScanTime).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductionSecurityMonitor;
