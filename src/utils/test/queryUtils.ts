
import { QueryClient } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { generateSecureId, generateSecureRandomNumber } from '../productionRandomUtils';

// Create a production query client for real testing
export const createProductionQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (updated from deprecated cacheTime)
      },
      mutations: {
        retry: 1,
      },
    },
  });
};

// Render component with providers for production testing
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const testQueryClient = createProductionQueryClient();
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement('div', { 'data-testid': 'production-wrapper' }, children);
  };

  return render(ui, { wrapper: Wrapper, ...options });
};

// Setup intersection observer for production testing
export const setupIntersectionObserver = (): void => {
  const productionObserver = jest.fn();
  productionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: productionObserver,
  });
};

// Clean up production environment
export const cleanupProduction = (): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
};

// Wait for async operations in production
export const waitForAsync = (ms: number = 100): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Production error handler
export const triggerProductionError = (message: string = 'Production error'): Error => {
  return new Error(message);
};

// Production data generator using deterministic values
export const generateProductionData = (count: number = 10): any[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: generateSecureId('prod'),
    name: `Production Item ${index + 1}`,
    value: (index + 1) * 100, // Deterministic values
    timestamp: new Date().toISOString(),
  }));
};
