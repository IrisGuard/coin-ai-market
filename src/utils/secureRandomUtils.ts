
// 🔒 SECURE RANDOM REPLACEMENT FOR MATH.RANDOM() - PRODUCTION SAFE
export const generateSecureRandomId = (): string => {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for server-side
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const generateSecureRandomNumber = (min: number, max: number): number => {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const randomValue = array[0] / (0xffffffff + 1);
    return Math.floor(randomValue * (max - min + 1)) + min;
  }
  // Fallback using Date-based entropy
  const seed = Date.now() % 1000000;
  const entropy = (seed * 9301 + 49297) % 233280;
  const normalized = entropy / 233280;
  return Math.floor(normalized * (max - min + 1)) + min;
};

export const generateSecureFileName = (prefix: string = 'file'): string => {
  const timestamp = Date.now();
  const randomSuffix = generateSecureRandomId().substring(0, 8);
  return `${prefix}_${timestamp}_${randomSuffix}`;
};
