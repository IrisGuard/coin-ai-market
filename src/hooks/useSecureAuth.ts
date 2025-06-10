import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SecurityValidation } from '@/utils/securityValidation';
import { toast } from '@/hooks/use-toast';

interface LoginAttempt {
  timestamp: number;
  success: boolean;
  ip?: string;
}

export const useSecureAuth = () => {
  const auth = useAuth();
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  // Check if account is locked
  useEffect(() => {
    const stored = localStorage.getItem('loginAttempts');
    if (stored) {
      const attempts: LoginAttempt[] = JSON.parse(stored);
      const recentFailures = attempts.filter(
        attempt => !attempt.success && Date.now() - attempt.timestamp < LOCKOUT_DURATION
      );

      if (recentFailures.length >= MAX_ATTEMPTS) {
        setIsLocked(true);
        const oldestFailure = Math.min(...recentFailures.map(a => a.timestamp));
        setLockoutTime(oldestFailure + LOCKOUT_DURATION);
      }
    }
  }, []);

  // Clear lockout when time expires
  useEffect(() => {
    if (lockoutTime && Date.now() > lockoutTime) {
      setIsLocked(false);
      setLockoutTime(null);
      localStorage.removeItem('loginAttempts');
    }
  }, [lockoutTime]);

  const recordLoginAttempt = useCallback((success: boolean) => {
    const attempt: LoginAttempt = {
      timestamp: Date.now(),
      success
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
      if (recentFailures.length >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setLockoutTime(Date.now() + LOCKOUT_DURATION);
        toast({
          title: "Account Locked",
          description: `Too many failed attempts. Try again in 15 minutes.`,
          variant: "destructive",
        });
      }
    } else {
      // Clear attempts on successful login
      localStorage.removeItem('loginAttempts');
      setLoginAttempts([]);
      setIsLocked(false);
      setLockoutTime(null);
    }
  }, []);

  const secureLogin = useCallback(async (email: string, password: string) => {
    if (isLocked) {
      const timeLeft = lockoutTime ? Math.ceil((lockoutTime - Date.now()) / 60000) : 0;
      throw new Error(`Account is locked. Try again in ${timeLeft} minutes.`);
    }

    // Rate limiting check
    if (!SecurityValidation.checkRateLimit('login', 3, 5 * 60 * 1000)) {
      throw new Error('Too many login attempts. Please wait 5 minutes.');
    }

    // Validate input
    const emailValidation = SecurityValidation.validateEmail(email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error);
    }

    try {
      await auth.signIn(email, password);
      recordLoginAttempt(true);
    } catch (error) {
      recordLoginAttempt(false);
      throw error;
    }
  }, [auth, isLocked, lockoutTime, recordLoginAttempt]);

  const secureSignup = useCallback(async (email: string, password: string, userData: { fullName: string; username: string }) => {
    // Validate all inputs
    const emailValidation = SecurityValidation.validateEmail(email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error);
    }

    const passwordValidation = SecurityValidation.validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.error);
    }

    // Sanitize user data
    const sanitizedData = {
      fullName: SecurityValidation.sanitizeUserInput(userData.fullName),
      username: SecurityValidation.sanitizeUserInput(userData.username)
    };

    if (sanitizedData.fullName.length < 2) {
      throw new Error('Full name must be at least 2 characters');
    }

    if (sanitizedData.username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }

    return auth.signUp(email, password, sanitizedData);
  }, [auth]);

  return {
    ...auth,
    secureLogin,
    secureSignup,
    isLocked,
    lockoutTime,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - loginAttempts.filter(a => !a.success).length)
  };
};
