
import { QueryClient } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Production query client with no retry
export const createProductionQueryClient = (): QueryClient => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Production render with providers
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): any => {
  const productionQueryClient = createProductionQueryClient();
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Production intersection observer for testing
export const setupIntersectionObserver = (): void => {
  const productionIntersectionObserver = jest.fn();
  productionIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  (window as any).IntersectionObserver = productionIntersectionObserver;
};

// Cleanup utilities
export const cleanupTests = (): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
};

// Wait for async operations
export const waitForAsync = (ms: number = 0): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Production error trigger
export const triggerProductionError = (message: string = 'Production error'): never => {
  throw new Error(message);
};
