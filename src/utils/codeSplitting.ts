
import { ComponentType, lazy } from 'react';

// Dynamic imports for code splitting
export const lazyLoad = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  return lazy(importFunc);
};

// Pre-load critical components
export const preloadComponent = async (
  importFunc: () => Promise<{ default: ComponentType<any> }>
) => {
  try {
    await importFunc();
  } catch (error) {
    console.warn('Failed to preload component:', error);
  }
};

// Component-specific lazy loading
export const LazyAdminPanel = lazy(() => import('@/pages/AdminPanelPage'));
export const LazyMarketplace = lazy(() => import('@/pages/ActiveMarketplace'));
export const LazyAuctions = lazy(() => import('@/pages/Auctions'));
export const LazyCoinDetails = lazy(() => import('@/pages/CoinDetails'));
export const LazyDealerDirect = lazy(() => import('@/pages/DealerDirect'));

// Chunk naming for better debugging
export const createNamedLazyComponent = (
  name: string,
  importFunc: () => Promise<{ default: ComponentType<any> }>
) => {
  return lazy(() => 
    importFunc().then(module => ({
      default: module.default
    }))
  );
};

// Bundle size analysis helper
export const getBundleInfo = () => {
  if (typeof window !== 'undefined' && (window as any).webpackChunkName) {
    return (window as any).webpackChunkName;
  }
  return 'main';
};

// Dynamic import with error handling
export const safeDynamicImport = async <T>(
  importFunc: () => Promise<T>
): Promise<T | null> => {
  try {
    return await importFunc();
  } catch (error) {
    console.error('Dynamic import failed:', error);
    return null;
  }
};
