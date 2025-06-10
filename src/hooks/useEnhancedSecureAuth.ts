import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EnhancedInputValidation } from '@/utils/enhancedInputValidation';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LoginAttempt {
  timestamp: number;
  success: boolean;
  ip?: string;
  userAgent?: string;
}

interface SecurityEvent {
  type: string;
  timestamp: number;
  details: any;
}

export const useEnhancedSecureAuth = () => {
  const auth = useAuth();
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [sessionFingerprint, setSessionFingerprint] = useState<string>('');
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes
  const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

  // Generate enhanced session fingerprint
  const generateSessionFingerprint = useCallback(() => {
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
      canvas.toDataURL(),
      navigator.hardwareConcurrency || 0,
      navigator.maxTouchPoints || 0
    ].join('|');
    
    return btoa(fingerprint);
  }, []);

  // Enhanced security event logging
  const logSecurityEvent = useCallback(async (type: string, details: any = {}) => {
    const event: SecurityEvent = {
      type,
      timestamp: Date.now(),
      details: {
        ...details,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        sessionFingerprint: sessionFingerprint.substring(0, 10) + '...'
      }
    };

    setSecurityEvents(prev => [...prev.slice(-9), event]); // Keep last 10 events

    // Log to Supabase for admin monitoring
    try {
      await supabase.rpc('log_production_error', {
        error_type: `security_${type}`,
        error_message: `Security event: ${type}`,
        error_context: event.details
      });
    } catch (error) {
      console.warn('Failed to log security event:', error);
    }
  }, [sessionFingerprint]);

  // Check for session anomalies
  useEffect(() => {
    const storedFingerprint = sessionStorage.getItem('sessionFingerprint');
    const currentFingerprint = generateSessionFingerprint();
    
    if (storedFingerprint && storedFingerprint !== currentFingerprint) {
      logSecurityEvent('session_fingerprint_mismatch', {
        stored: storedFingerprint.substring(0, 10) + '...',
        current: currentFingerprint.substring(0, 10) + '...'
      });
      
      toast({
        title: "Security Alert",
        description: "Session fingerprint mismatch detected. Please re-authenticate.",
        variant: "destructive",
      });
      
      auth.logout();
    } else if (!storedFingerprint) {
      sessionStorage.setItem('sessionFingerprint', currentFingerprint);
    }
    
    setSessionFingerprint(currentFingerprint);
  }, [generateSessionFingerprint, logSecurityEvent, auth]);

  // Check for account lockout
  useEffect(() => {
    const lockoutData = localStorage.getItem('authLockout');
    if (lockoutData) {
      const { timestamp, attempts: storedAttempts } = JSON.parse(lockoutData);
      if (Date.now() - timestamp < LOCKOUT_DURATION && storedAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setLockoutTime(timestamp + LOCKOUT_DURATION);
      }
    }
  }, []);

  // Session timeout monitoring
  useEffect(() => {
    const checkSessionTimeout = () => {
      const lastActivity = localStorage.getItem('lastActivity');
      if (lastActivity && Date.now() - parseInt(lastActivity) > SESSION_TIMEOUT) {
        logSecurityEvent('session_timeout', { lastActivity });
        auth.logout();
        toast({
          title: "Session Expired",
          description: "Your session has expired due to inactivity. Please log in again.",
          variant: "destructive",
        });
      }
    };

    const interval = setInterval(checkSessionTimeout, 60000); // Check every minute
    const updateActivity = () => localStorage.setItem('lastActivity', Date.now().toString());
    
    // Update activity on user interaction
    document.addEventListener('mousedown', updateActivity);
    document.addEventListener('keydown', updateActivity);
    document.addEventListener('scroll', updateActivity);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', updateActivity);
      document.removeEventListener('keydown', updateActivity);
      document.removeEventListener('scroll', updateActivity);
    };
  }, [auth, logSecurityEvent]);

  const recordLoginAttempt = useCallback((success: boolean, additionalData: any = {}) => {
    const attempt: LoginAttempt = {
      timestamp: Date.now(),
      success,
      userAgent: navigator.userAgent,
      ...additionalData
    };

    const stored = localStorage.getItem('loginAttempts');
    const attempts: LoginAttempt[] = stored ? JSON.parse(stored) : [];
    attempts.push(attempt);

    // Keep only recent attempts
    const recentAttempts = attempts.filter(
      a => Date.now() - a.timestamp < LOCKOUT_DURATION
    );

    localStorage.setItem('loginAttempts', JSON.stringify(recentAttempts));
    setLoginAttempts(recentAttempts);

    if (!success) {
      const recentFailures = recentAttempts.filter(a => !a.success);
      logSecurityEvent('failed_login_attempt', {
        attemptCount: recentFailures.length,
        userAgent: navigator.userAgent
      });

      if (recentFailures.length >= MAX_ATTEMPTS) {
        setIsLocked(true);
        const lockoutTimestamp = Date.now();
        setLockoutTime(lockoutTimestamp + LOCKOUT_DURATION);
        
        localStorage.setItem('authLockout', JSON.stringify({
          timestamp: lockoutTimestamp,
          attempts: recentFailures.length
        }));

        logSecurityEvent('account_locked', {
          attemptCount: recentFailures.length,
          lockoutDuration: LOCKOUT_DURATION
        });

        toast({
          title: "Account Locked",
          description: `Too many failed attempts. Account locked for 30 minutes.`,
          variant: "destructive",
        });
      }
    } else {
      // Clear attempts on successful login
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('authLockout');
      localStorage.setItem('lastActivity', Date.now().toString());
      setLoginAttempts([]);
      setIsLocked(false);
      setLockoutTime(null);
      
      logSecurityEvent('successful_login', {
        sessionFingerprint: sessionFingerprint.substring(0, 10) + '...'
      });
    }
  }, [logSecurityEvent, sessionFingerprint]);

  const secureLogin = useCallback(async (email: string, password: string) => {
    if (isLocked) {
      const timeLeft = lockoutTime ? Math.ceil((lockoutTime - Date.now()) / 60000) : 0;
      throw new Error(`Account is locked. Try again in ${timeLeft} minutes.`);
    }

    // Enhanced rate limiting check
    const rateLimit = EnhancedInputValidation.checkRateLimit('login', 3, 5 * 60 * 1000);
    if (!rateLimit.allowed) {
      logSecurityEvent('rate_limit_exceeded', { 
        action: 'login', 
        retryAfter: rateLimit.retryAfter 
      });
      throw new Error(`Too many login attempts. Please wait ${rateLimit.retryAfter} seconds.`);
    }

    // Validate input
    const emailValidation = EnhancedInputValidation.validateEmail(email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error);
    }

    const passwordValidation = EnhancedInputValidation.validatePassword(password);
    if (!passwordValidation.isValid) {
      logSecurityEvent('weak_password_attempt', { email });
      throw new Error(passwordValidation.error);
    }

    try {
      // Check for leaked passwords (you would integrate with HaveIBeenPwned API here)
      // For now, we'll just check against common passwords
      const commonPasswords = ['password', 'admin', '123456', 'qwerty', 'letmein'];
      if (commonPasswords.includes(password.toLowerCase())) {
        logSecurityEvent('common_password_attempt', { email });
        throw new Error('This password is commonly used and not secure. Please choose a stronger password.');
      }

      await auth.signIn(email, password);
      recordLoginAttempt(true, { email });
    } catch (error) {
      recordLoginAttempt(false, { email, error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }, [auth, isLocked, lockoutTime, recordLoginAttempt, logSecurityEvent]);

  const secureSignup = useCallback(async (email: string, password: string, userData: { fullName: string; username: string }) => {
    // Enhanced input validation
    const emailValidation = EnhancedInputValidation.validateEmail(email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error);
    }

    const passwordValidation = EnhancedInputValidation.validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.error);
    }

    // Sanitize user data
    const sanitizedData = {
      fullName: EnhancedInputValidation.sanitizeUserInput(userData.fullName),
      username: EnhancedInputValidation.sanitizeUserInput(userData.username)
    };

    if (sanitizedData.fullName.length < 2) {
      throw new Error('Full name must be at least 2 characters');
    }

    if (sanitizedData.username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }

    // Check for username availability and suspicious patterns
    if (/^[a-zA-Z0-9_]+$/.test(sanitizedData.username) === false) {
      throw new Error('Username can only contain letters, numbers, and underscores');
    }

    logSecurityEvent('signup_attempt', {
      email,
      username: sanitizedData.username
    });

    return auth.signUp(email, password, sanitizedData);
  }, [auth, logSecurityEvent]);

  const secureSignOut = useCallback(async () => {
    logSecurityEvent('logout', {
      sessionDuration: Date.now() - parseInt(localStorage.getItem('lastActivity') || '0')
    });
    
    // Clear all security-related storage
    localStorage.removeItem('lastActivity');
    localStorage.removeItem('loginAttempts');
    sessionStorage.removeItem('sessionFingerprint');
    sessionStorage.removeItem('csrfToken');
    sessionStorage.removeItem('csrfTokenTime');
    
    await auth.logout();
  }, [auth, logSecurityEvent]);

  return {
    ...auth,
    secureLogin,
    secureSignup,
    secureSignOut,
    isLocked,
    lockoutTime,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - loginAttempts.filter(a => !a.success).length),
    securityEvents,
    sessionFingerprint: sessionFingerprint.substring(0, 10) + '...',
    generateCSRFToken: EnhancedInputValidation.generateCSRFToken,
    validateCSRFToken: EnhancedInputValidation.validateCSRFToken
  };
};
