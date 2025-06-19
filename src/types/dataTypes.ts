
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  key: string;
}

export interface CacheStats {
  size: number;
  maxSize: number;
  hitRate: number;
  missRate: number;
  entries: Array<{
    key: string;
    timestamp: number;
    expiresAt: number;
  }>;
}

export interface DataValidationResult<T> {
  success: boolean;
  data: T | null;
  errors: Array<{
    message: string;
    path?: string[];
    code?: string;
  }> | null;
}

export interface OptimizedQueryConfig {
  cacheKey?: string;
  cacheTTL?: number;
  enableCache?: boolean;
  staleTime?: number;
  gcTime?: number;
  retryOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
}

export interface DataConsistencyResult {
  valid: boolean;
  issues: string[];
  checkedFields: string[];
  totalItems: number;
}

export interface PerformanceMetrics {
  loadTime: number;
  cacheHit: boolean;
  dataSize: number;
  timestamp: number;
  queryKey: string;
}

export interface PaginationConfig {
  page: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  total?: number;
}

export interface InfiniteScrollConfig {
  threshold: number;
  enabled: boolean;
  batchSize: number;
  preloadThreshold: number;
}

export interface DataFetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isInCache: boolean;
  lastFetch: number | null;
}

export interface OptimizationSettings {
  enableCaching: boolean;
  enablePrefetch: boolean;
  enableInfiniteScroll: boolean;
  cacheStrategy: 'memory' | 'localStorage' | 'sessionStorage';
  maxCacheSize: number;
  defaultTTL: number;
}

export type DataSourceType = 'api' | 'cache' | 'localStorage' | 'sessionStorage';

export interface DataSource {
  type: DataSourceType;
  priority: number;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface LoadingState {
  isLoading: boolean;
  isInitialLoad: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: Error | null;
}

export interface DataOptimizationReport {
  cacheUtilization: number;
  averageLoadTime: number;
  errorRate: number;
  recommendations: string[];
  generatedAt: number;
}
