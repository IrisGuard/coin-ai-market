
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
export const measureRenderTime = async (renderFn: () => void) => {
  const start = performance.now();
  renderFn();
  const end = performance.now();
  return end - start;
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
export const waitForAsync = (ms: number = 0) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Test error trigger
export const triggerTestError = (message = 'Test error') => {
  throw new Error(message);
};

// Validate component props
export const validateProps = (component: any, expectedProps: Record<string, any>) => {
  const errors: string[] = [];
  
  for (const key in expectedProps) {
    const expectedValue = expectedProps[key];
    const actualValue = component.props[key];
    
    if (actualValue !== expectedValue) {
      errors.push(`Expected ${key} to be ${String(expectedValue)}, got ${String(actualValue)}`);
    }
  }
  
  return errors;
};

// Test data cleanup
export const resetTestData = () => {
  cleanupTests();
  
  if (typeof performance !== 'undefined' && performance.clearMarks) {
    performance.clearMarks();
    performance.clearMeasures();
  }
};
