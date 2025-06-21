import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface OfflineItem {
  id: string;
  type: 'coin_upload' | 'analysis' | 'listing';
  data: any;
  timestamp: number;
  retryCount: number;
}

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingItems, setPendingItems] = useState<OfflineItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load pending items from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('offline_pending_items');
    if (stored) {
      try {
        setPendingItems(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored offline items:', error);
        localStorage.removeItem('offline_pending_items');
      }
    }
  }, []);

  // Save pending items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('offline_pending_items', JSON.stringify(pendingItems));
  }, [pendingItems]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connection Restored",
        description: "Syncing offline data...",
      });
      syncPendingItems();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode",
        description: "Data will be synced when connection is restored",
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

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && pendingItems.length > 0 && !isSyncing) {
      syncPendingItems();
    }
  }, [isOnline, pendingItems.length]);

  const addToOfflineQueue = useCallback((type: OfflineItem['type'], data: any) => {
    const item: OfflineItem = {
      id: `${type}_${Date.now()}_${Date.now().toString(36)}`,
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0
    };

    setPendingItems(prev => [...prev, item]);

    toast({
      title: "Saved Offline",
      description: "Data will be synced when connection is restored",
    });

    return item.id;
  }, []);

  const removeFromOfflineQueue = useCallback((id: string) => {
    setPendingItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const syncPendingItems = useCallback(async () => {
    if (!isOnline || pendingItems.length === 0 || isSyncing) {
      return;
    }

    setIsSyncing(true);

    try {
      const results = await Promise.allSettled(
        pendingItems.map(async (item) => {
          try {
            await processOfflineItem(item);
            return { success: true, id: item.id };
          } catch (error) {
            console.error(`Failed to sync item ${item.id}:`, error);
            
            // Increment retry count
            const updatedItem = { ...item, retryCount: item.retryCount + 1 };
            
            // Remove items that have failed too many times
            if (updatedItem.retryCount >= 3) {
              toast({
                title: "Sync Failed",
                description: `Failed to sync ${item.type} after 3 attempts`,
                variant: "destructive",
              });
              return { success: false, id: item.id, remove: true };
            }
            
            return { success: false, id: item.id, updatedItem };
          }
        })
      );

      // Process results
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success);
      const failed = results.filter(r => r.status === 'fulfilled' && !r.value.success);

      // Remove successful items
      setPendingItems(prev => {
        let updated = [...prev];
        
        successful.forEach(result => {
          if (result.status === 'fulfilled') {
            updated = updated.filter(item => item.id !== result.value.id);
          }
        });

        // Update failed items or remove if max retries reached
        failed.forEach(result => {
          if (result.status === 'fulfilled') {
            if (result.value.remove) {
              updated = updated.filter(item => item.id !== result.value.id);
            } else if (result.value.updatedItem) {
              const index = updated.findIndex(item => item.id === result.value.id);
              if (index >= 0) {
                updated[index] = result.value.updatedItem;
              }
            }
          }
        });

        return updated;
      });

      if (successful.length > 0) {
        toast({
          title: "Sync Complete",
          description: `Successfully synced ${successful.length} items`,
        });
      }

      if (failed.length > 0) {
        const retriable = failed.filter(r => r.status === 'fulfilled' && !r.value.remove).length;
        if (retriable > 0) {
          toast({
            title: "Partial Sync",
            description: `${retriable} items will be retried later`,
            variant: "destructive",
          });
        }
      }

    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Sync Error",
        description: "Failed to sync offline data. Will retry later.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, pendingItems, isSyncing]);

  const processOfflineItem = async (item: OfflineItem): Promise<void> => {
    switch (item.type) {
      case 'coin_upload':
        // Simulate coin upload API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Synced coin upload:', item.data);
        break;
        
      case 'analysis':
        // Simulate analysis API call
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Synced analysis:', item.data);
        break;
        
      case 'listing':
        // Simulate listing API call
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log('Synced listing:', item.data);
        break;
        
      default:
        throw new Error(`Unknown item type: ${item.type}`);
    }
  };

  const clearOfflineQueue = useCallback(() => {
    setPendingItems([]);
    localStorage.removeItem('offline_pending_items');
    
    toast({
      title: "Queue Cleared",
      description: "All offline items have been removed",
    });
  }, []);

  return {
    isOnline,
    pendingItems,
    isSyncing,
    addToOfflineQueue,
    removeFromOfflineQueue,
    syncPendingItems,
    clearOfflineQueue
  };
};
