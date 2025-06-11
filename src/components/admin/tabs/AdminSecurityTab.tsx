
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SecurityValidation {
  status: string;
  issues: string[];
  warnings_resolved?: boolean;
  security_level?: string;
  otp_config?: string;
  otp_expiry?: string;
  leaked_password_protection?: boolean;
  validated_at?: string;
}

const AdminSecurityTab = () => {
  const [securityStatus, setSecurityStatus] = useState<SecurityValidation | null>(null);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);

  const fetchSecurityStatus = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching security validation status...');
      
      const { data, error } = await supabase.rpc('validate_production_security_config');
      
      if (error) {
        console.error('Security validation error:', error);
        toast({
          title: "Error",
          description: `Failed to validate security: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      console.log('✅ Security validation result:', data);
      
      // Safely convert the data with proper type checking
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const validatedData = data as Record<string, any>;
        const securityData: SecurityValidation = {
          status: validatedData.status || 'unknown',
          issues: Array.isArray(validatedData.issues) ? validatedData.issues : [],
          warnings_resolved: Boolean(validatedData.warnings_resolved),
          security_level: validatedData.security_level || undefined,
          otp_config: validatedData.otp_config || undefined,
          otp_expiry: validatedData.otp_expiry || undefined,
          leaked_password_protection: Boolean(validatedData.leaked_password_protection),
          validated_at: validatedData.validated_at || undefined
        };
        setSecurityStatus(securityData);
      }
      
    } catch (error) {
      console.error('Security validation failed:', error);
      toast({
        title: "Error",
        description: "Failed to validate security configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resolveSecurityWarnings = async () => {
    setResolving(true);
    try {
      console.log('🔧 Resolving security warnings...');
      
      const { data, error } = await supabase.rpc('resolve_security_warnings');
      
      if (error) {
        console.error('Failed to resolve security warnings:', error);
        toast({
          title: "Error",
          description: `Failed to resolve warnings: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      console.log('✅ Security warnings resolved:', data);
      
      toast({
        title: "Security Warnings Resolved",
        description: "OTP expiry set to 10 minutes and leaked password protection enabled",
      });
      
      // Refresh the security status
      await fetchSecurityStatus();
      
    } catch (error) {
      console.error('Failed to resolve security warnings:', error);
      toast({
        title: "Error",
        description: "Failed to resolve security warnings",
        variant: "destructive",
      });
    } finally {
      setResolving(false);
    }
  };

  useEffect(() => {
    fetchSecurityStatus();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'secure': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Security Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Monitor and resolve Supabase security warnings
          </p>
        </div>
        <Button
          onClick={fetchSecurityStatus}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Security Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : securityStatus ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(securityStatus.status)}
                  <span className={`font-semibold ${getStatusColor(securityStatus.status)}`}>
                    {securityStatus.status?.toUpperCase()}
                  </span>
                </div>
                <Badge variant={securityStatus.warnings_resolved ? "default" : "destructive"}>
                  {securityStatus.warnings_resolved ? "Warnings Resolved" : "Warnings Present"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium">Security Level</div>
                  <div className="text-sm text-muted-foreground">
                    {securityStatus.security_level || 'Unknown'}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium">OTP Configuration</div>
                  <div className="text-sm text-muted-foreground">
                    {securityStatus.otp_expiry || 'Not configured'}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium">Password Protection</div>
                  <div className="text-sm text-muted-foreground">
                    {securityStatus.leaked_password_protection ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium">Last Validated</div>
                  <div className="text-sm text-muted-foreground">
                    {securityStatus.validated_at 
                      ? new Date(securityStatus.validated_at).toLocaleString()
                      : 'Never'
                    }
                  </div>
                </div>
              </div>

              {securityStatus.issues && securityStatus.issues.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="font-medium text-red-700 mb-2">Security Issues</div>
                  <ul className="list-disc list-inside text-sm text-red-600">
                    {securityStatus.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Unable to load security status</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Security Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-blue-700">Resolve Security Warnings</div>
                <div className="text-sm text-blue-600">
                  Configure OTP expiry to 10 minutes and enable leaked password protection
                </div>
              </div>
              <Button
                onClick={resolveSecurityWarnings}
                disabled={resolving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {resolving ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Shield className="w-4 h-4 mr-2" />
                )}
                {resolving ? 'Resolving...' : 'Resolve Warnings'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-2">Expected Changes</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• OTP expiry: Set to 10 minutes (compliant)</li>
                <li>• Leaked password protection: Enabled</li>
                <li>• Session timeout: 24 hours</li>
                <li>• Rate limiting: Enabled</li>
                <li>• CSRF protection: Enabled</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-2">Security Benefits</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Reduces OTP attack window</li>
                <li>• Prevents compromised passwords</li>
                <li>• Enhances overall security posture</li>
                <li>• Meets production standards</li>
                <li>• Resolves Supabase warnings</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSecurityTab;
