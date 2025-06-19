
import { useState, useCallback, useEffect } from 'react';
import { cacheService } from '@/services/cacheService';

interface DataCacheOptions {
  ttl?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useDataCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: DataCacheOptions = {}
) {
  const { ttl = 5 * 60 * 1000, autoRefresh = false, refreshInterval = 30000 } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first unless forcing refresh
      if (!forceRefresh) {
        const cachedData = cacheService.get<T>(key);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return cachedData;
        }
      }

      // Fetch fresh data
      const freshData = await fetchFn();
      
      // Update cache
      cacheService.set(key, freshData, ttl);
      
      setData(freshData);
      return freshData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [key, fetchFn, ttl]);

  const invalidateCache = useCallback(() => {
    cacheService.invalidate(key);
    setData(null);
  }, [key]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData(true);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    invalidateCache,
    isInCache: cacheService.has(key)
  };
}
