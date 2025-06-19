
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, Shield, Scan } from 'lucide-react';
import { useRealMockDataViolations, useRealMockDataScan } from '@/hooks/useRealMockDataProtection';

const ProductionReadyMockDataDetectionPanel = () => {
  const { data: violations = [], isLoading: violationsLoading } = useRealMockDataViolations();
  const scanMutation = useRealMockDataScan();

  const handleScan = () => {
    scanMutation.mutate();
  };

  const isProductionReady = violations.length === 0;
  const activeViolations = violations.filter(v => v.status === 'active');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Production Mock Data Detection - REAL DATA ONLY
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Real Production Status */}
        <Alert variant={isProductionReady ? "default" : "destructive"}>
          <div className="flex items-center gap-3">
            <CheckCircle className={`h-6 w-6 ${isProductionReady ? 'text-green-600' : 'text-red-600'}`} />
            <AlertDescription className="font-medium">
              {isProductionReady 
                ? "✅ PRODUCTION READY - Zero mock data violations detected"
                : `🚫 ${activeViolations.length} REAL violations found in database`
              }
            </AlertDescription>
            <Badge variant={isProductionReady ? "default" : "destructive"}>
              {isProductionReady ? 'CLEAN' : 'VIOLATIONS'}
            </Badge>
          </div>
        </Alert>

        {/* Real Violations List */}
        {activeViolations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-red-600">Real Database Violations:</h4>
            {activeViolations.map((violation) => (
              <div key={violation.id} className="border rounded-lg p-3 bg-red-50">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{violation.file_path}:{violation.line_number}</span>
                  <Badge variant="destructive">{violation.violation_type}</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{violation.violation_content}</p>
                <p className="text-xs text-muted-foreground">
                  Detected: {new Date(violation.detected_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Real Scan Controls */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Real-time database monitoring active
            </p>
          </div>
          <Button 
            onClick={handleScan} 
            disabled={scanMutation.isPending || violationsLoading}
            variant="outline"
            size="sm"
          >
            {scanMutation.isPending ? (
              <>
                <Scan className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Scan className="h-4 w-4 mr-2" />
                Real Scan
              </>
            )}
          </Button>
        </div>

        {/* Production Statistics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {isProductionReady ? '100%' : '0%'}
            </p>
            <p className="text-xs text-muted-foreground">Production Ready</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{activeViolations.length}</p>
            <p className="text-xs text-muted-foreground">Real Issues</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionReadyMockDataDetectionPanel;
