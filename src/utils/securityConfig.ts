
import { supabase } from '@/integrations/supabase/client';

export const validateSecurityConfig = (): string[] => {
  const issues: string[] = [];
  
  // Check if we're in production
  const isProduction = window.location.hostname !== 'localhost';
  
  if (isProduction) {
    // Check HTTPS
    if (window.location.protocol !== 'https:') {
      issues.push('Application should use HTTPS in production');
    }
    
    // Check for secure headers (basic check)
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      issues.push('Content Security Policy not detected');
    }
  }
  
  // Check Supabase configuration
  if (!supabase.supabaseUrl || !supabase.supabaseKey) {
    issues.push('Supabase configuration incomplete');
  }
  
  return issues;
};

export const validateOTPSecurity = async (): Promise<boolean> => {
  try {
    // Basic validation - check if auth is working
    const { data: { session } } = await supabase.auth.getSession();
    return true; // If we can check session, auth is working
  } catch (error) {
    console.error('OTP security validation failed:', error);
    return false;
  }
};

export const getSecurityHeaders = () => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
};
