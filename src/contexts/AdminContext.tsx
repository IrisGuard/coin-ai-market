
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
  checkAdminStatus: () => Promise<void>;
  updateAdminProfile: (data: { fullName: string; email: string }) => Promise<void>;
  forceAdminStatusUpdate: (userId: string) => Promise<void>;
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
  const checkAdminStatus = async () => {
    if (!user) {
      console.log('🔍 AdminContext: No user found, setting isAdmin to false');
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔍 AdminContext: Checking admin status for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ AdminContext: Error checking admin role:', error);
        setIsAdmin(false);
      } else {
        const hasAdminRole = !!data;
        console.log('✅ AdminContext: Admin role check result:', hasAdminRole);
        setIsAdmin(hasAdminRole);
      }
    } catch (error) {
      console.log('❌ AdminContext: User is not admin:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Force update admin status for a specific user (used by AdminLoginForm)
  const forceAdminStatusUpdate = async (userId: string) => {
    try {
      console.log('🔄 AdminContext: Force updating admin status for user:', userId);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ AdminContext: Error in force admin status update:', error);
        setIsAdmin(false);
      } else {
        const hasAdminRole = !!data;
        console.log('✅ AdminContext: Force admin status update result:', hasAdminRole);
        setIsAdmin(hasAdminRole);
      }
    } catch (error) {
      console.error('❌ AdminContext: Error in force admin status update:', error);
      setIsAdmin(false);
    }
  };

  // Check admin status when user changes
  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  // Check for existing admin session
  useEffect(() => {
    const checkExistingSession = () => {
      const sessionData = sessionStorage.getItem('adminAuthenticated');
      const sessionTime = sessionStorage.getItem('adminSessionTime');
      
      if (sessionData === 'true' && sessionTime) {
        const elapsed = Date.now() - parseInt(sessionTime);
        
        if (elapsed < SESSION_TIMEOUT) {
          console.log('✅ AdminContext: Found valid existing admin session');
          setIsAdminAuthenticated(true);
          setSessionTimeLeft(SESSION_TIMEOUT - elapsed);
        } else {
          // Session expired - clear it
          console.log('⏰ AdminContext: Admin session expired, clearing');
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
        console.log('🔒 AdminContext: Admin session expired - EXACTLY 10 minutes');
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
    if (!isAdmin) {
      console.log('❌ AdminContext: User is not admin, cannot authenticate');
      return false;
    }

    // Simple admin password check - minimum 12 characters
    if (password.length >= 12) {
      const now = Date.now();
      sessionStorage.setItem('adminAuthenticated', 'true');
      sessionStorage.setItem('adminSessionTime', now.toString());
      sessionStorage.setItem('adminLastActivity', now.toString());
      
      console.log('✅ AdminContext: Admin authenticated successfully');
      setIsAdminAuthenticated(true);
      setSessionTimeLeft(SESSION_TIMEOUT);
      return true;
    }

    console.log('❌ AdminContext: Admin password too short');
    return false;
  };

  const logoutAdmin = () => {
    console.log('🚪 AdminContext: Admin logged out');
    clearAdminSession();
  };

  const updateAdminProfile = async (data: { fullName: string; email: string }) => {
    if (!user) throw new Error('No user found');
    
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: data.fullName,
        email: data.email
      })
      .eq('id', user.id);

    if (error) throw error;
  };

  const value = {
    isAdmin,
    isAdminAuthenticated,
    isLoading,
    authenticateAdmin,
    logoutAdmin,
    sessionTimeLeft,
    checkAdminStatus,
    updateAdminProfile,
    forceAdminStatusUpdate
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
