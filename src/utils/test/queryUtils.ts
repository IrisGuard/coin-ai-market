
import { QueryClient } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Create a test query client with no retry
export const createProductionQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

// Render component with providers for testing
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): any => {
  const productionQueryClient = createProductionQueryClient();
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <div>{children}</div>;
  };

  return render(ui, { wrapper: Wrapper, ...options });
};

// Setup intersection observer mock for testing
export const setupIntersectionObserver = (): void => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  
  (window as any).IntersectionObserver = mockIntersectionObserver;
};

// Clean up test environment
export const cleanupTests = (): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
};

// Wait for async operations in tests
export const waitForAsync = (ms: number = 0): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Trigger test error for error handling tests
export const triggerProductionError = (message: string = 'Production error'): never => {
  throw new Error(message);
};
