
// ANTI-FORBIDDEN DATA PROTECTION SYSTEM
export const PRODUCTION_MODE = true;
export const FORBIDDEN_DATA_BLOCKED = true;

// Forbidden data indicators that are not allowed in production
export const FORBIDDEN_PATTERNS = [
  'Math.random',
  'fake',
  'Fake',
  'dummy',
  'Dummy',
  'test data',
  'placeholder data',
  'sample data',
  'Sample',
  'lorem ipsum',
  'Lorem',
  'user@example.com',
  'john.doe',
  '123-456-7890'
];

// Runtime validation - validates data quality
export const validateNoForbiddenData = (data: any, context: string = 'unknown'): void => {
  if (!PRODUCTION_MODE) return;
  
  const dataString = JSON.stringify(data);
  
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (dataString.includes(pattern)) {
      const error = new Error(`🚨 FORBIDDEN DATA DETECTED IN PRODUCTION: "${pattern}" found in ${context} - SYSTEM BLOCKED FOR SECURITY`);
      console.error('🚨 PRODUCTION SECURITY VIOLATION:', error);
      throw error;
    }
  }
};

// Validate component props for forbidden data
export const validateComponentProps = (props: any, componentName: string): void => {
  validateNoForbiddenData(props, `${componentName} component props`);
};

// Validate API responses for forbidden data
export const validateApiResponse = (response: any, endpoint: string): void => {
  validateNoForbiddenData(response, `API response from ${endpoint}`);
};

// Validate database queries for forbidden data
export const validateDatabaseQuery = (query: any, tableName: string): void => {
  validateNoForbiddenData(query, `Database query for ${tableName}`);
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
  // Fallback for server-side using timestamp-based generation
  const timestamp = Date.now();
  const seed = (timestamp * 9301 + 49297) % 233280;
  const normalized = seed / 233280;
  return Math.floor(min + normalized * (max - min + 1));
};

// ESLint rule configuration for blocking forbidden data
export const forbiddenDataESLintRule = {
  'no-forbidden-in-production': {
    meta: {
      type: 'error',
      docs: { 
        description: 'Forbid questionable data in production',
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
          // Block forbidden string literals
          if (typeof node.value === 'string') {
            for (const pattern of FORBIDDEN_PATTERNS) {
              if (node.value.includes(pattern)) {
                context.report({
                  node,
                  message: `🚨 FORBIDDEN DATA KEYWORD "${pattern}" NOT ALLOWED IN PRODUCTION`
                });
              }
            }
          }
        },
        Identifier(node: any) {
          // Block forbidden variable names
          const forbiddenNames = /^(fake|Fake|dummy|Dummy|test|Test|sample|Sample).*$/;
          if (forbiddenNames.test(node.name)) {
            context.report({
              node,
              message: `🚨 FORBIDDEN VARIABLE NAME "${node.name}" NOT ALLOWED IN PRODUCTION`
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
      validateNoForbiddenData(arg, `${context} argument ${index}`);
    });
    
    const result = fn(...args);
    
    // Validate result
    if (result && typeof result === 'object') {
      validateNoForbiddenData(result, `${context} return value`);
    }
    
    return result;
  }) as T;
};

// Simple production monitor (without console.log override)
export const initializeProductionMonitor = (): void => {
  if (!PRODUCTION_MODE) return;
  
  console.warn('🛡️ Production Data Monitor initialized');
  console.warn('🚨 Zero tolerance for forbidden data in production');
};
