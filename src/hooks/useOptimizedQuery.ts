
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { cacheService } from '@/services/cacheService';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  cacheKey?: string;
  cacheTTL?: number;
  enableCache?: boolean;
}

export function useOptimizedQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options: OptimizedQueryOptions<T> = {}
): UseQueryResult<T, Error> {
  const {
    cacheKey,
    cacheTTL = 5 * 60 * 1000, // 5 minutes
    enableCache = true,
    ...queryOptions
  } = options;

  const cacheKeyString = cacheKey || queryKey.join(':');

  return useQuery({
    queryKey,
    queryFn: async () => {
      // Try cache first if enabled
      if (enableCache) {
        const cachedData = cacheService.get<T>(cacheKeyString);
        if (cachedData) {
          return cachedData;
        }
      }

      // Fetch fresh data
      const data = await queryFn();
      
      // Cache the result if enabled
      if (enableCache) {
        cacheService.set(cacheKeyString, data, cacheTTL);
      }
      
      return data;
    },
    staleTime: cacheTTL / 2, // Consider data stale at half TTL
    gcTime: cacheTTL, // Keep in memory for TTL duration
    ...queryOptions
  });
}
