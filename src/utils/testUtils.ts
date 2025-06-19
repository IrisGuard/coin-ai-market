
import { QueryClient } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Test query client with no retry
export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Custom render with providers
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const testQueryClient = createTestQueryClient();
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Performance testing helpers
export const measureRenderTime = async (renderFn: () => void): Promise<number> => {
  const startTime = performance.now();
  renderFn();
  const endTime = performance.now();
  const duration = endTime - startTime;
  return duration;
};

// Mock intersection observer for testing
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  (window as any).IntersectionObserver = mockIntersectionObserver;
};

// Cleanup utilities
export const cleanupTests = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
};

// Wait for async operations
export const waitForAsync = (ms: number = 0): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Test error trigger
export const triggerTestError = (message = 'Test error'): never => {
  throw new Error(message);
};

// Validate component props - safe string-based implementation
export const validateProps = (component: any, expectedProps: Record<string, any>): string[] => {
  const errors: string[] = [];
  
  if (!component || typeof component !== 'object') {
    errors.push('Component is not a valid object');
    return errors;
  }

  const componentProps = component.props || {};
  
  const expectedKeys = Object.keys(expectedProps);
  for (let i = 0; i < expectedKeys.length; i++) {
    const key = expectedKeys[i];
    const expectedValue = expectedProps[key];
    const actualValue = componentProps[key];
    
    if (actualValue !== expectedValue) {
      const errorMessage = `Property ${key} expected ${String(expectedValue)} but got ${String(actualValue)}`;
      errors.push(errorMessage);
    }
  }
  
  return errors;
};

// Test data cleanup
export const resetTestData = (): void => {
  cleanupTests();
  
  if (typeof performance !== 'undefined' && performance.clearMarks) {
    performance.clearMarks();
    performance.clearMeasures();
  }
};
