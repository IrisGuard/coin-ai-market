
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, AlertTriangle, CheckCircle, Clock, 
  Plus, Eye, FileText, Users
} from 'lucide-react';
import { useSecurityIncidents, useCreateSecurityIncident, useResolveSecurityIncident } from '@/hooks/admin/useSecurityIncidents';

const SecurityIncidentManager = () => {
  const { data: incidents } = useSecurityIncidents();
  const createIncident = useCreateSecurityIncident();
  const resolveIncident = useResolveSecurityIncident();
  
  const [newIncident, setNewIncident] = useState({
    incident_type: '',
    severity_level: '',
    title: '',
    description: '',
    incident_data: {}
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateIncident = async () => {
    if (!newIncident.incident_type || !newIncident.severity_level || !newIncident.title) {
      return;
    }

    try {
      await createIncident.mutateAsync(newIncident);
      setNewIncident({
        incident_type: '',
        severity_level: '',
        title: '',
        description: '',
        incident_data: {}
      });
    } catch (error) {
      console.error('Failed to create security incident:', error);
    }
  };

  const handleResolveIncident = async (incidentId: string) => {
    try {
      await resolveIncident.mutateAsync(incidentId);
    } catch (error) {
      console.error('Failed to resolve incident:', error);
    }
  };

  const incidentTypes = [
    { value: 'data_breach', label: 'Data Breach' },
    { value: 'unauthorized_access', label: 'Unauthorized Access' },
    { value: 'malware', label: 'Malware Detection' },
    { value: 'phishing', label: 'Phishing Attempt' },
    { value: 'ddos', label: 'DDoS Attack' },
    { value: 'system_compromise', label: 'System Compromise' },
    { value: 'suspicious_activity', label: 'Suspicious Activity' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="incidents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="incidents">Active Incidents</TabsTrigger>
          <TabsTrigger value="create">Report Incident</TabsTrigger>
          <TabsTrigger value="resolved">Resolved Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Active Security Incidents
                </span>
                <Badge variant="outline">
                  {incidents?.filter(incident => incident.status !== 'resolved').length || 0} Open
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidents?.filter(incident => incident.status !== 'resolved').map((incident) => (
                  <Card key={incident.id} className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className={`w-5 h-5 ${
                            incident.severity_level === 'critical' ? 'text-red-500' : 
                            incident.severity_level === 'high' ? 'text-orange-500' : 
                            'text-yellow-500'
                          }`} />
                          <div>
                            <h4 className="font-medium">{incident.title}</h4>
                            <p className="text-sm text-gray-600 capitalize">
                              {incident.incident_type.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(incident.severity_level)}>
                            {incident.severity_level}
                          </Badge>
                          <Badge className={getStatusColor(incident.status)}>
                            {incident.status}
                          </Badge>
                        </div>
                      </div>

                      {incident.description && (
                        <p className="text-sm text-gray-700 mb-3">
                          {incident.description}
                        </p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mb-4">
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <div className="font-medium">
                            {new Date(incident.created_at).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Affected Users:</span>
                          <div className="font-medium">
                            {incident.affected_users?.length || 0}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Assigned To:</span>
                          <div className="font-medium">
                            {incident.assigned_to ? 'Admin User' : 'Unassigned'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t">
                        <Button 
                          size="sm" 
                          onClick={() => handleResolveIncident(incident.id)}
                          disabled={resolveIncident.isPending}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Mark Resolved
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="w-3 h-3 mr-1" />
                          Add Note
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {(!incidents || incidents.filter(incident => incident.status !== 'resolved').length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <p>No active security incidents</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Report Security Incident
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="incident-type">Incident Type</Label>
                  <Select 
                    value={newIncident.incident_type} 
                    onValueChange={(value) => setNewIncident({...newIncident, incident_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      {incidentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity-level">Severity Level</Label>
                  <Select 
                    value={newIncident.severity_level} 
                    onValueChange={(value) => setNewIncident({...newIncident, severity_level: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {severityLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="incident-title">Incident Title</Label>
                <Input
                  id="incident-title"
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({...newIncident, title: e.target.value})}
                  placeholder="Brief description of the security incident"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="incident-description">Detailed Description</Label>
                <Textarea
                  id="incident-description"
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
                  placeholder="Provide detailed information about the incident, impact, and any immediate actions taken"
                  rows={6}
                />
              </div>

              <Button 
                onClick={handleCreateIncident}
                disabled={createIncident.isPending || !newIncident.incident_type || !newIncident.severity_level || !newIncident.title}
                className="w-full"
              >
                {createIncident.isPending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Creating Incident...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Report Security Incident
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Security Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidents?.filter(incident => incident.status === 'resolved').map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <h4 className="font-medium">{incident.title}</h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {incident.incident_type.replace('_', ' ')}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>Created: {new Date(incident.created_at).toLocaleDateString()}</span>
                          {incident.resolved_at && (
                            <span>Resolved: {new Date(incident.resolved_at).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getSeverityColor(incident.severity_level)}>
                        {incident.severity_level}
                      </Badge>
                      <div className="text-sm text-gray-600 mt-1">
                        Affected: {incident.affected_users?.length || 0} users
                      </div>
                    </div>
                  </div>
                ))}

                {(!incidents || incidents.filter(incident => incident.status === 'resolved').length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4" />
                    <p>No resolved incidents found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Incident Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {incidents?.filter(incident => incident.severity_level === 'critical' && incident.status !== 'resolved').length || 0}
            </div>
            <div className="text-sm text-gray-600">Critical Open</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {incidents?.filter(incident => incident.severity_level === 'high' && incident.status !== 'resolved').length || 0}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {incidents?.filter(incident => incident.status === 'resolved').length || 0}
            </div>
            <div className="text-sm text-gray-600">Resolved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {incidents?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Total Incidents</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityIncidentManager;
