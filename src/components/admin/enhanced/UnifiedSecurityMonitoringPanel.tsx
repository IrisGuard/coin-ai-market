
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Shield, Scan, Clock, FileText, Lock, Activity, GitBranch } from 'lucide-react';
import { useRealMockDataScan, useRealMockDataProtectionStatus, useResolveViolation } from '@/hooks/useRealMockDataProtection';
import { formatDistanceToNow } from 'date-fns';

const UnifiedSecurityMonitoringPanel = () => {
  const mockDataScan = useRealMockDataScan();
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
    lastScanTime,
    scanResults
  } = useRealMockDataProtectionStatus();

  const handleScan = () => {
    console.log('🚀 Initiating REAL mock data scan...');
    mockDataScan.mutate();
  };

  const handleResolveViolation = (violationId: string) => {
    resolveViolation.mutate(violationId);
  };

  const getStatusIcon = () => {
    if (securityLevel === 'critical') {
      return <AlertTriangle className="h-8 w-8 text-red-600" />;
    }
    if (securityLevel === 'high') {
      return <AlertTriangle className="h-8 w-8 text-orange-600" />;
    }
    if (securityLevel === 'medium') {
      return <AlertTriangle className="h-8 w-8 text-yellow-600" />;
    }
    return <CheckCircle className="h-8 w-8 text-green-600" />;
  };

  const getStatusMessage = () => {
    if (isProductionReady) {
      return "✅ REAL SCAN: No mock data detected – 100% production ready";
    }
    return `❌ REAL SCAN: ${totalViolations} mock/demo data violations detected – system not production ready`;
  };

  const getStatusBadge = () => {
    if (isProductionReady) {
      return <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">✅ CLEAN</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800 text-lg px-4 py-2">❌ VIOLATION</Badge>;
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
            <Shield className="h-6 w-6 text-blue-600 animate-spin" />
            Security Monitoring Panel - Loading...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-pulse">Loading real security data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <h2 className="text-2xl font-bold">Security Monitoring Panel</h2>
                <p className="text-muted-foreground">Real-time Mock Data Protection System</p>
              </div>
            </div>
            {getStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Alert */}
          <Alert variant={isProductionReady ? "default" : "destructive"} className="border-2">
            <div className="flex items-center gap-3">
              <AlertDescription className="font-medium text-lg flex-1">
                {getStatusMessage()}
              </AlertDescription>
            </div>
          </Alert>

          {/* Control Panel */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border">
            <div className="space-y-1">
              <p className="font-medium text-blue-800">
                {lastScanTime ? (
                  <>Last scan: {formatDistanceToNow(new Date(lastScanTime), { addSuffix: true })}</>
                ) : (
                  'No scan performed yet'
                )}
              </p>
              {lastScan && (
                <p className="text-sm text-blue-600">
                  Scanned {lastScan.total_files_scanned} files in {lastScan.scan_duration_ms}ms
                </p>
              )}
            </div>
            <Button 
              onClick={handleScan} 
              disabled={mockDataScan.isPending}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {mockDataScan.isPending ? (
                <>
                  <Scan className="h-5 w-5 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="h-5 w-5 mr-2" />
                  Scan Now
                </>
              )}
            </Button>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg border">
              <p className="text-3xl font-bold text-red-600">{criticalViolations.length}</p>
              <p className="text-sm text-red-700">Critical Issues</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border">
              <p className="text-3xl font-bold text-orange-600">{highViolations.length}</p>
              <p className="text-sm text-orange-700">High Priority</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border">
              <p className="text-3xl font-bold text-green-600">{isProductionReady ? '100%' : '0%'}</p>
              <p className="text-sm text-green-700">Production Ready</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border">
              <p className="text-3xl font-bold text-blue-600">{lastScan?.total_files_scanned || 0}</p>
              <p className="text-sm text-blue-700">Files Scanned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Violations List */}
      {activeViolations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Active Violations ({activeViolations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activeViolations.map((violation) => (
                <div key={violation.id} className="border rounded-lg p-4 bg-red-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">{violation.file_path}:{violation.line_number}</span>
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
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Type:</strong> {violation.violation_type.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-gray-500 bg-white p-2 rounded border font-mono mb-2">
                    {violation.violation_content}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Detected: {formatDistanceToNow(new Date(violation.detected_at), { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Blocking Mechanism */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-red-600" />
            Security Blocking Mechanism
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Git Integration Status */}
          <div className="p-4 bg-blue-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Git Integration Status:</span>
            </div>
            <p className="text-sm text-blue-700">
              ✅ Pre-commit hook active: <code>.husky/pre-commit</code> validates data quality
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Script: <code>scripts/validate-no-mocks.js</code> - Real validation enabled
            </p>
          </div>

          {/* Recent Scans */}
          {scanResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600">Recent Security Scans:</h4>
              {scanResults.slice(0, 3).map((scan) => (
                <div key={scan.id} className="border rounded-lg p-3 bg-blue-50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-600">
                      {scan.scan_completed_at ? formatDistanceToNow(new Date(scan.scan_completed_at), { addSuffix: true }) : 'In progress'}
                    </span>
                    <Badge variant={scan.scan_status === 'completed' ? 'default' : 'secondary'}>
                      {scan.scan_status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Files: {scan.total_files_scanned} | Violations: {scan.violations_found} | Duration: {scan.scan_duration_ms}ms
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Final Status */}
          <Alert variant={isProductionReady ? "default" : "destructive"}>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>PRODUCTION STATUS:</strong> {isProductionReady 
                ? 'System is SECURE and PRODUCTION READY - no mock data violations detected.' 
                : `System has ${totalViolations} active violations and is NOT production ready.`
              }
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedSecurityMonitoringPanel;
