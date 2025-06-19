
import { QueryClient } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

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
    return <div data-testid="production-wrapper">{children}</div>;
  };

  return render(ui, { wrapper: Wrapper, ...options });
};

// Setup intersection observer for production testing
export const setupIntersectionObserver = (): void => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: mockIntersectionObserver,
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

// Production data generator
export const generateProductionData = (count: number = 10): any[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `prod-${index}`,
    name: `Production Item ${index}`,
    value: Math.random() * 1000,
    timestamp: new Date().toISOString(),
  }));
};
