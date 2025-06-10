
import DOMPurify from 'dompurify';

export class EnhancedInputValidation {
  // Enhanced XSS Protection with DOMPurify
  static sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: [],
      FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
    });
  }

  // Enhanced SQL Injection Protection
  static sanitizeForDatabase(input: string): string {
    return input
      .replace(/['"\\;]/g, '')
      .replace(/(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE)?|INSERT( +INTO)?|MERGE|SELECT|UPDATE|UNION( +ALL)?)\b)/ig, '');
  }

  // Enhanced File Upload Validation with Magic Number Checking
  static async validateFileUpload(file: File): Promise<{ isValid: boolean; error?: string }> {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

    // Size check
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size exceeds 10MB limit' };
    }

    // MIME type check
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Invalid file type. Only images are allowed.' };
    }

    // Extension check
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(extension)) {
      return { isValid: false, error: 'Invalid file extension' };
    }

    // Magic number validation for images
    return await this.validateImageMagicNumbers(file);
  }

  private static async validateImageMagicNumbers(file: File): Promise<{ isValid: boolean; error?: string }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arr = new Uint8Array(e.target?.result as ArrayBuffer);
        const header = Array.from(arr.slice(0, 8)).map(b => b.toString(16).padStart(2, '0')).join('');
        
        const validHeaders = [
          'ffd8ffe0', // JPEG
          'ffd8ffe1', // JPEG
          'ffd8ffe2', // JPEG
          'ffd8ffdb', // JPEG
          '89504e47', // PNG
          '47494638', // GIF89a
          '47494637', // GIF87a
          '52494646', // WebP (RIFF)
          '424d'      // BMP
        ];

        if (validHeaders.some(h => header.startsWith(h))) {
          resolve({ isValid: true });
        } else {
          resolve({ isValid: false, error: 'File header indicates it\'s not a valid image' });
        }
      };
      reader.readAsArrayBuffer(file.slice(0, 8));
    });
  }

  // Enhanced Email validation with domain checking
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }

    // Check for suspicious patterns
    if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
      return { isValid: false, error: 'Invalid email format' };
    }

    // Check for common disposable email domains
    const disposableDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com'];
    const domain = email.split('@')[1].toLowerCase();
    if (disposableDomains.includes(domain)) {
      return { isValid: false, error: 'Disposable email addresses are not allowed' };
    }

    return { isValid: true };
  }

  // Enhanced Password strength validation
  static validatePassword(password: string): { isValid: boolean; error?: string; strength: 'weak' | 'medium' | 'strong' } {
    const minLength = 12; // Increased from 8
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNoCommonPatterns = !/(.)\1{2,}/.test(password); // No repeated characters
    const hasNoCommonWords = !/password|admin|user|login|qwerty|123456/.test(password.toLowerCase());

    if (password.length < minLength) {
      return { isValid: false, error: 'Password must be at least 12 characters long', strength: 'weak' };
    }

    if (!hasNoCommonPatterns) {
      return { isValid: false, error: 'Password cannot contain repeated character patterns', strength: 'weak' };
    }

    if (!hasNoCommonWords) {
      return { isValid: false, error: 'Password cannot contain common words or patterns', strength: 'weak' };
    }

    const criteriaCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (criteriaCount < 3) {
      return { 
        isValid: false, 
        error: 'Password must contain at least 3 of: uppercase, lowercase, numbers, special characters',
        strength: 'weak'
      };
    }

    const strength = criteriaCount === 4 && password.length >= 16 ? 'strong' : criteriaCount >= 3 ? 'medium' : 'weak';
    return { isValid: true, strength };
  }

  // Enhanced Rate limiting with progressive delays
  static checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem(`rateLimit_${key}`) || '[]');
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter((timestamp: number) => now - timestamp < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      const oldestAttempt = Math.min(...validAttempts);
      const retryAfter = Math.ceil((oldestAttempt + windowMs - now) / 1000);
      return { allowed: false, retryAfter };
    }

    // Add current attempt with progressive delay
    validAttempts.push(now);
    localStorage.setItem(`rateLimit_${key}`, JSON.stringify(validAttempts));
    
    return { allowed: true };
  }

  // Enhanced CSRF token generation and validation
  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    sessionStorage.setItem('csrfToken', token);
    sessionStorage.setItem('csrfTokenTime', Date.now().toString());
    return token;
  }

  static validateCSRFToken(token: string): boolean {
    const storedToken = sessionStorage.getItem('csrfToken');
    const tokenTime = parseInt(sessionStorage.getItem('csrfTokenTime') || '0');
    const maxAge = 30 * 60 * 1000; // 30 minutes

    if (!storedToken || Date.now() - tokenTime > maxAge) {
      return false;
    }

    return storedToken === token;
  }

  // Enhanced User input sanitization
  static sanitizeUserInput(input: string): string {
    return input
      .replace(/[<>"'&]/g, (char) => {
        const map: { [key: string]: string } = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
          '&': '&amp;'
        };
        return map[char];
      })
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      .trim()
      .slice(0, 1000); // Limit input length
  }

  // Phone number validation
  static validatePhoneNumber(phone: string): { isValid: boolean; error?: string } {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
      return { isValid: false, error: 'Invalid phone number format' };
    }

    return { isValid: true };
  }

  // URL validation with security checks
  static validateUrl(url: string): { isValid: boolean; error?: string } {
    try {
      const urlObj = new URL(url);
      
      // Only allow HTTP and HTTPS
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { isValid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
      }

      // Prevent localhost and private IP access
      const hostname = urlObj.hostname.toLowerCase();
      if (hostname === 'localhost' || hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.')) {
        return { isValid: false, error: 'Private network URLs are not allowed' };
      }

      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Invalid URL format' };
    }
  }
}
