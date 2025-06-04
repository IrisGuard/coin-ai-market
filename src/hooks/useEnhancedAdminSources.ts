
// Re-export all enhanced admin source hooks for backward compatibility
export { useSourceTemplates, useCreateSourceTemplate, useUpdateSourceTemplate } from './admin/useSourceTemplates';
export { useSourceCategories } from './admin/useSourceCategories';
export { useGeographicRegions } from './admin/useGeographicRegions';
export { useSourcePerformanceMetrics } from './admin/useSourcePerformance';
export { useEnhancedExternalSources, useBulkImportSources } from './admin/useEnhancedExternalSources';
export { getGlobalSourcesData } from './admin/useGlobalSourcesData';
