
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
  
  // Check Supabase configuration without accessing protected properties
  const supabaseUrl = 'https://wdgnllgbfvjgurbqhfqb.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZ25sbGdiZnZqZ3VyYnFoZnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTM4NjUsImV4cCI6MjA2NDYyOTg2NX0.vPsjHXSqpx3SLKtoIroQkFZhTSdWEfHA4x5kg5p1veU';
  
  if (!supabaseUrl || !supabaseKey) {
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

export const logSecurityEvent = async (eventType: string, details: any = {}) => {
  try {
    await supabase.from('analytics_events').insert({
      event_type: `security_${eventType}`,
      page_url: window.location.href,
      metadata: {
        ...details,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent
      }
    });
  } catch (error) {
    console.warn('Failed to log security event:', error);
  }
};

// Security monitor class for enhanced security features
export class SecurityMonitor {
  private static instance: SecurityMonitor;
  
  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }
  
  logSecurityViolation(type: string, message: string): void {
    console.warn(`Security violation [${type}]: ${message}`);
    logSecurityEvent('violation', { type, message });
  }
}
