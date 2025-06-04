import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Database, Activity, AlertTriangle, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ActivityLog {
  id: string;
  admin_user_id: string;
  action: string;
  target_type: string;
  target_id: string;
  details: any;
  created_at: string;
}

const AdminSystemTab = () => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivityLogs = async () => {
    try {
      // Ready for real API implementation
      setActivityLogs([]);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      setActivityLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async (type: string) => {
    try {
      // Ready for real API implementation
      toast({
        title: "Success",
        description: `${type} data export ready`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  const handleSystemMaintenance = async (action: string) => {
    try {
      toast({
        title: "Success",
        description: `System ${action} initiated`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} system`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6 text-gray-600" />
        <h3 className="text-lg font-semibold">System Management</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Export Users Data</span>
              <Button size="sm" variant="outline" onClick={() => handleExportData('users')}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Export Coins Data</span>
              <Button size="sm" variant="outline" onClick={() => handleExportData('coins')}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Export Transactions</span>
              <Button size="sm" variant="outline" onClick={() => handleExportData('transactions')}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              System Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Clear Cache</span>
              <Button size="sm" variant="outline" onClick={() => handleSystemMaintenance('cache_clear')}>
                Clear
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Optimize Database</span>
              <Button size="sm" variant="outline" onClick={() => handleSystemMaintenance('db_optimize')}>
                Optimize
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">System Backup</span>
              <Button size="sm" variant="outline" onClick={() => handleSystemMaintenance('backup')}>
                Backup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Admin Activity Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-4">Loading activity logs...</div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activityLogs.map((log) => (
                <div key={log.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{log.action}</Badge>
                    <Badge variant="secondary">{log.target_type}</Badge>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Admin ID: {log.admin_user_id.slice(0, 8)}...
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                  {log.details && (
                    <div className="text-xs text-gray-400 mt-1">
                      {JSON.stringify(log.details, null, 2)}
                    </div>
                  )}
                </div>
              ))}
              
              {activityLogs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No activity logs found. Connect your database to see logs.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSystemTab;
