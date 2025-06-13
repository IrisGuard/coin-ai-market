
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Eye, Play, Settings } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminErrorDetectionSection = () => {
  const [timeRange, setTimeRange] = useState('24h');

  const { data: errorDetectionLogs, isLoading } = useQuery({
    queryKey: ['error-detection-logs', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_error_detection_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('❌ Error fetching error detection logs:', error);
        throw error;
      }
      
      console.log('✅ Error detection logs loaded:', data?.length);
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = {
    totalScans: errorDetectionLogs?.length || 0,
    errorsDetected: errorDetectionLogs?.filter(log => log.detected_errors && Array.isArray(log.detected_errors) && log.detected_errors.length > 0).length || 0,
    averageConfidence: errorDetectionLogs?.reduce((sum, log) => {
      const scores = log.confidence_scores as any;
      return sum + (scores?.overall || 0);
    }, 0) / (errorDetectionLogs?.length || 1),
    verified: errorDetectionLogs?.filter(log => log.accuracy_verified).length || 0
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalScans}</div>
            <p className="text-xs text-muted-foreground">Total Scans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.errorsDetected}</div>
            <p className="text-xs text-muted-foreground">Errors Detected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{Math.round(stats.averageConfidence * 100)}%</div>
            <p className="text-xs text-muted-foreground">Avg Confidence</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
            <p className="text-xs text-muted-foreground">Verified Results</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              Error Detection System
            </CardTitle>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session ID</TableHead>
                <TableHead>Image Hash</TableHead>
                <TableHead>Detected Errors</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Processing Time</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {errorDetectionLogs?.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <span className="font-mono text-sm">{log.session_id?.substring(0, 8) || 'N/A'}...</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{log.image_hash.substring(0, 8)}...</span>
                  </TableCell>
                  <TableCell>
                    {Array.isArray(log.detected_errors) && log.detected_errors.length > 0 ? (
                      <Badge className="bg-red-100 text-red-800">
                        {log.detected_errors.length} errors
                      </Badge>
                    ) : (
                      <Badge variant="outline">None</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {Math.round(((log.confidence_scores as any)?.overall || 0) * 100)}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{log.processing_time_ms || 0}ms</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={log.accuracy_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {log.accuracy_verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
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

export default AdminErrorDetectionSection;
