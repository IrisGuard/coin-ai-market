
export interface AIResult {
  confidence: number;
  metadata: {
    country: string;
    year: string;
    metal: string;
    name: string;
    denomination: string;
    grade: string;
    estimatedValue: number;
    rarity: string;
  };
  success: boolean;
  processingTime: number;
  aiProvider: string;
}

export interface CoinMetadata {
  name: string;
  country: string;
  year: number;
  denomination: string;
  composition: string;
  grade: string;
  estimatedValue: number;
  rarity: string;
  mint?: string;
  diameter?: number;
  weight?: number;
  errors?: string[];
  description?: string;
  category?: string;
  condition?: string;
}

export interface AIAnalysisRequest {
  imageUrl?: string;
  imageData?: string;
  analysisType?: 'basic' | 'detailed' | 'enhanced';
  includeMarketData?: boolean;
}

export interface AIAnalysisResponse {
  success: boolean;
  confidence: number;
  metadata: CoinMetadata;
  aiProvider: string;
  processingTime: number;
  errors?: string[];
  warnings?: string[];
}

export interface AIProviderConfig {
  name: string;
  isActive: boolean;
  reliability: number;
  averageResponseTime: number;
  lastUsed: Date | null;
}

export interface AIAnalysisHistory {
  id: string;
  timestamp: Date;
  imageUrl: string;
  result: AIAnalysisResponse;
  userId?: string;
}

export interface AIConfidenceMetrics {
  overall: number;
  identification: number;
  grading: number;
  valuation: number;
  authentication: number;
}

export interface AIErrorDetails {
  code: string;
  message: string;
  provider: string;
  timestamp: Date;
  recoverable: boolean;
}

export interface AILoadingState {
  isAnalyzing: boolean;
  progress: number;
  currentStep: string;
  estimatedTimeRemaining: number;
}

export interface ExternalDataSource {
  name: string;
  url: string;
  confidence: number;
  lastUpdated: Date;
  dataType: 'price' | 'specifications' | 'history' | 'market';
}

export interface MarketIntelligence {
  currentPrice: number;
  priceHistory: Array<{
    date: Date;
    price: number;
    source: string;
  }>;
  marketTrend: 'rising' | 'falling' | 'stable';
  liquidityScore: number;
  demandLevel: 'low' | 'medium' | 'high';
}

export type AIAnalysisStatus = 'idle' | 'processing' | 'completed' | 'error' | 'cancelled';

export interface AIServiceConfig {
  maxRetries: number;
  timeoutMs: number;
  fallbackProvider: string;
  enableCaching: boolean;
  cacheExpiryHours: number;
}
