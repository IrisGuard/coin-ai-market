
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, Activity, Lock, GitBranch, Clock, FileCheck } from 'lucide-react';
import { useRealMockDataProtectionStatus } from '@/hooks/useRealMockDataProtection';
import { formatDistanceToNow } from 'date-fns';

const ProductionSecurityBlockingMechanism = () => {
  const {
    isLoading,
    scanResults,
    activeViolations,
    isProductionReady,
    securityLevel,
    lastScanTime
  } = useRealMockDataProtectionStatus();

  const getStatusColor = () => {
    return isProductionReady ? 'text-green-600' : 'text-red-600';
  };

  const getStatusMessage = () => {
    return isProductionReady 
      ? 'Production security blocking is active – protecting LIVE system'
      : `Security detected ${activeViolations.length} violations – system requires attention`;
  };

  const getBlockingRulesStatus = () => {
    return [
      {
        rule: 'Block unsafe random generation',
        status: 'active',
        violations: activeViolations.filter(v => v.violation_type === 'math_random').length,
        icon: FileCheck
      },
      {
        rule: 'Block temporary development data',
        status: 'active',
        violations: activeViolations.filter(v => 
          ['mock_string', 'demo_string', 'placeholder_string', 'fake_string', 'sample_string'].includes(v.violation_type)
        ).length,
        icon: FileCheck
      },
      {
        rule: 'Block hardcoded temporary values',
        status: 'active',
        violations: activeViolations.filter(v => v.violation_content.includes('hardcoded')).length,
        icon: FileCheck
      }
    ];
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-red-600" />
            Production Security Blocking Mechanism - Loading...
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

  const blockingRules = getBlockingRulesStatus();
  const recentScans = scanResults.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-red-600" />
          Production Security Blocking Mechanism
          <Badge variant="outline" className="text-xs">BACKEND POWERED</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Production Status Alert */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span className={`font-medium ${getStatusColor()}`}>
              {getStatusMessage()}
            </span>
            <Badge variant={isProductionReady ? "default" : "destructive"} className="flex items-center gap-1">
              <Activity className={`h-3 w-3 ${!isProductionReady ? 'animate-pulse' : ''}`} />
              {isProductionReady ? 'SECURED' : 'VIOLATIONS ACTIVE'}
            </Badge>
          </AlertDescription>
        </Alert>

        {/* Production Blocking Rules */}
        <div className="space-y-2">
          <h4 className="font-semibold">Active Blocking Rules (Production Backend):</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {blockingRules.map((rule, index) => {
              const IconComponent = rule.icon;
              const hasViolations = rule.violations > 0;
              
              return (
                <div key={index} className={`flex items-center gap-2 p-3 rounded ${
                  hasViolations ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
                }`}>
                  <IconComponent className={`h-4 w-4 ${hasViolations ? 'text-red-500' : 'text-green-500'}`} />
                  <span className="flex-1">{rule.rule}</span>
                  {hasViolations ? (
                    <Badge variant="destructive" className="text-xs">
                      {rule.violations} violations
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      Clean
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Git Integration Status */}
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Git Integration Status:
          </h4>
          <div className="p-3 bg-blue-50 rounded border">
            <p className="text-sm text-blue-800">
              ✅ Pre-commit hook active: <code>.husky/pre-commit</code> validates data quality
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Script: <code>scripts/validate-no-violations.js</code> - Production validation enabled
            </p>
          </div>
        </div>

        {/* Recent Production Blocking Events */}
        {recentScans.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-600">Recent Security Scans:</h4>
            {recentScans.map((scan) => (
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
                <p className="text-xs text-gray-500">
                  Type: {scan.scan_type} | ID: {scan.scan_id}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Production Statistics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">{isProductionReady ? '24/7' : '0%'}</p>
            <p className="text-xs text-muted-foreground">Uptime</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-red-600">{activeViolations.length}</p>
            <p className="text-xs text-muted-foreground">Active Violations</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-blue-600">{scanResults.length}</p>
            <p className="text-xs text-muted-foreground">Total Scans</p>
          </div>
        </div>

        {/* Production Status Message */}
        <Alert variant={isProductionReady ? "default" : "destructive"}>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>PRODUCTION BACKEND PROTECTION:</strong> {isProductionReady 
              ? 'All security scanning and blocking mechanisms are active and functional.'
              : `${activeViolations.length} violations detected - system requires immediate attention.`
            }
            {lastScanTime && (
              <span className="block text-xs mt-1 text-muted-foreground">
                Last scan: {formatDistanceToNow(new Date(lastScanTime), { addSuffix: true })}
              </span>
            )}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default ProductionSecurityBlockingMechanism;
