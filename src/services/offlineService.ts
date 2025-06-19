
import { supabase } from '@/integrations/supabase/client';

interface QueuedOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
  retries: number;
}

class OfflineService {
  private queue: QueuedOperation[] = [];
  private isOnline = navigator.onLine;
  private syncInProgress = false;

  constructor() {
    this.initOfflineSupport();
    this.loadQueueFromStorage();
  }

  private initOfflineSupport() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Periodic sync attempt
    setInterval(() => {
      if (this.isOnline && this.queue.length > 0 && !this.syncInProgress) {
        this.syncQueue();
      }
    }, 30000); // Try every 30 seconds
  }

  private loadQueueFromStorage() {
    try {
      const stored = localStorage.getItem('offline_queue');
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  }

  private saveQueueToStorage() {
    try {
      localStorage.setItem('offline_queue', JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  async addToQueue(operation: Omit<QueuedOperation, 'id' | 'timestamp' | 'retries'>) {
    const queuedOperation: QueuedOperation = {
      ...operation,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retries: 0,
    };

    this.queue.push(queuedOperation);
    this.saveQueueToStorage();

    // Try immediate sync if online
    if (this.isOnline) {
      this.syncQueue();
    }

    return queuedOperation.id;
  }

  async syncQueue() {
    if (this.syncInProgress || !this.isOnline || this.queue.length === 0) {
      return;
    }

    this.syncInProgress = true;
    const failedOperations: QueuedOperation[] = [];

    for (const operation of this.queue) {
      try {
        await this.executeOperation(operation);
        console.log(`Synced operation ${operation.id}`);
      } catch (error) {
        console.error(`Failed to sync operation ${operation.id}:`, error);
        operation.retries++;
        
        // Keep trying up to 3 times
        if (operation.retries < 3) {
          failedOperations.push(operation);
        } else {
          console.error(`Giving up on operation ${operation.id} after 3 retries`);
        }
      }
    }

    this.queue = failedOperations;
    this.saveQueueToStorage();
    this.syncInProgress = false;

    // Dispatch sync event
    window.dispatchEvent(new CustomEvent('offline-sync', { 
      detail: { 
        synced: this.queue.length === 0,
        remaining: this.queue.length 
      }
    }));
  }

  private async executeOperation(operation: QueuedOperation) {
    const { type, table, data } = operation;

    // Only work with existing tables
    if (table === 'coins') {
      switch (type) {
        case 'create':
          const { error: createError } = await supabase
            .from('coins')
            .insert(data);
          if (createError) throw createError;
          break;

        case 'update':
          const { error: updateError } = await supabase
            .from('coins')
            .update(data.values)
            .eq('id', data.id);
          if (updateError) throw updateError;
          break;

        case 'delete':
          const { error: deleteError } = await supabase
            .from('coins')
            .delete()
            .eq('id', data.id);
          if (deleteError) throw deleteError;
          break;

        default:
          throw new Error(`Unknown operation type: ${type}`);
      }
    } else {
      // For other tables, store in localStorage for now
      const storageKey = `offline_${table}_${operation.id}`;
      localStorage.setItem(storageKey, JSON.stringify({ ...data, _operation: type, _timestamp: Date.now() }));
    }
  }

  // Wrapper methods for common operations
  async createCoin(coinData: any) {
    if (this.isOnline) {
      const { data, error } = await supabase
        .from('coins')
        .insert(coinData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      const tempId = crypto.randomUUID();
      await this.addToQueue({
        type: 'create',
        table: 'coins',
        data: { ...coinData, id: tempId },
      });
      return { ...coinData, id: tempId, _offline: true };
    }
  }

  async updateCoin(id: string, updates: any) {
    if (this.isOnline) {
      const { error } = await supabase
        .from('coins')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    } else {
      await this.addToQueue({
        type: 'update',
        table: 'coins',
        data: { id, values: updates },
      });
    }
  }

  async deleteCoin(id: string) {
    if (this.isOnline) {
      const { error } = await supabase
        .from('coins')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } else {
      await this.addToQueue({
        type: 'delete',
        table: 'coins',
        data: { id },
      });
    }
  }

  // Cache management for offline data
  async getCachedCoins(): Promise<any[]> {
    try {
      const cached = localStorage.getItem('cached_coins');
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Failed to get cached coins:', error);
      return [];
    }
  }

  async setCachedCoins(coins: any[]): Promise<void> {
    try {
      localStorage.setItem('cached_coins', JSON.stringify(coins));
      localStorage.setItem('cache_timestamp', Date.now().toString());
    } catch (error) {
      console.error('Failed to cache coins:', error);
    }
  }

  isCacheStale(maxAge: number = 5 * 60 * 1000): boolean { // 5 minutes default
    const timestamp = localStorage.getItem('cache_timestamp');
    if (!timestamp) return true;
    
    return Date.now() - parseInt(timestamp) > maxAge;
  }

  getQueueStatus() {
    return {
      isOnline: this.isOnline,
      queueLength: this.queue.length,
      syncInProgress: this.syncInProgress,
    };
  }

  clearQueue() {
    this.queue = [];
    this.saveQueueToStorage();
  }
}

export const offlineService = new OfflineService();
export default offlineService;
