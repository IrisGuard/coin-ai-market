
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Key, 
  Users, 
  Activity,
  Download,
  RefreshCw,
  CheckCircle
} from 'lucide-react';

const AdminSecurityAuditTab = () => {
  const [logFilter, setLogFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock security data
  const securityLogs = [
    {
      id: '1',
      action: 'admin_login',
      user_email: 'admin@coinai.com',
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0...',
      timestamp: new Date().toISOString(),
      severity: 'info',
      details: 'Successful admin login'
    },
    {
      id: '2',
      action: 'api_key_created',
      user_email: 'admin@coinai.com',
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0...',
      timestamp: new Date().toISOString(),
      severity: 'medium',
      details: 'New API key created: OpenAI'
    },
    {
      id: '3',
      action: 'failed_login_attempt',
      user_email: 'unknown@example.com',
      ip_address: '45.123.45.123',
      user_agent: 'Bot/1.0',
      timestamp: new Date().toISOString(),
      severity: 'high',
      details: 'Multiple failed login attempts'
    }
  ];

  const securityStats = {
    totalLogs: 2847,
    todayLogs: 156,
    highSeverityToday: 3,
    loginAttempts: 89,
    apiCalls: 1234,
    suspiciousActivity: 2
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'info': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Eye className="w-4 h-4" />;
      case 'low': return <Activity className="w-4 h-4" />;
      case 'info': return <CheckCircle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Logs</p>
                <p className="text-xl font-bold">{securityStats.totalLogs.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-xl font-bold">{securityStats.todayLogs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">High Severity</p>
                <p className="text-xl font-bold text-red-600">{securityStats.highSeverityToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Logins</p>
                <p className="text-xl font-bold">{securityStats.loginAttempts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">API Calls</p>
                <p className="text-xl font-bold">{securityStats.apiCalls}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Suspicious</p>
                <p className="text-xl font-bold text-red-600">{securityStats.suspiciousActivity}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <strong>Security Alert:</strong> 3 failed login attempts from suspicious IP addresses in the last hour.
          </AlertDescription>
        </Alert>
        <Alert className="border-yellow-200 bg-yellow-50">
          <Eye className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            <strong>Rate Limit Warning:</strong> API rate limit reached 80% for OpenAI integration.
          </AlertDescription>
        </Alert>
      </div>

      {/* Security Audit Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Audit Logs
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export Logs
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by action, user, or IP address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={logFilter} onValueChange={setLogFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Logs</SelectItem>
                <SelectItem value="high">High Severity</SelectItem>
                <SelectItem value="medium">Medium Severity</SelectItem>
                <SelectItem value="low">Low Severity</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {securityLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.action.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{log.user_email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {log.ip_address}
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getSeverityColor(log.severity)}`}>
                        {getSeverityIcon(log.severity)}
                        {log.severity}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-64 truncate text-sm" title={log.details}>
                      {log.details}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">View</Button>
                        {log.severity === 'high' && (
                          <Button size="sm" variant="outline">Block IP</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Security Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-gray-600">Require 2FA for admin access</div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">IP Allowlist</div>
                <div className="text-sm text-gray-600">Restrict admin access by IP</div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">Session Timeout</div>
                <div className="text-sm text-gray-600">Auto-logout after inactivity</div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monitoring Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">Real-time Monitoring</div>
                <div className="text-sm text-gray-600">Live security event tracking</div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">Intrusion Detection</div>
                <div className="text-sm text-gray-600">Automated threat detection</div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">Audit Logging</div>
                <div className="text-sm text-gray-600">Complete action logging</div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSecurityAuditTab;
