
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wrench, Upload, Download, Settings, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminBulkOperationsTab = () => {
  const [operations, setOperations] = useState([]);
  const [stats, setStats] = useState({
    totalOperations: 0,
    runningOperations: 0,
    completedOperations: 0,
    failedOperations: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOperations();
    fetchStats();
  }, []);

  const fetchOperations = async () => {
    try {
      const { data, error } = await supabase
        .from('bulk_operations')
        .select('*')
        .order('started_at', { ascending: false });

      if (error) throw error;
      setOperations(data || []);
    } catch (error) {
      console.error('Error fetching bulk operations:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('bulk_operations')
        .select('status');

      if (error) throw error;

      const totalOperations = data?.length || 0;
      const runningOperations = data?.filter(op => op.status === 'running').length || 0;
      const completedOperations = data?.filter(op => op.status === 'completed').length || 0;
      const failedOperations = data?.filter(op => op.status === 'failed').length || 0;

      setStats({
        totalOperations,
        runningOperations,
        completedOperations,
        failedOperations
      });
    } catch (error) {
      console.error('Error fetching bulk operation stats:', error);
    }
  };

  const filteredOperations = operations.filter(operation => 
    operation.operation_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operation.operation_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operation.target_table?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'running': return 'bg-blue-600';
      case 'pending': return 'bg-yellow-600';
      case 'failed': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Bulk Operations Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Operations</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOperations}</div>
            <p className="text-xs text-muted-foreground">All bulk operations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.runningOperations}</div>
            <p className="text-xs text-muted-foreground">Currently processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedOperations}</div>
            <p className="text-xs text-muted-foreground">Successfully finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failedOperations}</div>
            <p className="text-xs text-muted-foreground">Operations with errors</p>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Operations Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Bulk Operations Management
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search operations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={fetchOperations}>Refresh</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOperations.map((operation) => (
              <div key={operation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{operation.operation_name}</span>
                    <Badge className={getStatusColor(operation.status)}>
                      {operation.status?.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Type: {operation.operation_type} • Table: {operation.target_table}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Started: {new Date(operation.started_at).toLocaleDateString()}
                    {operation.completed_at && ` • Completed: ${new Date(operation.completed_at).toLocaleDateString()}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {operation.processed_records}/{operation.total_records || 0} records
                  </div>
                  {operation.failed_records > 0 && (
                    <div className="text-sm text-red-600">
                      {operation.failed_records} failed
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {operation.total_records > 0 ? 
                      `${((operation.processed_records / operation.total_records) * 100).toFixed(1)}%` : 
                      '0%'
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Bulk Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center">
              <Upload className="h-6 w-6 mb-2" />
              Bulk Import Coins
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center" variant="outline">
              <Download className="h-6 w-6 mb-2" />
              Export Data
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center" variant="outline">
              <Settings className="h-6 w-6 mb-2" />
              Batch Update
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBulkOperationsTab;
