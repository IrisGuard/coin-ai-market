
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AIExecutionsManager = () => {
  const { data: executions, isLoading } = useQuery({
    queryKey: ['ai-command-executions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_command_executions')
        .select(`
          *,
          ai_commands (
            name,
            category
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running': return <Activity className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const stats = {
    total: executions?.length || 0,
    completed: executions?.filter(e => e.execution_status === 'completed').length || 0,
    failed: executions?.filter(e => e.execution_status === 'failed').length || 0,
    running: executions?.filter(e => e.execution_status === 'running').length || 0,
    avgTime: executions?.filter(e => e.execution_time_ms)
      .reduce((sum, e) => sum + (e.execution_time_ms || 0), 0) / 
      (executions?.filter(e => e.execution_time_ms).length || 1) || 0
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-green-600" />
            AI Command Executions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Executions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.running}</div>
              <div className="text-sm text-muted-foreground">Running</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.round(stats.avgTime)}ms</div>
              <div className="text-sm text-muted-foreground">Avg Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Executions ({executions?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Command</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Execution Time</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Error</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {executions?.map((execution) => (
                <TableRow key={execution.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {(execution.ai_commands as any)?.name || 'Unknown'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {(execution.ai_commands as any)?.category || 'No category'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(execution.execution_status)}
                      <Badge className={getStatusColor(execution.execution_status)}>
                        {execution.execution_status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {execution.execution_time_ms ? `${execution.execution_time_ms}ms` : '-'}
                  </TableCell>
                  <TableCell>
                    {new Date(execution.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {execution.completed_at ? new Date(execution.completed_at).toLocaleString() : '-'}
                  </TableCell>
                  <TableCell>
                    {execution.error_message && (
                      <div className="text-red-600 text-sm truncate max-w-xs">
                        {execution.error_message}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIExecutionsManager;
