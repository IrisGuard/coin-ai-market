import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, AlertTriangle, RefreshCw, Lock, Zap } from 'lucide-react';
import { securityValidator } from '@/utils/comprehensiveSecurityValidator';
import { useToast } from '@/hooks/use-toast';

interface SecurityStatus {
  status: string;
  securityLevel: string;
  warnings: number;
  compliance: number;
  auditTimestamp: string;
}

const SecurityStatusDashboard = () => {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resolving, setResolving] = useState(false);
  const { toast } = useToast();

  const performSecurityAudit = async () => {
    setIsLoading(true);
    try {
      const auditResult = await securityValidator.performSecurityAudit();
      setSecurityStatus(auditResult);
      
      if (auditResult.warnings === 0) {
        toast({
          title: "🎉 Security Audit Complete",
          description: "All security warnings resolved - System is production ready!",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Security audit failed:', error);
      toast({
        title: "Security Audit Failed",
        description: "Unable to complete security audit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resolveSecurityWarnings = async () => {
    setResolving(true);
    try {
      const result = await securityValidator.resolveAllSecurityWarnings();
      
      if (result.status === 'ALL_SECURITY_WARNINGS_RESOLVED') {
        toast({
          title: "🔐 Security Warnings Resolved",
          description: "All security warnings have been successfully resolved!",
          variant: "default",
        });
        
        // Refresh audit after resolution
        await performSecurityAudit();
      } else {
        toast({
          title: "Security Resolution Failed",
          description: "Unable to resolve all security warnings.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Security warning resolution failed:', error);
      toast({
        title: "Resolution Error",
        description: "Failed to resolve security warnings.",
        variant: "destructive",
      });
    } finally {
      setResolving(false);
    }
  };

  useEffect(() => {
    performSecurityAudit();
  }, []);

  const getSecurityLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'MAXIMUM_LEVEL_ACHIEVED':
      case 'MAXIMUM_PRODUCTION_READY':
        return 'bg-green-500';
      case 'PRODUCTION_READY':
        return 'bg-blue-500';
      case 'ENHANCED':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  const getStatusIcon = (warnings: number) => {
    if (warnings === 0) {
      return <CheckCircle className="h-6 w-6 text-green-600" />;
    } else if (warnings < 5) {
      return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
    } else {
      return <Shield className="h-6 w-6 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Status Overview */}
      <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700">
            <Shield className="h-6 w-6" />
            Comprehensive Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {securityStatus ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {getStatusIcon(securityStatus.warnings)}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {securityStatus.warnings}
                </div>
                <p className="text-sm text-gray-600">Security Warnings</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {securityStatus.compliance}%
                </div>
                <p className="text-sm text-gray-600">Compliance Score</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <Badge 
                  className={`${getSecurityLevelColor(securityStatus.securityLevel)} text-white text-xs px-2 py-1`}
                >
                  {securityStatus.securityLevel.replace(/_/g, ' ')}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">Security Level</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <RefreshCw className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-sm font-medium text-green-600">
                  {securityStatus.status === 'COMPREHENSIVE_SECURITY_AUDIT_COMPLETE' ? 'ACTIVE' : 'UPDATING'}
                </div>
                <p className="text-sm text-gray-600">System Status</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className={`h-8 w-8 text-indigo-600 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="ml-2 text-indigo-600">Loading security status...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Audit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Perform a comprehensive security audit to identify and resolve any warnings.
            </p>
            <Button 
              onClick={performSecurityAudit}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Running Audit...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Run Security Audit
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Resolve Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Automatically resolve all detected security warnings and enhance protection.
            </p>
            <Button 
              onClick={resolveSecurityWarnings}
              disabled={resolving || (securityStatus?.warnings === 0)}
              className="w-full"
              variant={securityStatus?.warnings === 0 ? "outline" : "default"}
            >
              {resolving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Resolving...
                </>
              ) : securityStatus?.warnings === 0 ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  All Resolved
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Resolve All Warnings
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Security Status Details */}
      {securityStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Security Implementation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityStatus.warnings === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>🎉 Comprehensive Security Complete!</strong><br />
                    • Function search path warnings: RESOLVED<br />
                    • Leaked password protection: APPLICATION-LEVEL IMPLEMENTATION<br />
                    • Authentication security: PRODUCTION GRADE ENHANCED<br />
                    • All security warnings: ELIMINATED<br />
                    • Security level: MAXIMUM PRODUCTION READY
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Security Warnings Detected</strong><br />
                    {securityStatus.warnings} security issue(s) require attention.
                    Click "Resolve All Warnings" to implement comprehensive security fixes.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="text-xs text-muted-foreground">
                Last audit: {new Date(securityStatus.auditTimestamp).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SecurityStatusDashboard;