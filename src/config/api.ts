
/**
 * Configuration file for API endpoints and related settings
 */

// Base URL for the CoinAI Market API
// Change this to your deployed FastAPI backend URL
export const API_BASE_URL = 'https://coinvision-ai-production.up.railway.app';

// Endpoints
export const API_ENDPOINTS = {
  ANALYZE_COIN: '/analyzeCoin',
  LISTINGS: '/listings',
  USER_PROFILE: '/users/profile',
  MARKETPLACE: '/marketplace',
  AUCTIONS: '/auctions',
};

// API request timeouts (in milliseconds)
export const API_TIMEOUTS = {
  ANALYZE_COIN: 60000, // 60 seconds for image analysis (AI processing can take longer)
  STANDARD: 10000,     // 10 seconds for standard requests
};

// File upload limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGES: 5,
  ALLOWED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
};
