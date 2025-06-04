import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface CoinUploadData {
  name: string;
  description?: string;
  images: File[];
  price: number;
  year: number;
  country: string;
  denomination?: string;
  rarity: string;
  condition: string;
  grade: string;
}

interface AIAnalysisData {
  imageUrl: string;
  analysisType: 'recognition' | 'valuation' | 'authentication';
  userId: string;
}

type OfflineItemData = CoinUploadData | AIAnalysisData;

interface OfflineItem {
  id: string;
  type: 'coin_upload' | 'ai_analysis';
  data: OfflineItemData;
  timestamp: number;
  retryCount: number;
}

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingItems, setPendingItems] = useState<OfflineItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const removePendingItem = useCallback((id: string) => {
    const updatedItems = pendingItems.filter(item => item.id !== id);
    savePendingItems(updatedItems);
  }, [pendingItems]);

  const syncPendingItems = useCallback(async () => {
    if (!isOnline || isSyncing || pendingItems.length === 0) return;

    setIsSyncing(true);
    const maxRetries = 3;

    for (const item of pendingItems) {
      try {
        // This would call the appropriate API based on item type
        // For now, we'll simulate success
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        removePendingItem(item.id);
        
        toast({
          title: "Synced",
          description: `${item.type.replace('_', ' ')} uploaded successfully`,
        });
      } catch (error) {
        const updatedItems = pendingItems.map(p => 
          p.id === item.id 
            ? { ...p, retryCount: p.retryCount + 1 }
            : p
        );

        if (item.retryCount >= maxRetries) {
          // Remove items that have failed too many times
          removePendingItem(item.id);
          toast({
            title: "Sync Failed",
            description: `${item.type.replace('_', ' ')} failed after ${maxRetries} attempts`,
            variant: "destructive",
          });
        } else {
          savePendingItems(updatedItems);
        }
      }
    }

    setIsSyncing(false);
  }, [isOnline, isSyncing, pendingItems, removePendingItem]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back Online",
        description: "Syncing pending uploads...",
      });
      syncPendingItems();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode",
        description: "Items will be saved and synced when connection returns",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending items from localStorage
    loadPendingItems();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncPendingItems]);

  const loadPendingItems = () => {
    try {
      const stored = localStorage.getItem('offline_pending_items');
      if (stored) {
        setPendingItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading pending items:', error);
    }
  };

  const savePendingItems = (items: OfflineItem[]) => {
    try {
      localStorage.setItem('offline_pending_items', JSON.stringify(items));
      setPendingItems(items);
    } catch (error) {
      console.error('Error saving pending items:', error);
    }
  };

  const addPendingItem = (type: OfflineItem['type'], data: OfflineItemData) => {
    const newItem: OfflineItem = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0
    };

    const updatedItems = [...pendingItems, newItem];
    savePendingItems(updatedItems);

    toast({
      title: "Saved Offline",
      description: "Item will sync when connection returns",
    });

    return newItem.id;
  };

  return {
    isOnline,
    pendingItems,
    isSyncing,
    addPendingItem,
    removePendingItem,
    syncPendingItems
  };
};
