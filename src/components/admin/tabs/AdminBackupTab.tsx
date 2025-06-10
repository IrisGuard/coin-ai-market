
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { 
  HardDrive, 
  Download, 
  Upload, 
  Database, 
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Play,
  RotateCcw
} from 'lucide-react';

const AdminBackupTab = () => {
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [isRestoring, setIsRestoring] = useState(false);

  // Mock backup data
  const backupHistory = [
    {
      id: '1',
      name: 'Auto Backup - 2024-06-10',
      type: 'automatic',
      size: '256.3 MB',
      created: '2024-06-10T08:00:00Z',
      status: 'completed',
      tables: ['users', 'coins', 'transactions', 'settings']
    },
    {
      id: '2',
      name: 'Manual Backup - 2024-06-09',
      type: 'manual',
      size: '248.7 MB',
      created: '2024-06-09T15:30:00Z',
      status: 'completed',
      tables: ['users', 'coins', 'transactions']
    },
    {
      id: '3',
      name: 'Pre-Update Backup - 2024-06-08',
      type: 'manual',
      size: '245.1 MB',
      created: '2024-06-08T12:00:00Z',
      status: 'completed',
      tables: ['users', 'coins', 'transactions', 'settings', 'logs']
    }
  ];

  const createBackup = async (type: 'full' | 'incremental' = 'full') => {
    setIsBackingUp(true);
    setBackupProgress(0);

    try {
      // Simulate backup progress
      for (let i = 0; i <= 100; i += 10) {
        setBackupProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      toast({
        title: "Backup Created",
        description: `${type} backup completed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Backup Failed",
        description: "Failed to create backup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBackingUp(false);
      setBackupProgress(0);
    }
  };

  const restoreBackup = async (backupId: string) => {
    setIsRestoring(true);
    setRestoreProgress(0);

    try {
      // Simulate restore progress
      for (let i = 0; i <= 100; i += 5) {
        setRestoreProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      toast({
        title: "Restore Completed",
        description: "Database restored successfully from backup.",
      });
    } catch (error) {
      toast({
        title: "Restore Failed",
        description: "Failed to restore from backup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRestoring(false);
      setRestoreProgress(0);
    }
  };

  const downloadBackup = (backupId: string) => {
    console.log(`Downloading backup ${backupId}`);
    toast({
      title: "Download Started",
      description: "Backup download has started.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">In Progress</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Backup & Restore</h3>
          <p className="text-sm text-muted-foreground">Manage database backups and system recovery</p>
        </div>
      </div>

      {/* Backup Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Create Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => createBackup('full')} 
                disabled={isBackingUp || isRestoring}
                className="w-full"
              >
                <HardDrive className="h-4 w-4 mr-2" />
                Create Full Backup
              </Button>
              <Button 
                variant="outline" 
                onClick={() => createBackup('incremental')} 
                disabled={isBackingUp || isRestoring}
                className="w-full"
              >
                <Database className="h-4 w-4 mr-2" />
                Create Incremental Backup
              </Button>
            </div>
            {isBackingUp && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Creating backup...</span>
                  <span>{backupProgress}%</span>
                </div>
                <Progress value={backupProgress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Backup Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto Backup</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Frequency</span>
                <span className="text-sm text-muted-foreground">Daily at 2:00 AM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Retention</span>
                <span className="text-sm text-muted-foreground">30 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Compression</span>
                <Badge variant="outline">Enabled</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Configure Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Backup History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {backupHistory.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(backup.status)}
                    <span className="font-medium">{backup.name}</span>
                    {getStatusBadge(backup.status)}
                    <Badge variant="outline" className="ml-2">
                      {backup.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Size: {backup.size}</span>
                    <span>Created: {new Date(backup.created).toLocaleString()}</span>
                    <span>Tables: {backup.tables.length}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground">
                      Tables: {backup.tables.join(', ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => downloadBackup(backup.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => restoreBackup(backup.id)}
                    disabled={isBackingUp || isRestoring}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Restore Progress */}
      {isRestoring && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              Restore in Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Restoring database...</span>
                <span>{restoreProgress}%</span>
              </div>
              <Progress value={restoreProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">
                Please do not close this page while the restore is in progress.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Backup Storage Used</span>
              <span className="text-sm font-medium">750.1 MB / 5 GB</span>
            </div>
            <Progress value={15} className="w-full" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-sm font-medium">Total Backups</div>
                <div className="text-2xl font-bold">3</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Auto Backups</div>
                <div className="text-2xl font-bold">1</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Manual Backups</div>
                <div className="text-2xl font-bold">2</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Avg Size</div>
                <div className="text-2xl font-bold">250 MB</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBackupTab;
