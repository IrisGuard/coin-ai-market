
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, Shield, Scan, Clock, FileText, Lock, Activity, GitBranch, AlertTriangle } from 'lucide-react';
import { useRealMockDataScan, useRealMockDataProtectionStatus, useResolveViolation } from '@/hooks/useRealMockDataProtection';
import { useRealGithubMockDataScanner, useRealGithubViolations } from '@/hooks/useRealGithubMockDataScanner';
import { formatDistanceToNow } from 'date-fns';
import ErrorDetectionPanel from './ErrorDetectionPanel';

const UnifiedSecurityMonitoringPanel = () => {
  const [githubToken, setGithubToken] = useState('');
  const [repoOwner, setRepoOwner] = useState('lovable-dev');
  const [repoName, setRepoName] = useState('coin-vision-ai');
  
  const productionDataScan = useRealMockDataScan();
  const githubScanner = useRealGithubMockDataScanner();
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

  const { data: githubViolations = [], isLoading: githubLoading } = useRealGithubViolations();

  const handleScan = () => {
    console.log('🚀 Initiating production security scan...');
    productionDataScan.mutate();
  };

  const handleGithubScan = () => {
    if (!githubToken.trim()) {
      alert('Please enter GitHub token');
      return;
    }
    console.log('🔍 Initiating GitHub repository scan...');
    githubScanner.mutate({ repoOwner, repoName, githubToken });
  };

  const handleResolveViolation = (violationId: string) => {
    resolveViolation.mutate(violationId);
  };

  // Combine all violations
  const allViolations = [...violations, ...githubViolations];
  const totalAllViolations = allViolations.length;
  const criticalAll = allViolations.filter(v => v.severity === 'critical').length;
  const highAll = allViolations.filter(v => v.severity === 'high').length;
  const mediumAll = allViolations.filter(v => v.severity === 'medium').length;
  const lowAll = allViolations.filter(v => v.severity === 'low').length;

  const getStatusIcon = () => {
    if (totalAllViolations === 0) {
      return <CheckCircle className="h-8 w-8 text-green-600" />;
    }
    return <AlertTriangle className="h-8 w-8 text-red-600" />;
  };

  const getStatusMessage = () => {
    if (totalAllViolations === 0) {
      return "✅ PRODUCTION SCAN: No violations detected – 100% production ready";
    }
    return `🚨 VIOLATIONS DETECTED: ${totalAllViolations} mock data violations found across ${new Set(allViolations.map(v => v.file_path)).size} files`;
  };

  const getStatusBadge = () => {
    if (totalAllViolations === 0) {
      return <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">✅ CLEAN</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800 text-lg px-4 py-2">🚨 {totalAllViolations} VIOLATIONS</Badge>;
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

  if (isLoading && githubLoading) {
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
            <div className="animate-pulse">Loading security data...</div>
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
                <h2 className="text-2xl font-bold">Security Monitoring Panel - Phase 16</h2>
                <p className="text-muted-foreground">Real-time GitHub + Supabase Mock Data Detection</p>
              </div>
            </div>
            {getStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Alert */}
          <Alert variant={totalAllViolations === 0 ? "default" : "destructive"} className="border-2">
            <div className="flex items-center gap-3">
              <AlertDescription className="font-medium text-lg flex-1">
                {getStatusMessage()}
              </AlertDescription>
            </div>
          </Alert>

          {/* GitHub Scanner Section */}
          <div className="p-4 bg-purple-50 rounded-lg border">
            <h3 className="font-semibold text-purple-800 mb-3">🔍 GitHub Repository Scanner</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input
                placeholder="Repository Owner"
                value={repoOwner}
                onChange={(e) => setRepoOwner(e.target.value)}
              />
              <Input
                placeholder="Repository Name"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
              />
              <Input
                type="password"
                placeholder="GitHub Token"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleGithubScan} 
              disabled={githubScanner.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {githubScanner.isPending ? (
                <>
                  <Scan className="h-5 w-5 mr-2 animate-spin" />
                  Scanning GitHub...
                </>
              ) : (
                <>
                  <Scan className="h-5 w-5 mr-2" />
                  Scan GitHub Repository
                </>
              )}
            </Button>
            {githubViolations.length > 0 && (
              <p className="text-sm text-purple-600 mt-2">
                Last GitHub scan found {githubViolations.length} violations
              </p>
            )}
          </div>

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
              disabled={productionDataScan.isPending}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {productionDataScan.isPending ? (
                <>
                  <Scan className="h-5 w-5 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="h-5 w-5 mr-2" />
                  Scan Supabase
                </>
              )}
            </Button>
          </div>

          {/* Combined Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg border">
              <p className="text-3xl font-bold text-red-600">{criticalAll}</p>
              <p className="text-sm text-red-700">Critical Issues</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border">
              <p className="text-3xl font-bold text-orange-600">{highAll}</p>
              <p className="text-sm text-orange-700">High Priority</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border">
              <p className="text-3xl font-bold text-yellow-600">{mediumAll}</p>
              <p className="text-sm text-yellow-700">Medium</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border">
              <p className="text-3xl font-bold text-blue-600">{lowAll}</p>
              <p className="text-sm text-blue-700">Low Priority</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border">
              <p className="text-3xl font-bold text-gray-600">{totalAllViolations}</p>
              <p className="text-sm text-gray-700">Total Violations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Detection Panel */}
      <ErrorDetectionPanel />

      {/* Violations List */}
      {totalAllViolations > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              All Detected Violations ({totalAllViolations})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {allViolations.map((violation, index) => (
                <div key={index} className="border rounded-lg p-3 bg-red-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getSeverityBadge(violation.severity)}
                        <span className="text-sm font-medium">{violation.violation_type}</span>
                      </div>
                      <p className="font-medium text-red-800">{violation.violation_content}</p>
                      <p className="text-sm text-red-600">
                        {violation.file_path}:{violation.line_number}
                      </p>
                      {violation.context && (
                        <p className="text-xs text-red-500 mt-1 font-mono bg-red-100 p-1 rounded">
                          {violation.context}
                        </p>
                      )}
                    </div>
                    {violation.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolveViolation(violation.id)}
                        className="text-green-600"
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Production Status: Clean (0 Violations)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <div>
                <h3 className="text-xl font-semibold text-green-600">100% Production Ready</h3>
                <p className="text-muted-foreground">No violations detected in GitHub or Supabase</p>
              </div>
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
              Script: <code>scripts/validate-no-violations.js</code> - Production validation enabled
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
                    Files: {scan.total_files_scanned} | Violations: {scan.violations_found || 0} | Duration: {scan.scan_duration_ms}ms
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Final Status */}
          <Alert variant={totalAllViolations === 0 ? "default" : "destructive"}>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>PRODUCTION STATUS:</strong> {
                totalAllViolations === 0 
                  ? 'System is SECURE and PRODUCTION READY - no violations detected.'
                  : `${totalAllViolations} violations detected - requires attention before production.`
              }
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedSecurityMonitoringPanel;
