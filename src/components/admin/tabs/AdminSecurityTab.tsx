
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, AlertTriangle, Lock, Activity, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminSecurityTab = () => {
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalIncidents: 0,
    criticalIncidents: 0,
    activeAlerts: 0,
    resolvedIncidents: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSecurityData();
    fetchStats();
  }, []);

  const fetchSecurityData = async () => {
    try {
      const [incidentsRes, alertsRes, logsRes] = await Promise.all([
        supabase.from('security_incidents').select('*').order('created_at', { ascending: false }),
        supabase.from('system_alerts').select('*').order('created_at', { ascending: false }),
        supabase.from('admin_activity_logs').select('*').order('created_at', { ascending: false }).limit(50)
      ]);

      setIncidents(incidentsRes.data || []);
      setAlerts(alertsRes.data || []);
      setLogs(logsRes.data || []);
    } catch (error) {
      console.error('Error fetching security data:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [incidentsRes, alertsRes] = await Promise.all([
        supabase.from('security_incidents').select('incident_type, created_at'),
        supabase.from('system_alerts').select('severity, created_at')
      ]);

      const totalIncidents = incidentsRes.data?.length || 0;
      const criticalIncidents = incidentsRes.data?.filter(i => i.incident_type === 'critical').length || 0;
      const activeAlerts = alertsRes.data?.filter(a => a.created_at && new Date(a.created_at) > new Date(Date.now() - 24*60*60*1000)).length || 0;
      const resolvedIncidents = incidentsRes.data?.filter(i => i.created_at && new Date(i.created_at) < new Date(Date.now() - 7*24*60*60*1000)).length || 0;

      setStats({
        totalIncidents,
        criticalIncidents,
        activeAlerts,
        resolvedIncidents
      });
    } catch (error) {
      console.error('Error fetching security stats:', error);
    }
  };

  const filteredIncidents = incidents.filter(incident => 
    incident.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.incident_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalIncidents}</div>
            <p className="text-xs text-muted-foreground">All security incidents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.criticalIncidents}</div>
            <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">Recent alerts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolvedIncidents}</div>
            <p className="text-xs text-muted-foreground">Incidents resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Incidents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Incidents
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={fetchSecurityData}>Refresh</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <div key={incident.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{incident.title}</span>
                    <Badge className={getSeverityColor(incident.incident_type)}>
                      {incident.incident_type?.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {incident.incident_type} • {new Date(incident.created_at).toLocaleDateString()}
                  </div>
                  {incident.description && (
                    <div className="text-sm text-gray-600 mt-1">{incident.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.slice(0, 10).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{alert.title}</span>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity?.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {alert.alert_type} • {new Date(alert.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={alert.created_at && new Date(alert.created_at) > new Date(Date.now() - 24*60*60*1000) ? 'bg-red-600' : 'bg-green-600'}>
                    {alert.created_at && new Date(alert.created_at) > new Date(Date.now() - 24*60*60*1000) ? 'ACTIVE' : 'RESOLVED'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin Activity Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Admin Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {logs.slice(0, 15).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-2 text-sm border-b">
                <div className="flex-1">
                  <span className="font-medium">{log.action}</span>
                  <span className="text-muted-foreground ml-2">on {log.target_type}</span>
                </div>
                <div className="text-muted-foreground text-xs">
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSecurityTab;
