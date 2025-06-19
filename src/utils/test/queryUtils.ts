
import { QueryClient } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Create a test query client with no retry
export const createTestQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        cacheTime: 0,
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
  const testQueryClient = createTestQueryClient();
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <div data-testid="test-wrapper">{children}</div>;
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
  
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: mockIntersectionObserver,
  });
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

// Test error handler
export const createTestError = (message: string = 'Test error'): Error => {
  return new Error(message);
};

// Mock data generator for tests
export const generateMockData = (count: number = 10): any[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `test-${index}`,
    name: `Test Item ${index}`,
    value: Math.random() * 100,
  }));
};
