
export interface CoinBatch {
  id: string;
  name: string;
  images: File[];
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'paused';
  progress: number;
  error?: string;
  aiResult?: {
    name: string;
    year: number;
    denomination: string;
    country: string;
    grade: string;
    confidence: number;
  };
  estimatedValue?: number;
  createdAt: Date;
  updatedAt: Date;
}
