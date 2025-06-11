
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  HardDrive, 
  Download, 
  Upload, 
  RefreshCw,
  Clock,
  Database,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AdminBackupTab = () => {
  const [backupInProgress, setBackupInProgress] = useState(false);

  // Mock backup data
  const backupStats = {
    last_backup: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    backup_size: '2.4 GB',
    total_backups: 156,
    success_rate: 98.7,
    storage_used: 67.3,
    storage_limit: 100
  };

  const mockBackups = [
    {
      id: '1',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: 'automatic',
      status: 'completed',
      size: '2.4 GB',
      duration: '45 minutes',
      tables_backed_up: 23,
      compression_ratio: 0.68
    },
    {
      id: '2',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      type: 'manual',
      status: 'completed',
      size: '2.3 GB',
      duration: '42 minutes',
      tables_backed_up: 23,
      compression_ratio: 0.71
    },
    {
      id: '3',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'automatic',
      status: 'completed',
      size: '2.2 GB',
      duration: '38 minutes',
      tables_backed_up: 22,
      compression_ratio: 0.69
    },
    {
      id: '4',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'automatic',
      status: 'failed',
      size: '0 GB',
      duration: '5 minutes',
      tables_backed_up: 0,
      error: 'Storage quota exceeded'
    },
    {
      id: '5',
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'automatic',
      status: 'completed',
      size: '2.1 GB',
      duration: '41 minutes',
      tables_backed_up: 22,
      compression_ratio: 0.72
    }
  ];

  const scheduleConfig = {
    daily_backup: true,
    weekly_full_backup: true,
    monthly_archive: true,
    retention_days: 30,
    backup_time: '02:00'
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'automatic':
        return <Badge variant="outline">Auto</Badge>;
      case 'manual':
        return <Badge className="bg-blue-100 text-blue-800">Manual</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    return `${hours}h ago`;
  };

  const startBackup = () => {
    setBackupInProgress(true);
    // Simulate backup process
    setTimeout(() => {
      setBackupInProgress(false);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Backup Management</h3>
          <p className="text-sm text-muted-foreground">Manage database backups and recovery</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Restore
          </Button>
          <Button onClick={startBackup} disabled={backupInProgress}>
            {backupInProgress ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Creating Backup...
              </>
            ) : (
              <>
                <HardDrive className="h-4 w-4 mr-2" />
                Create Backup
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Backup Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTimeAgo(backupStats.last_backup)}</div>
            <p className="text-xs text-muted-foreground">
              Size: {backupStats.backup_size}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backupStats.total_backups}</div>
            <p className="text-xs text-muted-foreground">all time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{backupStats.success_rate}%</div>
            <p className="text-xs text-muted-foreground">reliability</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backupStats.storage_used}%</div>
            <Progress value={backupStats.storage_used} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Backup Progress (shown when backup is running) */}
      {backupInProgress && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">Backup in Progress</h3>
                <p className="text-sm text-blue-700">Creating database backup...</p>
                <Progress value={45} className="h-2 mt-2" />
                <p className="text-xs text-blue-600 mt-1">Processing table: user_profiles (15/23)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backup Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Backup Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Daily Incremental Backup</div>
                  <div className="text-sm text-muted-foreground">Every day at {scheduleConfig.backup_time}</div>
                </div>
                <Badge className={scheduleConfig.daily_backup ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {scheduleConfig.daily_backup ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Weekly Full Backup</div>
                  <div className="text-sm text-muted-foreground">Every Sunday at {scheduleConfig.backup_time}</div>
                </div>
                <Badge className={scheduleConfig.weekly_full_backup ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {scheduleConfig.weekly_full_backup ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Monthly Archive</div>
                  <div className="text-sm text-muted-foreground">First day of each month</div>
                </div>
                <Badge className={scheduleConfig.monthly_archive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {scheduleConfig.monthly_archive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">Retention Policy</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Backups are kept for {scheduleConfig.retention_days} days
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">Next Scheduled Backup</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Tonight at {scheduleConfig.backup_time} (Daily Incremental)
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Backups */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Backups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockBackups.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    {backup.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : backup.status === 'failed' ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <HardDrive className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {new Date(backup.created_at).toLocaleDateString()} at {new Date(backup.created_at).toLocaleTimeString()}
                      </span>
                      {getStatusBadge(backup.status)}
                      {getTypeBadge(backup.type)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Size: {backup.size} • Duration: {backup.duration} • Tables: {backup.tables_backed_up}
                      {backup.compression_ratio && ` • Compression: ${(backup.compression_ratio * 100).toFixed(0)}%`}
                      {backup.error && ` • Error: ${backup.error}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {backup.status === 'completed' && (
                    <>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4" />
                        Restore
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBackupTab;
