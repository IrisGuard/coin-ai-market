
import React from 'react';

// Simple query utilities without external dependencies
export const createMockQuery = (data: any) => ({
  data,
  isLoading: false,
  error: null,
  refetch: () => Promise.resolve()
});

export const createMockMutation = () => ({
  mutate: () => {},
  mutateAsync: () => Promise.resolve(),
  isLoading: false,
  error: null
});

// Simple component wrapper for testing
export const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return React.createElement('div', { 'data-testid': 'test-wrapper' }, children);
};
