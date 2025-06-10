
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, Shield, Key, Clock, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminSecurityEnhancements = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [auditLogging, setAuditLogging] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState('');

  const securitySettings = {
    passwordPolicy: {
      minLength: 12,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true,
      maxAge: 90 // days
    },
    sessionSecurity: {
      maxConcurrentSessions: 3,
      timeoutMinutes: sessionTimeout,
      requireReauth: true
    },
    auditSettings: {
      logAllActions: auditLogging,
      retentionDays: 365,
      alertOnSuspicious: true
    }
  };

  const handleTwoFactorToggle = async () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast({
      title: "2FA Settings Updated",
      description: `Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'}`,
    });
  };

  const handleSessionTimeoutChange = (value: string) => {
    const timeout = parseInt(value) || 30;
    setSessionTimeout(timeout);
    toast({
      title: "Session Timeout Updated",
      description: `Session timeout set to ${timeout} minutes`,
    });
  };

  const handleEmergencyLockdown = () => {
    toast({
      title: "Emergency Lockdown Initiated",
      description: "All non-admin sessions have been terminated",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Shield className="w-5 h-5" />
            Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">Secure</div>
              <div className="text-sm text-green-700">Overall Status</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">98%</div>
              <div className="text-sm text-blue-700">Security Score</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <div className="text-sm text-yellow-700">Active Threats</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="twoFactor">Enable 2FA for Admin Accounts</Label>
              <p className="text-sm text-muted-foreground">
                Require two-factor authentication for all admin users
              </p>
            </div>
            <Switch
              id="twoFactor"
              checked={twoFactorEnabled}
              onCheckedChange={handleTwoFactorToggle}
            />
          </div>

          {twoFactorEnabled && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <Shield className="w-4 h-4" />
                <span className="font-medium">2FA Configuration</span>
              </div>
              <p className="text-sm text-blue-600">
                Two-factor authentication is now required for all admin accounts. 
                Users will need to set up authenticator apps on their next login.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Session Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={sessionTimeout}
                onChange={(e) => handleSessionTimeoutChange(e.target.value)}
                min="5"
                max="480"
              />
            </div>
            <div className="space-y-2">
              <Label>Max Concurrent Sessions</Label>
              <Input
                type="number"
                value={securitySettings.sessionSecurity.maxConcurrentSessions}
                readOnly
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div>
              <div className="font-medium text-red-700">Emergency Lockdown</div>
              <div className="text-sm text-red-600">
                Immediately terminate all non-admin sessions
              </div>
            </div>
            <Button variant="destructive" onClick={handleEmergencyLockdown}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Lockdown
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit & Logging */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Audit & Logging
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auditLogging">Enable Comprehensive Audit Logging</Label>
              <p className="text-sm text-muted-foreground">
                Log all admin actions and system changes
              </p>
            </div>
            <Switch
              id="auditLogging"
              checked={auditLogging}
              onCheckedChange={setAuditLogging}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium">Actions Logged Today</div>
              <div className="text-xl font-bold">247</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium">Failed Login Attempts</div>
              <div className="text-xl font-bold">12</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium">Suspicious Activities</div>
              <div className="text-xl font-bold">3</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IP Whitelist */}
      <Card>
        <CardHeader>
          <CardTitle>IP Whitelist Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ipWhitelist">Allowed IP Addresses</Label>
            <Input
              id="ipWhitelist"
              placeholder="192.168.1.1, 10.0.0.0/24"
              value={ipWhitelist}
              onChange={(e) => setIpWhitelist(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Comma-separated list of IP addresses or CIDR blocks
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">Current IP: 192.168.1.100</Badge>
            <Badge variant="secondary">Whitelisted</Badge>
          </div>
        </CardContent>
      </Card>

      {/* API Security */}
      <Card>
        <CardHeader>
          <CardTitle>API Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">Master API Key</div>
              <div className="text-sm text-muted-foreground">
                {showApiKey ? 'sk_live_1234567890abcdef...' : '••••••••••••••••••••'}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium">API Calls (24h)</div>
              <div className="text-xl font-bold">1,847</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium">Rate Limit Status</div>
              <div className="text-xl font-bold text-green-600">Normal</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSecurityEnhancements;
