
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ScrollText, 
  Search, 
  Download, 
  RefreshCw,
  AlertCircle,
  Info,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const AdminLogsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Mock log entries
  const mockLogs = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      level: 'info',
      message: 'User authentication successful for user@example.com',
      source: 'auth_service',
      user_id: 'user_123',
      ip_address: '192.168.1.100'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      level: 'warning',
      message: 'High API usage detected for external price source',
      source: 'price_scraper',
      details: 'Rate limit approaching (80% of daily quota used)'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      level: 'error',
      message: 'Failed to connect to external API: Heritage Auctions',
      source: 'data_collector',
      error_code: 'CONN_TIMEOUT',
      retry_count: 3
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      level: 'info',
      message: 'Coin recognition completed successfully',
      source: 'ai_service',
      confidence: 0.94,
      processing_time: '2.3s'
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      level: 'success',
      message: 'Automated backup completed successfully',
      source: 'backup_service',
      backup_size: '2.4 GB',
      duration: '45 minutes'
    },
    {
      id: '6',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      level: 'warning',
      message: 'Database query performance degraded',
      source: 'database',
      query_time: '3.2s',
      threshold: '2.0s'
    }
  ];

  const logStats = {
    total_logs_24h: 15742,
    error_count: 234,
    warning_count: 567,
    info_count: 14941,
    avg_response_time: '245ms'
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'info':
      default:
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
    }
  };

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">System Logs</h3>
          <p className="text-sm text-muted-foreground">Monitor system activity and debug issues</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Log Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs (24h)</CardTitle>
            <ScrollText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logStats.total_logs_24h.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">log entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{logStats.error_count}</div>
            <p className="text-xs text-muted-foreground">critical issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{logStats.warning_count}</div>
            <p className="text-xs text-muted-foreground">attention needed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Info Logs</CardTitle>
            <Info className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{logStats.info_count.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">informational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{logStats.avg_response_time}</div>
            <p className="text-xs text-muted-foreground">response time</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Log Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Levels</option>
              <option value="error">Errors Only</option>
              <option value="warning">Warnings Only</option>
              <option value="info">Info Only</option>
              <option value="success">Success Only</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Log Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Log Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {getLevelIcon(log.level)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getLevelBadge(log.level)}
                    <Badge variant="outline">{log.source}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {getTimeAgo(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{log.message}</p>
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    <div>Timestamp: {new Date(log.timestamp).toLocaleString()}</div>
                    {log.user_id && <div>User ID: {log.user_id}</div>}
                    {log.ip_address && <div>IP: {log.ip_address}</div>}
                    {log.error_code && <div>Error Code: {log.error_code}</div>}
                    {log.retry_count && <div>Retry Count: {log.retry_count}</div>}
                    {log.confidence && <div>Confidence: {(log.confidence * 100).toFixed(1)}%</div>}
                    {log.processing_time && <div>Processing Time: {log.processing_time}</div>}
                    {log.backup_size && <div>Backup Size: {log.backup_size}</div>}
                    {log.duration && <div>Duration: {log.duration}</div>}
                    {log.query_time && <div>Query Time: {log.query_time}</div>}
                    {log.threshold && <div>Threshold: {log.threshold}</div>}
                    {log.details && <div>Details: {log.details}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogsTab;
