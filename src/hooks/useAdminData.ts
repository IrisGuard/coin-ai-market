
// Re-export all admin hooks for backward compatibility
export { useAdminCoins, useUpdateCoinStatus } from './admin/useAdminCoins';
export { useAdminUsers, useUpdateUserStatus } from './admin/useAdminUsers';
export { useNotifications, useAdminNotifications } from './admin/useAdminNotifications';
export { useTransactions, useAdminTransactions } from './admin/useAdminTransactions';
export { useApiKeys, useApiKeyCategories, useCreateApiKey, useBulkCreateApiKeys } from './admin/useAdminApiKeys';
export { useErrorLogs, useConsoleErrors, useMarketplaceStats, useScrapingJobs } from './admin/useAdminSystem';
