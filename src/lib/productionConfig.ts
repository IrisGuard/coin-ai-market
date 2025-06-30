// 🚀 PRODUCTION CONFIGURATION
// This file ensures all settings are optimized for production use

export const PRODUCTION_CONFIG = {
  // Environment
  environment: 'production' as const,
  
  // Database
  database: {
    enableMockData: false,
    enableTestMode: false,
    enableSandbox: false,
    requireRealData: true,
  },
  
  // AI Settings
  ai: {
    provider: 'openai' as const, // Only real AI providers
    enableMockAnalysis: false,
    requireRealAnalysis: true,
    confidenceThreshold: 0.7,
  },
  
  // Image Settings
  images: {
    enablePlaceholders: true, // For fallback only
    requireRealImages: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  },
  
  // Payment Settings
  payments: {
    enableTestMode: false,
    requireRealPayments: true,
    enableTransak: true,
    enableTraditional: true,
  },
  
  // Security
  security: {
    enableStrictValidation: true,
    requireAuthentication: true,
    enableRLS: true,
  },
  
  // Performance
  performance: {
    enableCaching: true,
    enableOptimization: true,
    enableAnalytics: true,
  },
  
  // Features
  features: {
    enableAuctions: true,
    enableDirectSales: true,
    enableStores: true,
    enableAIAnalysis: true,
    enableCategories: true,
  },
} as const;

// Validation function to ensure production readiness
export const validateProductionReadiness = () => {
  const issues: string[] = [];
  
  // Check environment variables
  if (!import.meta.env.VITE_SUPABASE_URL) {
    issues.push('Missing VITE_SUPABASE_URL');
  }
  
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    issues.push('Missing VITE_SUPABASE_ANON_KEY');
  }
  
  // Check URLs are not localhost/development
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  if (supabaseUrl.includes('localhost') || supabaseUrl.includes('127.0.0.1')) {
    issues.push('Supabase URL appears to be localhost - should be production URL');
  }
  
  return {
    isReady: issues.length === 0,
    issues,
    config: PRODUCTION_CONFIG,
  };
};

// Helper to check if we're in production mode
export const isProduction = () => {
  return import.meta.env.PROD && PRODUCTION_CONFIG.environment === 'production';
};

// Helper to get image URL with production fallback
export const getProductionImageUrl = (url: string | null | undefined): string => {
  if (!url || url.trim() === '') {
    return '/placeholder-coin.svg';
  }
  
  // In production, don't allow blob URLs
  if (isProduction() && url.startsWith('blob:')) {
    return '/placeholder-coin.svg';
  }
  
  return url;
};

// Helper to validate coin data for production
export const validateCoinData = (coin: any) => {
  const issues: string[] = [];
  
  if (!coin.name || coin.name.toLowerCase().includes('mock') || coin.name.toLowerCase().includes('demo')) {
    issues.push('Invalid coin name (contains mock/demo)');
  }
  
  if (!coin.user_id || coin.user_id === '00000000-0000-0000-0000-000000000000') {
    issues.push('Invalid user_id');
  }
  
  if (coin.ai_provider === 'enhanced-dual-recognition' || coin.ai_provider === 'mock-provider') {
    issues.push('Invalid AI provider (mock/test provider detected)');
  }
  
  if (coin.price <= 0) {
    issues.push('Invalid price (must be greater than 0)');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
  };
};

console.log('🚀 Production Configuration Loaded:', {
  environment: PRODUCTION_CONFIG.environment,
  mockDataEnabled: PRODUCTION_CONFIG.database.enableMockData,
  productionReady: validateProductionReadiness().isReady,
}); 