import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone, Download, Bell, Wifi, WifiOff, 
  RefreshCw, Battery, Signal, Cloud, CloudOff 
} from 'lucide-react';
import { useAdvancedMobilePWA } from '@/hooks/useAdvancedMobilePWA';
import { toast } from '@/hooks/use-toast';

const MobilePWAInterface: React.FC = () => {
  const {
    isOnline,
    isInstalled,
    canInstall,
    notificationPermission,
    offlineCoins,
    syncPending,
    syncOfflineData,
    enableNotifications,
    installPWA
  } = useAdvancedMobilePWA();

  const [syncProgress, setSyncProgress] = useState(0);
  const [installProgress, setInstallProgress] = useState(0);

  // Handle PWA installation
  const handleInstallPWA = async () => {
    setInstallProgress(25);
    
    try {
      const installed = await installPWA();
      
      if (installed) {
        setInstallProgress(100);
        toast({
          title: "App Installed!",
          description: "CoinAI has been added to your home screen.",
        });
      } else {
        setInstallProgress(0);
        toast({
          title: "Installation Cancelled",
          description: "You can install the app later from the menu.",
        });
      }
    } catch (error) {
      setInstallProgress(0);
      toast({
        title: "Installation Failed",
        description: "Unable to install the app. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle notification permission
  const handleEnableNotifications = async () => {
    try {
      const permission = await enableNotifications();
      
      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll receive updates about coin recognition and payments.",
        });
      } else {
        toast({
          title: "Notifications Blocked",
          description: "Enable notifications in your browser settings to get updates.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Notification Error",
        description: "Unable to enable notifications.",
        variant: "destructive",
      });
    }
  };

  // Handle sync
  const handleSync = async () => {
    if (!isOnline || syncPending === 0) return;
    
    setSyncProgress(10);
    
    try {
      await syncOfflineData();
      setSyncProgress(100);
      
      setTimeout(() => setSyncProgress(0), 2000);
      
      toast({
        title: "Sync Complete",
        description: `${syncPending} offline items synced successfully.`,
      });
    } catch (error) {
      setSyncProgress(0);
      toast({
        title: "Sync Failed",
        description: "Unable to sync offline data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* PWA Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Mobile App Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-orange-600" />
              )}
              <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {isInstalled ? (
                <Download className="h-4 w-4 text-green-600" />
              ) : (
                <Download className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm">{isInstalled ? 'Installed' : 'Not Installed'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Bell className={`h-4 w-4 ${
                notificationPermission === 'granted' ? 'text-green-600' : 'text-gray-400'
              }`} />
              <span className="text-sm capitalize">{notificationPermission}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {syncPending > 0 ? (
                <CloudOff className="h-4 w-4 text-orange-600" />
              ) : (
                <Cloud className="h-4 w-4 text-green-600" />
              )}
              <span className="text-sm">{syncPending} Pending</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Installation Card */}
      {canInstall && !isInstalled && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Download className="h-5 w-5" />
              Install CoinAI App
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Install CoinAI as a mobile app for the best experience with offline capabilities.
              </p>
              
              {installProgress > 0 && (
                <div className="space-y-2">
                  <Progress value={installProgress} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">
                    Installing... {installProgress}%
                  </p>
                </div>
              )}
              
              <Button
                onClick={handleInstallPWA}
                disabled={installProgress > 0}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Install App
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications Card */}
      {notificationPermission !== 'granted' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Enable Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Get notified about coin recognition results, payment confirmations, and app updates.
              </p>
              
              <Button
                onClick={handleEnableNotifications}
                variant="outline"
                className="w-full"
              >
                <Bell className="h-4 w-4 mr-2" />
                Enable Notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offline Data Card */}
      {(syncPending > 0 || offlineCoins.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Offline Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Coins analyzed offline:</span>
                <Badge variant="outline">{offlineCoins.length}</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending sync:</span>
                <Badge variant={syncPending > 0 ? "destructive" : "default"}>
                  {syncPending}
                </Badge>
              </div>
              
              {syncProgress > 0 && (
                <div className="space-y-2">
                  <Progress value={syncProgress} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">
                    Syncing... {syncProgress}%
                  </p>
                </div>
              )}
              
              <Button
                onClick={handleSync}
                disabled={!isOnline || syncPending === 0 || syncProgress > 0}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {isOnline ? 'Sync Now' : 'Connect to Sync'}
              </Button>
              
              {!isOnline && (
                <p className="text-xs text-center text-muted-foreground">
                  Offline data will sync automatically when you're back online
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Signal className="h-5 w-5" />
            App Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cache:</span>
              <Badge variant="outline">Active</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">AI Engine:</span>
              <Badge variant={isOnline ? "default" : "outline"}>
                {isOnline ? 'Full' : 'Offline'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Storage:</span>
              <Badge variant="outline">Available</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Speed:</span>
              <Badge variant="default">Optimized</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobilePWAInterface;