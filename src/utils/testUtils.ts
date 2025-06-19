
import { QueryClient } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Mock data generators for testing
export const generateMockCoin = (overrides = {}) => ({
  id: 'test-coin-1',
  title: 'Test Coin',
  year: 2023,
  country: 'USA',
  denomination: '$1',
  grade: 'MS-70',
  price: 100,
  dealer_id: 'test-dealer',
  category: 'test-category',
  images: ['test-image.jpg'],
  created_at: new Date().toISOString(),
  ...overrides
});

export const generateMockUser = (overrides = {}) => ({
  id: 'test-user-1',
  email: 'test@example.com',
  role: 'buyer',
  created_at: new Date().toISOString(),
  ...overrides
});

export const generateMockAuction = (overrides = {}) => ({
  id: 'test-auction-1',
  coin_id: 'test-coin-1',
  starting_price: 50,
  current_price: 75,
  ends_at: new Date(Date.now() + 86400000).toISOString(),
  status: 'active',
  ...overrides
});

export const generateMockStore = (overrides = {}) => ({
  id: 'test-store-1',
  name: 'Test Store',
  description: 'A test store',
  owner_id: 'test-dealer',
  is_active: true,
  created_at: new Date().toISOString(),
  ...overrides
});

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

// Mock Supabase responses
export const mockSupabaseResponse = (data: any[], error: any = null) => ({
  data,
  error,
  count: data?.length || 0,
  status: error ? 400 : 200,
  statusText: error ? 'Bad Request' : 'OK'
});

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

// Validate component props - simplified to avoid parsing issues
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
