
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AdminContextType {
  isAdmin: boolean;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  checkAdminStatus: () => Promise<void>;
  updateAdminProfile: (data: { fullName: string; email: string }) => Promise<void>;
  forceAdminStatusUpdate: (userId: string) => Promise<void>;
  logoutAdmin: () => void;
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

  const checkAdminStatus = async () => {
    if (!user || !isAuthenticated) {
      setIsAdmin(false);
      setIsAdminAuthenticated(false);
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
      
      // Auto-authenticate if admin - no second step needed
      if (hasAdminRole) {
        setIsAdminAuthenticated(true);
      }
    } catch (error) {
      console.error('Admin status check error:', error);
      setIsAdmin(false);
      setIsAdminAuthenticated(false);
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
        setIsAdminAuthenticated(true);
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

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
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
    checkAdminStatus,
    updateAdminProfile,
    forceAdminStatusUpdate,
    logoutAdmin
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
