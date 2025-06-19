
// Query utilities
export {
  createProductionQueryClient,
  renderWithProviders,
  setupIntersectionObserver,
  cleanupTests,
  waitForAsync,
  triggerProductionError
} from './queryUtils';

// Performance utilities
export {
  measureRenderTime,
  resetProductionData,
  benchmarkOperation
} from './performanceUtils';

// Validation utilities
export {
  validateProps,
  validateRealDataStructure,
  getProductionDataFromSupabase,
  validateUserData,
  validateCoinData
} from './validationUtils';

// Error detection utilities
export {
  detectCodeErrors
} from './errorDetectionUtils';
