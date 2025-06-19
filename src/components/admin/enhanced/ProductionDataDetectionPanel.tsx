
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, Shield, Scan, Clock, FileText } from 'lucide-react';
import { useRealMockDataScan, useRealMockDataProtectionStatus, useResolveViolation } from '@/hooks/useRealMockDataProtection';
import { formatDistanceToNow } from 'date-fns';

const ProductionDataDetectionPanel = () => {
  const dataSecurityScan = useRealMockDataScan();
  const resolveViolation = useResolveViolation();
  const {
    isLoading,
    violations,
    activeViolations,
    criticalViolations,
    highViolations,
    lastScan,
    isProductionReady,
    securityLevel,
    totalViolations,
    lastScanTime
  } = useRealMockDataProtectionStatus();

  const handleScan = () => {
    console.log('🚀 Initiating production data security scan...');
    dataSecurityScan.mutate();
  };

  const handleResolveViolation = (violationId: string) => {
    resolveViolation.mutate(violationId);
  };

  const getStatusIcon = () => {
    if (securityLevel === 'critical') {
      return <Shield className="h-6 w-6 text-red-600" />;
    }
    if (securityLevel === 'high') {
      return <Shield className="h-6 w-6 text-orange-600" />;
    }
    if (securityLevel === 'medium') {
      return <Shield className="h-6 w-6 text-yellow-600" />;
    }
    return <CheckCircle className="h-6 w-6 text-green-600" />;
  };

  const getStatusMessage = () => {
    if (isProductionReady) {
      return "✅ PRODUCTION SCAN: No violations detected – 100% production ready";
    }
    return `❌ PRODUCTION SCAN: ${totalViolations} data violations detected – system not production ready`;
  };

  const getStatusBadge = () => {
    if (isProductionReady) {
      return <Badge className="bg-green-100 text-green-800">✅ PRODUCTION READY</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800">❗ VIOLATIONS DETECTED</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    return <Badge className={colors[severity as keyof typeof colors] || colors.low}>{severity.toUpperCase()}</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600 animate-spin" />
            Production Data Detection Panel - Loading...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-pulse">Loading scan data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Production Data Detection Panel
          <Badge variant="outline" className="text-xs">BACKEND POWERED</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Production Status Alert */}
        <Alert variant={isProductionReady ? "default" : "destructive"}>
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <AlertDescription className="font-medium flex-1">
              {getStatusMessage()}
            </AlertDescription>
            {getStatusBadge()}
          </div>
        </Alert>

        {/* Production Scan Controls */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {lastScanTime ? (
                <>Last production scan: {formatDistanceToNow(new Date(lastScanTime), { addSuffix: true })}</>
              ) : (
                'No production scan performed yet'
              )}
            </p>
            {lastScan && (
              <p className="text-xs text-muted-foreground">
                Scanned {lastScan.total_files_scanned} files in {lastScan.scan_duration_ms}ms
              </p>
            )}
          </div>
          <Button 
            onClick={handleScan} 
            disabled={dataSecurityScan.isPending}
            variant="outline"
            size="sm"
          >
            {dataSecurityScan.isPending ? (
              <>
                <Scan className="h-4 w-4 mr-2 animate-spin" />
                Production Scanning...
              </>
            ) : (
              <>
                <Scan className="h-4 w-4 mr-2" />
                Start Production Scan
              </>
            )}
          </Button>
        </div>

        {/* Production Violations List */}
        {activeViolations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-red-600 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Production Violations Detected ({activeViolations.length}):
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {activeViolations.map((violation) => (
                <div key={violation.id} className="border rounded-lg p-3 bg-red-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-sm">{violation.file_path}:{violation.line_number}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(violation.severity)}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolveViolation(violation.id)}
                        disabled={resolveViolation.isPending}
                      >
                        Resolve
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Type:</strong> {violation.violation_type.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-gray-500 bg-white p-2 rounded border font-mono">
                    {violation.violation_content}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Detected: {formatDistanceToNow(new Date(violation.detected_at), { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Production Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{criticalViolations.length}</p>
            <p className="text-xs text-muted-foreground">Critical Issues</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{highViolations.length}</p>
            <p className="text-xs text-muted-foreground">High Priority</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{isProductionReady ? '100%' : '0%'}</p>
            <p className="text-xs text-muted-foreground">Production Ready</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{lastScan?.total_files_scanned || 0}</p>
            <p className="text-xs text-muted-foreground">Files Scanned</p>
          </div>
        </div>

        {/* Production Status */}
        <Alert variant={isProductionReady ? "default" : "destructive"}>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>PRODUCTION BACKEND STATUS:</strong> {isProductionReady 
              ? 'System is LIVE and SECURE - no data violations detected.' 
              : `System has ${totalViolations} active violations and is NOT production ready.`
            }
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default ProductionDataDetectionPanel;
