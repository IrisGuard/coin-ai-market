
// ANTI-MOCK DATA PROTECTION SYSTEM
export const PRODUCTION_MODE = true;
export const MOCK_DATA_FORBIDDEN = true;

// Mock data indicators that are forbidden in production
export const FORBIDDEN_PATTERNS = [
  'Math.random',
  'mock',
  'Mock',
  'fake',
  'Fake',
  'dummy',
  'Dummy',
  'test data',
  'placeholder',
  'sample',
  'Sample',
  'lorem ipsum',
  'Lorem',
  'user@example.com',
  'john.doe',
  '123-456-7890'
];

// Runtime validation - crashes app if mock data detected
export const validateNoMockData = (data: any, context: string = 'unknown'): void => {
  if (!PRODUCTION_MODE) return;
  
  const dataString = JSON.stringify(data);
  
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (dataString.includes(pattern)) {
      const error = new Error(`🚨 MOCK DATA DETECTED IN PRODUCTION: "${pattern}" found in ${context} - SYSTEM BLOCKED FOR SECURITY`);
      console.error('🚨 PRODUCTION SECURITY VIOLATION:', error);
      throw error;
    }
  }
};

// Validate component props for mock data
export const validateComponentProps = (props: any, componentName: string): void => {
  validateNoMockData(props, `${componentName} component props`);
};

// Validate API responses for mock data
export const validateApiResponse = (response: any, endpoint: string): void => {
  validateNoMockData(response, `API response from ${endpoint}`);
};

// Validate database queries for mock data
export const validateDatabaseQuery = (query: any, tableName: string): void => {
  validateNoMockData(query, `Database query for ${tableName}`);
};

// Production-safe ID generator (replaces Math.random())
export const generateProductionId = (prefix: string = 'prod'): string => {
  const timestamp = Date.now().toString(36);
  const counter = Math.floor(performance.now() * 1000).toString(36);
  return `${prefix}-${timestamp}-${counter}`;
};

// Production-safe random number generator
export const generateProductionNumber = (min: number = 0, max: number = 100): number => {
  // Use crypto.getRandomValues for production-safe randomness
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return min + (array[0] % (max - min + 1));
  }
  // Fallback for server-side
  return min + Math.floor((max - min + 1) * (Date.now() % 1000) / 1000);
};

// ESLint rule configuration for blocking mock data
export const mockDataESLintRule = {
  'no-mock-in-production': {
    meta: {
      type: 'error',
      docs: { 
        description: 'Forbid mock data in production',
        category: 'Best Practices'
      },
      schema: []
    },
    create(context: any) {
      return {
        CallExpression(node: any) {
          // Block Math.random()
          if (node.callee.type === 'MemberExpression' &&
              node.callee.object.name === 'Math' &&
              node.callee.property.name === 'random') {
            context.report({
              node,
              message: '🚨 Math.random() FORBIDDEN IN PRODUCTION - Use generateProductionNumber() instead'
            });
          }
        },
        Literal(node: any) {
          // Block mock string literals
          if (typeof node.value === 'string') {
            for (const pattern of FORBIDDEN_PATTERNS) {
              if (node.value.includes(pattern)) {
                context.report({
                  node,
                  message: `🚨 MOCK DATA KEYWORD "${pattern}" FORBIDDEN IN PRODUCTION`
                });
              }
            }
          }
        },
        Identifier(node: any) {
          // Block mock variable names
          const forbiddenNames = /^(mock|Mock|fake|Fake|dummy|Dummy|test|Test|sample|Sample).*$/;
          if (forbiddenNames.test(node.name)) {
            context.report({
              node,
              message: `🚨 MOCK VARIABLE NAME "${node.name}" FORBIDDEN IN PRODUCTION`
            });
          }
        }
      };
    }
  }
};

// Production data validator decorator
export const withProductionValidation = <T extends (...args: any[]) => any>(
  fn: T,
  context: string
): T => {
  return ((...args: any[]) => {
    // Validate all arguments
    args.forEach((arg, index) => {
      validateNoMockData(arg, `${context} argument ${index}`);
    });
    
    const result = fn(...args);
    
    // Validate result
    if (result && typeof result === 'object') {
      validateNoMockData(result, `${context} return value`);
    }
    
    return result;
  }) as T;
};

// Global mock data monitor
export const initializeProductionMonitor = (): void => {
  if (!PRODUCTION_MODE) return;
  
  console.log('🛡️ Production Mock Data Monitor initialized');
  console.log('🚨 Zero tolerance for mock data in production');
  
  // Monitor global console for mock data logging
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    args.forEach(arg => {
      if (typeof arg === 'string') {
        validateNoMockData(arg, 'console.log output');
      }
    });
    originalLog(...args);
  };
};
