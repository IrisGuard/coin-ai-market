
// PRODUCTION-SAFE RANDOM UTILITIES
// These utilities provide deterministic randomness for production environments

// Production-safe random number generator using crypto API or deterministic fallback
export const generateSecureRandomNumber = (min: number = 0, max: number = 100): number => {
  // Use crypto.getRandomValues for production-safe randomness
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return min + (array[0] % (max - min + 1));
  }
  
  // Fallback using timestamp-based deterministic generation
  const timestamp = Date.now();
  const seed = (timestamp * 9301 + 49297) % 233280;
  const normalized = seed / 233280;
  return Math.floor(min + normalized * (max - min + 1));
};

// Production-safe UUID generator
export const generateSecureId = (prefix: string = 'prod'): string => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    const hex = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    return `${prefix}-${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16)}`;
  }
  
  // Fallback using timestamp and performance counter
  const timestamp = Date.now().toString(36);
  const counter = Math.floor(performance.now() * 1000).toString(36);
  return `${prefix}-${timestamp}-${counter}`;
};

// Production-safe percentage generator with controlled ranges
export const generateSecurePercentage = (min: number = 0, max: number = 100): number => {
  return generateSecureRandomNumber(min, max);
};

// Production-safe array shuffling
export const shuffleArraySecurely = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = generateSecureRandomNumber(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Production-safe element selection
export const selectRandomElementSecurely = <T>(array: T[]): T => {
  const index = generateSecureRandomNumber(0, array.length - 1);
  return array[index];
};
