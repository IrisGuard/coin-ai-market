
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

  static validateFileUpload(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' };
    }
    
    if (file.size > maxSize) {
      return { isValid: false, error: 'File too large. Maximum size is 10MB.' };
    }
    
    return { isValid: true };
  }

  static sanitizeInput(input: string): string {
    return input.replace(/[<>\"']/g, '');
  }
}
