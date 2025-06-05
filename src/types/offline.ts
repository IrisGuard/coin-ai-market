
export interface OfflineItemData {
  timestamp: number;
  step?: string;
  data?: any;
}

export interface EnhancedOfflineItemData extends OfflineItemData {
  id?: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  retryCount?: number;
  lastError?: string;
}
