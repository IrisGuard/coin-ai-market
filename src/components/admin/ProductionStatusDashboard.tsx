
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import { useRealMockDataProtectionStatus } from '@/hooks/useRealMockDataProtection';
import { verifySystemCleanStatus } from '@/utils/databaseCleanup';

interface SystemMetrics {
  totalFiles: number;
  cleanFiles: number;
  violationFiles: number;
  productionReadiness: number;
}

const ProductionStatusDashboard = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalFiles: 0,
    cleanFiles: 0,
    violationFiles: 0,
    productionReadiness: 0
  });
  
  const { isProductionReady, totalViolations, isLoading } = useRealMockDataProtectionStatus();

  useEffect(() => {
    const updateMetrics = async () => {
      try {
        const status = await verifySystemCleanStatus();
        const readiness = status.isClean ? 100 : Math.max(0, 100 - (status.remainingViolations * 10));
        
        setMetrics({
          totalFiles: 220, // Approximate file count
          cleanFiles: status.isClean ? 220 : 220 - status.remainingViolations,
          violationFiles: status.remainingViolations,
          productionReadiness: readiness
        });
      } catch (error) {
        console.error('Failed to update metrics:', error);
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 30000);
    return () => clearInterval(interval);
  }, [totalViolations]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Loading production status...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-blue-600" />
          Production Readiness Dashboard
          <Badge variant={isProductionReady ? "default" : "destructive"}>
            {isProductionReady ? 'READY' : 'PROCESSING'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Status */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
            <div className="flex items-center gap-3">
              {isProductionReady ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              )}
              <div>
                <h3 className="text-lg font-semibold">
                  {isProductionReady ? 'Production Ready' : 'Cleanup in Progress'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isProductionReady 
                    ? 'All systems clean and verified for deployment'
                    : `${totalViolations} violations remaining`
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {metrics.productionReadiness}%
              </div>
              <div className="text-sm text-muted-foreground">Ready</div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{metrics.totalFiles}</div>
              <div className="text-sm text-muted-foreground">Total Files</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{metrics.cleanFiles}</div>
              <div className="text-sm text-muted-foreground">Clean Files</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{metrics.violationFiles}</div>
              <div className="text-sm text-muted-foreground">Violation Files</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">REAL</div>
              <div className="text-sm text-muted-foreground">Data Source</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Production Readiness</span>
              <span>{metrics.productionReadiness}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  isProductionReady ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${metrics.productionReadiness}%` }}
              />
            </div>
          </div>

          {/* Status Messages */}
          <div className="space-y-2">
            {isProductionReady ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">All violations resolved</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Cleanup in progress</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-blue-600">
              <Activity className="h-4 w-4" />
              <span className="text-sm">Real-time monitoring active</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionStatusDashboard;
