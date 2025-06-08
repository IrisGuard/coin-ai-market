
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  checkAdminStatus: () => Promise<void>;
  verifyAdminAccess: () => Promise<boolean>;
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
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
    } catch (error) {
      console.error('Admin check failed:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAdminAccess = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      return !error && !!data;
    } catch (error) {
      console.error('Admin verification failed:', error);
      return false;
    }
  };

  useEffect(() => {
    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading]);

  const value = {
    isAdmin,
    isLoading,
    checkAdminStatus,
    verifyAdminAccess,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
