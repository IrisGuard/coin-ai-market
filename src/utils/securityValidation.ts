
import DOMPurify from 'dompurify';

export class SecurityValidation {
  // XSS Protection with DOMPurify
  static sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  }

  // SQL Injection Protection
  static sanitizeForDatabase(input: string): string {
    return input.replace(/['"\\;]/g, '');
  }

  // File Upload Validation
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
        const header = Array.from(arr.slice(0, 4)).map(b => b.toString(16).padStart(2, '0')).join('');
        
        const validHeaders = [
          'ffd8ffe0', // JPEG
          'ffd8ffe1', // JPEG
          'ffd8ffe2', // JPEG
          '89504e47', // PNG
          '47494638', // GIF
          '52494646'  // WebP (RIFF)
        ];

        if (validHeaders.some(h => header.startsWith(h))) {
          resolve({ isValid: true });
        } else {
          resolve({ isValid: false, error: 'File header indicates it\'s not a valid image' });
        }
      };
      reader.readAsArrayBuffer(file.slice(0, 4));
    });
  }

  // Email validation with additional security checks
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }

    // Check for suspicious patterns
    if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
      return { isValid: false, error: 'Invalid email format' };
    }

    return { isValid: true };
  }

  // Password strength validation
  static validatePassword(password: string): { isValid: boolean; error?: string; strength: 'weak' | 'medium' | 'strong' } {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return { isValid: false, error: 'Password must be at least 8 characters long', strength: 'weak' };
    }

    const criteriaCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (criteriaCount < 3) {
      return { 
        isValid: false, 
        error: 'Password must contain at least 3 of: uppercase, lowercase, numbers, special characters',
        strength: 'weak'
      };
    }

    const strength = criteriaCount === 4 ? 'strong' : criteriaCount === 3 ? 'medium' : 'weak';
    return { isValid: true, strength };
  }

  // Rate limiting helper
  static checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem(`rateLimit_${key}`) || '[]');
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter((timestamp: number) => now - timestamp < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false; // Rate limit exceeded
    }

    // Add current attempt
    validAttempts.push(now);
    localStorage.setItem(`rateLimit_${key}`, JSON.stringify(validAttempts));
    
    return true;
  }

  // Secure CSRF token generation using Crypto API
  static generateCSRFToken(): string {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint32Array(4);
      crypto.getRandomValues(array);
      return Array.from(array, (num) => num.toString(36)).join('');
    }
    
    // Fallback for environments without crypto.getRandomValues
    const timestamp = Date.now().toString(36);
    const randomPart = Math.floor(Math.random() * 1000000).toString(36);
    return `${timestamp}-${randomPart}`;
  }

  static validateCSRFToken(token: string): boolean {
    const storedToken = sessionStorage.getItem('csrfToken');
    return storedToken === token;
  }

  // Sanitize user input for display
  static sanitizeUserInput(input: string): string {
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
}
