
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Layers, Activity, CheckCircle, XCircle, Clock, Play, Pause, RefreshCw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AdminBulkOperationsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const queryClient = useQueryClient();

  // Bulk Operations Query
  const { data: operations = [], isLoading } = useQuery({
    queryKey: ['admin-bulk-operations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bulk_operations')
        .select('*')
        .order('started_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Bulk Operations Statistics
  const { data: bulkStats } = useQuery({
    queryKey: ['admin-bulk-stats'],
    queryFn: async () => {
      const totalOperations = operations.length;
      const runningOperations = operations.filter(op => op.status === 'running').length;
      const completedOperations = operations.filter(op => op.status === 'completed').length;
      const failedOperations = operations.filter(op => op.status === 'failed').length;
      
      return {
        totalOperations,
        runningOperations,
        completedOperations,
        failedOperations
      };
    },
    enabled: operations.length > 0
  });

  // Execute Bulk Operation Mutation
  const executeBulkOperationMutation = useMutation({
    mutationFn: async (params: { operationType: string; operationName: string; targetTable: string; parameters: any }) => {
      const { data, error } = await supabase.rpc('execute_bulk_operation', {
        operation_type: params.operationType,
        operation_name: params.operationName,
        target_table: params.targetTable,
        operation_parameters: params.parameters
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bulk-operations'] });
      toast({
        title: "Success",
        description: "Bulk operation started successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'running': return <Activity className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const calculateProgress = (operation) => {
    if (operation.total_records === 0) return 0;
    return Math.round((operation.processed_records / operation.total_records) * 100);
  };

  const filteredOperations = operations.filter(operation => {
    const matchesSearch = operation.operation_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operation.operation_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operation.target_table?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || operation.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Bulk Operations Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Operations</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bulkStats?.totalOperations || 0}</div>
            <p className="text-xs text-muted-foreground">All bulk operations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bulkStats?.runningOperations || 0}</div>
            <p className="text-xs text-muted-foreground">Currently executing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bulkStats?.completedOperations || 0}</div>
            <p className="text-xs text-muted-foreground">Successfully finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bulkStats?.failedOperations || 0}</div>
            <p className="text-xs text-muted-foreground">Failed operations</p>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Operations Management */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Operations</CardTitle>
          <CardDescription>Monitor and manage bulk database operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search operations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <Button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-bulk-operations'] })}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">Loading bulk operations...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Target Table</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOperations.map((operation) => (
                  <TableRow key={operation.id}>
                    <TableCell className="font-medium">
                      {operation.operation_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{operation.operation_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{operation.target_table}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(operation.status)}
                        <Badge className={getStatusColor(operation.status)}>
                          {operation.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={calculateProgress(operation)} className="w-16" />
                        <span className="text-sm">{calculateProgress(operation)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{operation.processed_records}/{operation.total_records}</div>
                        {operation.failed_records > 0 && (
                          <div className="text-red-600">
                            {operation.failed_records} failed
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(operation.started_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {operation.status === 'running' ? (
                          <Button variant="outline" size="sm" disabled>
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : operation.status === 'pending' ? (
                          <Button variant="outline" size="sm" disabled>
                            <Play className="h-4 w-4" />
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBulkOperationsTab;
