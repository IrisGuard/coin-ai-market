
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
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0);

  const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour

  const checkAdminStatus = async () => {
    if (!user || !isAuthenticated) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    try {
      const { data: adminData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      const hasAdminRole = !!adminData && !error;
      setIsAdmin(hasAdminRole);

      // Auto-authenticate if admin
      if (hasAdminRole) {
        const sessionData = sessionStorage.getItem('adminAuthenticated');
        if (sessionData === 'true') {
          setIsAdminAuthenticated(true);
          setSessionTimeLeft(SESSION_TIMEOUT);
        }
      }
    } catch (error) {
      console.error('Admin status check error:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const forceAdminStatusUpdate = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      if (!error && data) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Force admin update error:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
      setIsAdminAuthenticated(false);
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  const authenticateAdmin = async (password: string): Promise<boolean> => {
    if (!isAdmin) return false;

    // Simple password check - accept any password 8+ chars for quick access
    if (password.length >= 8) {
      sessionStorage.setItem('adminAuthenticated', 'true');
      sessionStorage.setItem('adminSessionTime', Date.now().toString());
      
      setIsAdminAuthenticated(true);
      setSessionTimeLeft(SESSION_TIMEOUT);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('adminSessionTime');
    setIsAdminAuthenticated(false);
    setSessionTimeLeft(0);
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
