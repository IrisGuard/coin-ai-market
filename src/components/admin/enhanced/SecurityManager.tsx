
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Key, Activity, Lock, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SecurityManager = () => {
  const [activeTab, setActiveTab] = useState('incidents');
  const [newIncident, setNewIncident] = useState({
    incident_type: '',
    severity_level: 'medium',
    title: '',
    description: ''
  });

  const queryClient = useQueryClient();

  const { data: securityIncidents, isLoading: incidentsLoading } = useQuery({
    queryKey: ['security-incidents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_incidents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching security incidents:', error);
        throw error;
      }
      
      console.log('✅ Security incidents loaded:', data?.length);
      return data || [];
    }
  });

  const { data: apiKeys, isLoading: keysLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching API keys:', error);
        throw error;
      }
      
      console.log('✅ API keys loaded:', data?.length);
      return data || [];
    }
  });

  const { data: adminLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['admin-activity-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('❌ Error fetching admin logs:', error);
        throw error;
      }
      
      console.log('✅ Admin activity logs loaded:', data?.length);
      return data || [];
    }
  });

  const createIncidentMutation = useMutation({
    mutationFn: async (incidentData: any) => {
      const { data, error } = await supabase.functions.invoke('create-security-incident', {
        body: incidentData
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-incidents'] });
      setNewIncident({
        incident_type: '',
        severity_level: 'medium',
        title: '',
        description: ''
      });
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'open': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (incidentsLoading || keysLoading || logsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = {
    totalIncidents: securityIncidents?.length || 0,
    openIncidents: securityIncidents?.filter(i => i.status === 'open').length || 0,
    criticalIncidents: securityIncidents?.filter(i => i.severity_level === 'critical').length || 0,
    activeKeys: apiKeys?.filter(k => k.is_active).length || 0
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalIncidents}</div>
            <p className="text-xs text-muted-foreground">Total Incidents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.openIncidents}</div>
            <p className="text-xs text-muted-foreground">Open Incidents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{stats.criticalIncidents}</div>
            <p className="text-xs text-muted-foreground">Critical Incidents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.activeKeys}</div>
            <p className="text-xs text-muted-foreground">Active API Keys</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-600" />
            Security Management Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="incidents" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Incidents
              </TabsTrigger>
              <TabsTrigger value="api-keys" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Keys
              </TabsTrigger>
              <TabsTrigger value="admin-logs" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Admin Logs
              </TabsTrigger>
              <TabsTrigger value="access-control" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Access Control
              </TabsTrigger>
            </TabsList>

            <TabsContent value="incidents">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Security Incidents</h3>
                  <Button>Create Incident Report</Button>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Security monitoring is active. All suspicious activities are automatically logged.
                  </AlertDescription>
                </Alert>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Incident</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityIncidents?.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell>
                          <div className="font-medium">{incident.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {incident.description?.substring(0, 50)}...
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{incident.incident_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(incident.severity_level)}>
                            {incident.severity_level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(incident.status)}>
                            {incident.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {incident.assigned_to ? (
                            <Badge variant="outline">{incident.assigned_to.substring(0, 8)}...</Badge>
                          ) : (
                            <span className="text-muted-foreground">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(incident.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="api-keys">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">API Key Management</h3>
                  <Button>Generate New Key</Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Key Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys?.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell>
                          <div className="font-medium">{key.key_name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {key.description || 'No description'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={key.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {key.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {key.created_by ? (
                            <Badge variant="outline">{key.created_by.substring(0, 8)}...</Badge>
                          ) : (
                            <span className="text-muted-foreground">System</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(key.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">Never</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">Rotate</Button>
                            <Button variant="outline" size="sm">Revoke</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="admin-logs">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Admin Activity Logs</h3>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Admin User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Target Type</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>User Agent</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminLogs?.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Badge variant="outline">{log.admin_user_id.substring(0, 8)}...</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell>{log.target_type}</TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{log.ip_address || 'Unknown'}</span>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate text-sm">
                            {log.user_agent || 'Unknown'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="access-control">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Access Control & Permissions</h3>
                
                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    Role-based access control is enforced at the database level with Row Level Security policies.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Admin Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total Admin Users</span>
                          <Badge>1</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Sessions</span>
                          <Badge>1</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Security Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>RLS Enabled</span>
                          <Badge className="bg-green-100 text-green-800">Yes</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>2FA Required</span>
                          <Badge className="bg-green-100 text-green-800">Yes</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityManager;
