
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AdminContextType {
  isAdmin: boolean;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  authenticateAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  sessionTimeLeft: number;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0);

  const SESSION_TIMEOUT = 10 * 60 * 1000; // EXACTLY 10 minutes

  // Check if user has admin role
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();

        setIsAdmin(!!data);
      } catch (error) {
        console.log('User is not admin');
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminRole();
  }, [user]);

  // Check for existing admin session ONLY - no auto-authentication
  useEffect(() => {
    const checkExistingSession = () => {
      const sessionData = sessionStorage.getItem('adminAuthenticated');
      const sessionTime = sessionStorage.getItem('adminSessionTime');
      
      if (sessionData === 'true' && sessionTime) {
        const elapsed = Date.now() - parseInt(sessionTime);
        
        if (elapsed < SESSION_TIMEOUT) {
          setIsAdminAuthenticated(true);
          setSessionTimeLeft(SESSION_TIMEOUT - elapsed);
        } else {
          // Session expired - clear it
          clearAdminSession();
        }
      }
    };

    checkExistingSession();
  }, []);

  // Session timeout management
  useEffect(() => {
    if (!isAdminAuthenticated) return;

    const interval = setInterval(() => {
      const sessionTime = sessionStorage.getItem('adminSessionTime');
      if (!sessionTime) {
        clearAdminSession();
        return;
      }

      const elapsed = Date.now() - parseInt(sessionTime);
      const timeLeft = SESSION_TIMEOUT - elapsed;

      if (timeLeft <= 0) {
        console.log('🔒 Admin session expired - EXACTLY 10 minutes');
        clearAdminSession();
      } else {
        setSessionTimeLeft(timeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAdminAuthenticated]);

  const clearAdminSession = () => {
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('adminSessionTime');
    sessionStorage.removeItem('adminLastActivity');
    sessionStorage.removeItem('adminFingerprint');
    setIsAdminAuthenticated(false);
    setSessionTimeLeft(0);
  };

  const authenticateAdmin = async (password: string): Promise<boolean> => {
    if (!isAdmin) return false;

    // Simple admin password check - minimum 12 characters
    if (password.length >= 12) {
      const now = Date.now();
      sessionStorage.setItem('adminAuthenticated', 'true');
      sessionStorage.setItem('adminSessionTime', now.toString());
      sessionStorage.setItem('adminLastActivity', now.toString());
      
      setIsAdminAuthenticated(true);
      setSessionTimeLeft(SESSION_TIMEOUT);
      return true;
    }

    return false;
  };

  const logoutAdmin = () => {
    clearAdminSession();
  };

  const value = {
    isAdmin,
    isAdminAuthenticated,
    isLoading,
    authenticateAdmin,
    logoutAdmin,
    sessionTimeLeft
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
