
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Activity, 
  CalendarIcon, 
  Download, 
  Filter, 
  Search, 
  Trash2,
  AlertCircle,
  Info,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  useStoreActivityLogs, 
  useStoreActivityStats, 
  useStoreActivityTypes,
  useBulkDeleteActivityLogs,
  StoreActivityLog 
} from '@/hooks/useStoreActivityLogs';
import { useAuth } from '@/contexts/AuthContext';

interface StoreActivityLogsProps {
  storeId: string;
}

const StoreActivityLogs: React.FC<StoreActivityLogsProps> = ({ storeId }) => {
  const { user } = useAuth();
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    activityType: '',
    severityLevel: '',
    dateFrom: '',
    dateTo: '',
    searchTerm: '',
    limit: 50,
    offset: 0
  });

  const { data: logs = [], isLoading } = useStoreActivityLogs(storeId, filters);
  const { data: stats } = useStoreActivityStats(storeId, 30);
  const { data: activityTypes = [] } = useStoreActivityTypes(storeId);
  const bulkDeleteMutation = useBulkDeleteActivityLogs();

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'error':
        return 'bg-red-50 text-red-700';
      case 'warning':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-blue-50 text-blue-700';
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLogs(logs.map(log => log.id));
    } else {
      setSelectedLogs([]);
    }
  };

  const handleSelectLog = (logId: string, checked: boolean) => {
    if (checked) {
      setSelectedLogs(prev => [...prev, logId]);
    } else {
      setSelectedLogs(prev => prev.filter(id => id !== logId));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLogs.length === 0) return;
    
    try {
      await bulkDeleteMutation.mutateAsync({ 
        logIds: selectedLogs, 
        storeId 
      });
      setSelectedLogs([]);
    } catch (error) {
      console.error('Failed to delete logs:', error);
    }
  };

  const exportLogs = () => {
    const csvContent = [
      ['Date', 'Activity Type', 'Description', 'Severity', 'Performed By'].join(','),
      ...logs.map(log => [
        new Date(log.created_at).toLocaleString(),
        log.activity_type,
        `"${log.activity_description}"`,
        log.severity_level,
        log.profiles?.full_name || 'System'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `store-activity-logs-${storeId}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading activity logs...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Activities</p>
                  <p className="text-2xl font-bold">{stats.total_activities}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Critical Issues</p>
                  <p className="text-2xl font-bold text-red-600">{stats.severity_breakdown.critical}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Errors</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.severity_breakdown.error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.severity_breakdown.warning}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Store Activity Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search activities..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-64"
              />
            </div>
            
            <Select 
              value={filters.activityType} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, activityType: value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {activityTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.severityLevel} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, severityLevel: value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Severity Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2 ml-auto">
              <Button variant="outline" onClick={exportLogs}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              {selectedLogs.length > 0 && (
                <Button 
                  variant="destructive" 
                  onClick={handleBulkDelete}
                  disabled={bulkDeleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedLogs.length})
                </Button>
              )}
            </div>
          </div>

          {/* Logs Table */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <Checkbox
                checked={selectedLogs.length === logs.length && logs.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">Select All</span>
            </div>

            {logs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No activity logs found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <Card key={log.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedLogs.includes(log.id)}
                        onCheckedChange={(checked) => handleSelectLog(log.id, checked as boolean)}
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getSeverityIcon(log.severity_level)}
                          <Badge className={getSeverityColor(log.severity_level)}>
                            {log.severity_level}
                          </Badge>
                          <Badge variant="outline">{log.activity_type}</Badge>
                          <span className="text-sm text-gray-500">
                            {format(new Date(log.created_at), 'MMM d, yyyy HH:mm:ss')}
                          </span>
                        </div>
                        
                        <p className="text-sm font-medium mb-1">{log.activity_description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>
                            By: {log.profiles?.full_name || 'System'}
                          </span>
                          <span>
                            Source: {log.source_component}
                          </span>
                          {log.related_entity_type && (
                            <span>
                              Related: {log.related_entity_type}
                            </span>
                          )}
                        </div>
                        
                        {Object.keys(log.activity_data).length > 0 && (
                          <details className="mt-2">
                            <summary className="text-xs text-blue-600 cursor-pointer">
                              View Details
                            </summary>
                            <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto">
                              {JSON.stringify(log.activity_data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreActivityLogs;
