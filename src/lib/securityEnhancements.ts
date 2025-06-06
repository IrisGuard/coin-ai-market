
/**
 * Additional security enhancements and utilities
 * Provides enhanced security features for the application
 */

import { SecurityMonitor } from '@/utils/securityConfig';

/**
 * Enhanced session security
 */
export class SessionSecurity {
  private static readonly SESSION_KEY = 'coin_vision_session';
  private static readonly FINGERPRINT_KEY = 'coin_vision_fingerprint';

  static generateFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Security fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    return btoa(fingerprint);
  }

  static validateSession(): boolean {
    try {
      const storedFingerprint = localStorage.getItem(this.FINGERPRINT_KEY);
      const currentFingerprint = this.generateFingerprint();
      
      if (storedFingerprint && storedFingerprint !== currentFingerprint) {
        SecurityMonitor.getInstance().logSecurityViolation(
          'SESSION',
          'Session fingerprint mismatch detected'
        );
        return false;
      }
      
      if (!storedFingerprint) {
        localStorage.setItem(this.FINGERPRINT_KEY, currentFingerprint);
      }
      
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }

  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.FINGERPRINT_KEY);
  }
}

/**
 * Input sanitization utilities
 */
export class InputSanitizer {
  static sanitizeHtml(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  static sanitizeUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return null;
      }
      return urlObj.toString();
    } catch {
      return null;
    }
  }

  static sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  }

  static validateImageType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return allowedTypes.includes(file.type);
  }
}

/**
 * Rate limiting utilities
 */
export class RateLimiter {
  private static instances = new Map<string, RateLimiter>();
  private requests: number[] = [];

  constructor(private maxRequests: number, private windowMs: number) {}

  static getInstance(key: string, maxRequests: number, windowMs: number): RateLimiter {
    if (!this.instances.has(key)) {
      this.instances.set(key, new RateLimiter(maxRequests, windowMs));
    }
    return this.instances.get(key)!;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      SecurityMonitor.getInstance().logSecurityViolation(
        'RATE_LIMIT',
        `Rate limit exceeded: ${this.requests.length}/${this.maxRequests} requests`
      );
      return false;
    }
    
    this.requests.push(now);
    return true;
  }

  reset(): void {
    this.requests = [];
  }
}
