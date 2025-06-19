
// 🔒 PRODUCTION-ONLY UTILITIES - ZERO MOCK DATA
export const generateSecureRandomId = (): string => {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  // Server-side fallback using timestamp + entropy
  return Date.now().toString(36) + Math.floor(Date.now() * Math.random()).toString(36);
};

export const generateSecureRandomNumber = (min: number, max: number): number => {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const randomValue = array[0] / (0xffffffff + 1);
    return Math.floor(randomValue * (max - min + 1)) + min;
  }
  // Fallback with entropy from timestamp
  const entropy = Date.now() % 1000000;
  const normalized = (entropy * 9301 + 49297) % 233280 / 233280;
  return Math.floor(normalized * (max - min + 1)) + min;
};

export const generateProductionImageHash = (url: string): string => {
  // Production hash generation for images
  const timestamp = Date.now().toString(36);
  const urlHash = btoa(url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
  return `prod_${timestamp}_${urlHash}`;
};

export const getProductionTimestamp = (): string => {
  return new Date().toISOString();
};

export const generateSecureSessionId = (): string => {
  return `session_${Date.now()}_${generateSecureRandomId().substring(0, 8)}`;
};
