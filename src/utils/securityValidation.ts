
export class SecurityValidation {
  private static rateLimits = new Map<string, { count: number; lastReset: number }>();

  static checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const record = this.rateLimits.get(key);
    
    if (!record || (now - record.lastReset) > windowMs) {
      this.rateLimits.set(key, { count: 1, lastReset: now });
      return true;
    }
    
    if (record.count >= maxAttempts) {
      return false;
    }
    
    record.count++;
    return true;
  }

  static validatePassword(password: string): { isValid: boolean; error?: string } {
    if (!password) {
      return { isValid: false, error: 'Password is required' };
    }
    
    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters' };
    }
    
    return { isValid: true };
  }
}
