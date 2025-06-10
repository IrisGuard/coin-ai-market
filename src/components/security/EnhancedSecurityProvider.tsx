
import React, { createContext, useContext, useEffect, useState } from 'react';
import { EnhancedInputValidation } from '@/utils/enhancedInputValidation';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SecurityContextType {
  isSecurityEnabled: boolean;
  validateInput: (input: string) => string;
  validateFile: (file: File) => Promise<{ isValid: boolean; error?: string }>;
  generateCSRFToken: () => string;
  validateCSRFToken: (token: string) => boolean;
  checkRateLimit: (key: string, max?: number, window?: number) => { allowed: boolean; retryAfter?: number };
  logSecurityEvent: (type: string, details?: any) => Promise<void>;
  securityLevel: 'basic' | 'enhanced' | 'maximum';
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useEnhancedSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useEnhancedSecurity must be used within EnhancedSecurityProvider');
  }
  return context;
};

interface EnhancedSecurityProviderProps {
  children: React.ReactNode;
  securityLevel?: 'basic' | 'enhanced' | 'maximum';
}

export const EnhancedSecurityProvider: React.FC<EnhancedSecurityProviderProps> = ({
  children,
  securityLevel = 'enhanced'
}) => {
  const [isSecurityEnabled, setIsSecurityEnabled] = useState(true);

  useEffect(() => {
    // Initialize security monitoring
    const initializeSecurity = async () => {
      try {
        // Configure CSP headers programmatically
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          "connect-src 'self' https://wdgnllgbfvjgurbqhfqb.supabase.co",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "object-src 'none'"
        ].join('; ');
        document.head.appendChild(meta);

        // Initialize security event monitoring
        await logSecurityEvent('security_system_initialized', {
          securityLevel,
          timestamp: new Date().toISOString()
        });

        console.log('🔒 Enhanced Security System Initialized');
      } catch (error) {
        console.error('Failed to initialize security system:', error);
        setIsSecurityEnabled(false);
      }
    };

    initializeSecurity();
  }, [securityLevel]);

  const validateInput = (input: string): string => {
    if (!isSecurityEnabled) return input;
    return EnhancedInputValidation.sanitizeUserInput(input);
  };

  const validateFile = async (file: File): Promise<{ isValid: boolean; error?: string }> => {
    if (!isSecurityEnabled) return { isValid: true };
    return await EnhancedInputValidation.validateFileUpload(file);
  };

  const generateCSRFToken = (): string => {
    return EnhancedInputValidation.generateCSRFToken();
  };

  const validateCSRFToken = (token: string): boolean => {
    return EnhancedInputValidation.validateCSRFToken(token);
  };

  const checkRateLimit = (
    key: string, 
    max: number = 5, 
    window: number = 15 * 60 * 1000
  ): { allowed: boolean; retryAfter?: number } => {
    if (!isSecurityEnabled) return { allowed: true };
    return EnhancedInputValidation.checkRateLimit(key, max, window);
  };

  const logSecurityEvent = async (type: string, details: any = {}): Promise<void> => {
    try {
      const sanitizedDetails = {
        ...details,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        page: window.location.pathname,
        securityLevel
      };

      // Remove sensitive data
      delete sanitizedDetails.password;
      delete sanitizedDetails.token;
      delete sanitizedDetails.key;

      await supabase.rpc('log_production_error', {
        error_type: `security_${type}`,
        error_message: `Security event: ${type}`,
        error_context: sanitizedDetails
      });

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔒 Security Event: ${type}`, sanitizedDetails);
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  const contextValue: SecurityContextType = {
    isSecurityEnabled,
    validateInput,
    validateFile,
    generateCSRFToken,
    validateCSRFToken,
    checkRateLimit,
    logSecurityEvent,
    securityLevel
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};
