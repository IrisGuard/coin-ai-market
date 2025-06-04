// Security utilities for input validation and sanitization
export class SecurityUtils {
  // File upload validation
  static validateFileUpload(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      return { isValid: false, error: 'File size exceeds 10MB limit' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
    }

    return { isValid: true };
  }

  // Sanitize text input to prevent XSS
  static sanitizeText(input: string): string {
    return input
      .replace(/[<>"']/g, (char) => {
        const map: { [key: string]: string } = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        };
        return map[char];
      })
      .trim();
  }

  // Validate numeric inputs
  static validateNumber(value: number, min: number = 0, max: number = Number.MAX_SAFE_INTEGER): boolean {
    return typeof value === 'number' && 
           !isNaN(value) && 
           isFinite(value) && 
           value >= min && 
           value <= max;
  }

  // Validate bid amount specifically
  static validateBidAmount(amount: number): { isValid: boolean; error?: string } {
    if (!this.validateNumber(amount, 0.01, 1000000)) {
      return { 
        isValid: false, 
        error: 'Bid amount must be between $0.01 and $1,000,000' 
      };
    }
    return { isValid: true };
  }

  // Validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Rate limiting check (client-side helper)
  static checkClientRateLimit(action: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
    const key = `rate_limit_${action}`;
    const now = Date.now();
    const stored = localStorage.getItem(key);
    
    if (!stored) {
      localStorage.setItem(key, JSON.stringify([now]));
      return true;
    }

    const timestamps = JSON.parse(stored).filter((ts: number) => now - ts < windowMs);
    
    if (timestamps.length >= maxRequests) {
      return false;
    }

    timestamps.push(now);
    localStorage.setItem(key, JSON.stringify(timestamps));
    return true;
  }

  // Remove sensitive data from objects for logging
  static sanitizeForLogging(obj: Record<string, unknown>): Record<string, unknown> {
    const sensitiveKeys = ['password', 'token', 'key', 'secret', 'auth'];
    const sanitized = { ...obj };

    for (const key in sanitized) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
