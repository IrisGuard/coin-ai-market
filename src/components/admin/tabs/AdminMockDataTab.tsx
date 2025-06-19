
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MockDataMonitor from '@/components/admin/MockDataMonitor';
import MockDataDetectionPanel from '@/components/admin/enhanced/MockDataDetectionPanel';
import SecurityBlockingMechanism from '@/components/admin/enhanced/SecurityBlockingMechanism';
import { useRealMockDataProtectionStatus } from '@/hooks/useRealMockDataProtection';
import { resolveAllMockDataViolations, logSystemCleanupComplete } from '@/utils/databaseCleanup';

const AdminMockDataTab = () => {
  const {
    isLoading,
    isProductionReady,
    totalViolations,
    criticalViolations
  } = useRealMockDataProtectionStatus();

  const handleEmergencyCleanup = async () => {
    console.log('🚨 Starting emergency cleanup...');
    
    try {
      const result = await resolveAllMockDataViolations();
      if (result.success) {
        await logSystemCleanupComplete();
        console.log('✅ Emergency cleanup completed successfully');
      }
    } catch (error) {
      console.error('❌ Emergency cleanup failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">Loading real production data protection status...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Production Data Protection</h2>
          <p className="text-muted-foreground">
            Real-time monitoring and protection against development data contamination
          </p>
        </div>
        
        <div className="flex gap-2">
          {!isProductionReady && (
            <Button onClick={handleEmergencyCleanup} variant="destructive" size="sm">
              Emergency Cleanup
            </Button>
          )}
        </div>
      </div>

      {/* Real System Status Alert */}
      <Alert className={isProductionReady ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span className={`font-semibold ${isProductionReady ? 'text-green-800' : 'text-red-800'}`}>
              {isProductionReady 
                ? "✅ System Clean - 100% Production Ready (Real Database)"
                : `🚫 ${totalViolations} Real Violations - Production Blocked`
              }
            </span>
            <Badge variant={isProductionReady ? "default" : "destructive"}>
              {isProductionReady ? 'VALIDATED' : 'VIOLATIONS'}
            </Badge>
          </div>
        </AlertDescription>
      </Alert>

      {/* Main Monitor Component with Real Data */}
      <MockDataMonitor />

      {/* Detection Panel */}
      <MockDataDetectionPanel />

      {/* Security Mechanism */}
      <SecurityBlockingMechanism />

      {/* Real Statistics Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-Time System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">{totalViolations}</p>
              <p className="text-sm text-muted-foreground">Real Violations</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-orange-600">{criticalViolations.length}</p>
              <p className="text-sm text-muted-foreground">Critical Issues</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{isProductionReady ? '100%' : '0%'}</p>
              <p className="text-sm text-muted-foreground">Production Ready</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">REAL</p>
              <p className="text-sm text-muted-foreground">Data Source</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMockDataTab;
