
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRealMockDataProtectionStatus } from '@/hooks/useRealMockDataProtection';

const MockDataMonitor = () => {
  const {
    isLoading,
    isProductionReady,
    totalViolations,
    criticalViolations
  } = useRealMockDataProtectionStatus();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Loading production data protection status...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Production Status */}
      <Alert className={isProductionReady ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span className={`font-semibold ${isProductionReady ? 'text-green-800' : 'text-red-800'}`}>
              {isProductionReady 
                ? "✅ System Clean - 100% Production Ready"
                : `🚫 ${totalViolations} Violations Found - Cleanup Required`
              }
            </span>
            <Badge variant={isProductionReady ? "default" : "destructive"}>
              {isProductionReady ? 'CLEAN' : 'VIOLATIONS'}
            </Badge>
          </div>
        </AlertDescription>
      </Alert>

      {/* Real-time Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-red-600">{totalViolations}</span>
              {totalViolations === 0 && <CheckCircle className="h-5 w-5 text-green-600" />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-orange-600">{criticalViolations.length}</span>
              {criticalViolations.length === 0 && <CheckCircle className="h-5 w-5 text-green-600" />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${isProductionReady ? 'text-green-600' : 'text-red-600'}`}>
                {isProductionReady ? '100%' : '0%'}
              </span>
              <span className="text-sm text-muted-foreground">Clean</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Data Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600">REAL</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Violations List */}
      {criticalViolations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Critical Violations Requiring Immediate Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalViolations.slice(0, 5).map((violation) => (
                <div key={violation.id} className="border rounded-lg p-3 bg-red-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{violation.file_path}:{violation.line_number}</span>
                    <Badge variant="destructive">{violation.violation_type}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{violation.violation_content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {isProductionReady && (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Production Ready!</h3>
                <p className="text-green-700">All systems clean. Zero violations detected. Ready for deployment.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MockDataMonitor;
