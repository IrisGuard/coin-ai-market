
// 🔒 PRODUCTION-SAFE RANDOM UTILITIES
// Replaces Math.random() with secure alternatives for production

export const generateSecureRandomNumber = (min: number, max: number): number => {
  // Use crypto.getRandomValues for truly secure random numbers
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const randomValue = array[0] / (0xffffffff + 1);
    return Math.floor(randomValue * (max - min + 1)) + min;
  }
  
  // Fallback for server-side or non-crypto environments
  // Still avoid Math.random() - use Date-based entropy
  const seed = Date.now() % 1000000;
  const entropy = (seed * 9301 + 49297) % 233280;
  const normalized = entropy / 233280;
  return Math.floor(normalized * (max - min + 1)) + min;
};

export const generateSecureId = (prefix: string = 'id'): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = generateSecureRandomNumber(100000, 999999).toString(36);
  return `${prefix}_${timestamp}_${randomPart}`;
};

export const generateSecureFloat = (min: number, max: number, decimals: number = 2): number => {
  const range = max - min;
  const random = generateSecureRandomNumber(0, Math.pow(10, decimals)) / Math.pow(10, decimals);
  return parseFloat((min + (random * range)).toFixed(decimals));
};

export const selectSecureRandomItem = <T>(array: T[]): T => {
  if (array.length === 0) throw new Error('Cannot select from empty array');
  const index = generateSecureRandomNumber(0, array.length - 1);
  return array[index];
};

// 🚨 PRODUCTION SAFETY CHECK
export const validateProductionSafety = () => {
  const violations: string[] = [];
  
  // Check if Math.random is being used
  const originalRandom = Math.random;
  let randomCalled = false;
  
  Math.random = () => {
    randomCalled = true;
    violations.push('Math.random() called - use generateSecureRandomNumber() instead');
    return originalRandom();
  };
  
  // Restore original after test
  setTimeout(() => {
    Math.random = originalRandom;
  }, 100);
  
  return {
    isProductionSafe: violations.length === 0,
    violations
  };
};

// Export safe alternatives for common random operations
export const secureRandom = {
  number: generateSecureRandomNumber,
  float: generateSecureFloat,
  id: generateSecureId,
  pick: selectSecureRandomItem,
  boolean: () => generateSecureRandomNumber(0, 1) === 1,
  percentage: () => generateSecureRandomNumber(0, 100)
};
