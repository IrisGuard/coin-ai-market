// 🚀 Production configuration — NovaCoin
export const PRODUCTION_CONFIG = {
  environment: 'production' as const,
  database: { enableMockData: false, enableTestMode: false, enableSandbox: false, requireRealData: true },
  ai: { provider: 'gemini' as const, enableMockAnalysis: false, requireRealAnalysis: true, confidenceThreshold: 0.7 },
  images: {
    enablePlaceholders: true,
    requireRealImages: true,
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  },
  payments: { enableTestMode: false, requireRealPayments: true, enableStripe: true, enableTraditional: true },
  security: { enableStrictValidation: true, requireAuthentication: true, enableRLS: true },
  performance: { enableCaching: true, enableOptimization: true, enableAnalytics: true },
  features: { enableAuctions: true, enableDirectSales: true, enableStores: true, enableAIAnalysis: true, enableCategories: true },
} as const;

export const validateProductionReadiness = () => {
  const issues: string[] = [];
  if (!import.meta.env.VITE_SUPABASE_URL) issues.push('Missing VITE_SUPABASE_URL');
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) issues.push('Missing VITE_SUPABASE_ANON_KEY');
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  if (supabaseUrl.includes('localhost') || supabaseUrl.includes('127.0.0.1')) {
    issues.push('Supabase URL appears to be localhost — should be production URL');
  }
  return { isReady: issues.length === 0, issues, config: PRODUCTION_CONFIG };
};

export const isProduction = () =>
  import.meta.env.PROD && PRODUCTION_CONFIG.environment === 'production';

export const getProductionImageUrl = (url: string | null | undefined): string => {
  if (!url || url.trim() === '') return '/placeholder-coin.svg';
  if (isProduction() && url.startsWith('blob:')) return '/placeholder-coin.svg';
  return url;
};

export const validateCoinData = (coin: any) => {
  const issues: string[] = [];
  if (!coin.name || coin.name.toLowerCase().includes('mock') || coin.name.toLowerCase().includes('demo')) {
    issues.push('Invalid coin name (contains mock/demo)');
  }
  if (!coin.user_id || coin.user_id === '00000000-0000-0000-0000-000000000000') issues.push('Invalid user_id');
  if (coin.ai_provider === 'mock-provider') issues.push('Invalid AI provider (mock provider detected)');
  if (coin.price <= 0) issues.push('Invalid price (must be greater than 0)');
  return { isValid: issues.length === 0, issues };
};
