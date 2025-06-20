
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  pendingChanges: number;
  isSyncing: boolean;
}

export const useDataSync = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSync: null,
    pendingChanges: 0,
    isSyncing: false
  });

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      toast({
        title: "Connection Restored",
        description: "Data synchronization resumed",
      });
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
      toast({
        title: "Connection Lost",
        description: "Working in offline mode",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check database connection - renamed from testConnection
  const checkDatabaseConnection = async () => {
    try {
      setSyncStatus(prev => ({ ...prev, isSyncing: true }));
      
      const { error } = await supabase
        .from('coins')
        .select('id')
        .limit(1);

      if (error) throw error;

      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        isSyncing: false
      }));

      return true;
    } catch (error) {
      console.error('Database connection check failed:', error);
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
      return false;
    }
  };

  // Auto-check connection when coming online
  useEffect(() => {
    if (syncStatus.isOnline) {
      checkDatabaseConnection();
    }
  }, [syncStatus.isOnline]);

  return {
    syncStatus,
    checkDatabaseConnection
  };
};
