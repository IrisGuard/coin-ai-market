
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, RefreshCw, Clock, Database } from 'lucide-react';
import { useDataSync } from '@/hooks/useDataSync';

export const DataSyncStatus = () => {
  const { syncStatus, testConnection } = useDataSync();

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {syncStatus.isOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Data Sync</span>
                <Badge variant={syncStatus.isOnline ? "default" : "destructive"}>
                  {syncStatus.isOnline ? "Online" : "Offline"}
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground flex items-center gap-4">
                {syncStatus.lastSync && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last sync: {syncStatus.lastSync.toLocaleTimeString()}
                  </span>
                )}
                
                {syncStatus.pendingChanges > 0 && (
                  <span className="flex items-center gap-1">
                    <Database className="h-3 w-3" />
                    {syncStatus.pendingChanges} pending
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={testConnection}
            disabled={syncStatus.isSyncing}
          >
            {syncStatus.isSyncing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Test Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
