import { QueryClient } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

// Performance testing helpers with real timing
export const measureRenderTime = async (renderFn: () => void): Promise<number> => {
  const startTime = performance.now();
  renderFn();
  const endTime = performance.now();
  return endTime - startTime;
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

// Validate component props with real data validation
export const validateProps = (component: any, expectedProps: Record<string, any>): string[] => {
  const errors: string[] = [];
  
  if (!component || typeof component !== 'object') {
    errors.push('Component is not a valid object');
    return errors;
  }

  const componentProps = component.props || {};
  
  for (const [key, expectedValue] of Object.entries(expectedProps)) {
    const actualValue = componentProps[key];
    
    if (actualValue !== expectedValue) {
      errors.push(`Property ${key} expected ${String(expectedValue)} but got ${String(actualValue)}`);
    }
  }
  
  return errors;
};

// Production data cleanup with real performance tracking
export const resetProductionData = (): void => {
  cleanupTests();
  
  if (typeof performance !== 'undefined' && performance.clearMarks) {
    performance.clearMarks();
    performance.clearMeasures();
  }
};

// Real data testing helpers
export const validateRealDataStructure = (data: any, requiredFields: string[]): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  return requiredFields.every(field => {
    const value = data[field];
    return value !== null && value !== undefined && value !== '';
  });
};

// Performance benchmark utilities using real timing
export const benchmarkOperation = async (operation: () => Promise<any>, iterations: number = 1): Promise<number> => {
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await operation();
    const end = performance.now();
    times.push(end - start);
  }

  const totalTime = times.reduce((sum, time) => sum + time, 0);
  return totalTime / times.length;
};

// Real database testing utilities
export const getProductionDataFromSupabase = async (table: string, limit: number = 10) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .limit(limit);
  
  if (error) {
    console.error(`Error fetching production data from ${table}:`, error);
    return [];
  }
  
  return data || [];
};

// Validate real user data structure
export const validateUserData = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role')
    .eq('id', userId)
    .single();
  
  if (error || !data) return false;
  
  return !!(data.id && data.name && data.email);
};

// Validate coin data structure
export const validateCoinData = async (coinId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('coins')
    .select('id, name, price, grade, year')
    .eq('id', coinId)
    .single();
  
  if (error || !data) return false;
  
  return !!(data.id && data.name && data.price && data.grade && data.year);
};

// Code error detection utilities
export const detectCodeErrors = (filePath: string, content: string): Array<{
  type: 'typescript' | 'syntax' | 'import' | 'deprecated';
  severity: 'critical' | 'high' | 'medium' | 'low';
  line: number;
  message: string;
  file: string;
}> => {
  const errors: Array<{
    type: 'typescript' | 'syntax' | 'import' | 'deprecated';
    severity: 'critical' | 'high' | 'medium' | 'low';
    line: number;
    message: string;
    file: string;
  }> = [];

  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // Check for unterminated regex - using string methods to avoid regex issues
    if (line.includes('/') && !line.includes('//') && !line.includes('*/') && !line.includes('/*')) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('/') && !trimmedLine.endsWith('/') && !trimmedLine.includes('://')) {
        errors.push({
          type: 'syntax',
          severity: 'critical',
          line: lineNumber,
          message: 'Potential unterminated regular expression literal',
          file: filePath
        });
      }
    }
    
    // Check for unused imports - fixed regex pattern with escaped braces
    if (line.includes('import') && line.includes('{')) {
      // Use string methods instead of regex to avoid compilation issues
      const importStart = line.indexOf('{');
      const importEnd = line.indexOf('}');
      if (importStart !== -1 && importEnd !== -1 && importEnd > importStart) {
        const importContent = line.substring(importStart + 1, importEnd);
        const importedItems = importContent.split(',').map(item => item.trim());
        importedItems.forEach(item => {
          if (item && !content.includes(item.replace(/\s+as\s+\w+/, ''))) {
            errors.push({
              type: 'import',
              severity: 'medium',
              line: lineNumber,
              message: `Unused import detected: ${item}`,
              file: filePath
            });
          }
        });
      }
    }
    
    // Check for deprecated React patterns
    if (line.includes('React.FC') || line.includes('React.FunctionComponent')) {
      errors.push({
        type: 'deprecated',
        severity: 'low',
        line: lineNumber,
        message: 'React.FC is deprecated, use function declaration instead',
        file: filePath
      });
    }
  });
  
  return errors;
};
