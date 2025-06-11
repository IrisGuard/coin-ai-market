
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  checkAdminStatus: () => Promise<void>;
  updateAdminProfile: (data: { fullName: string; email: string }) => Promise<void>;
  forceRefresh: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminStatus = async () => {
    if (!user || !isAuthenticated) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔍 Checking admin status for user:', user.id);

      // Method 1: Check user_roles table with maybeSingle
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!roleError && roleData) {
        console.log('✅ Admin verified via user_roles table');
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }

      // Method 2: Check with RPC function
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('verify_admin_access_secure', { user_id: user.id });

      if (!rpcError && rpcData) {
        console.log('✅ Admin verified via RPC function');
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }

      // Method 3: Check if user has any admin role (fallback)
      const { data: anyAdminRole, error: anyAdminError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .in('role', ['admin'])
        .limit(1);

      if (!anyAdminError && anyAdminRole && anyAdminRole.length > 0) {
        console.log('✅ Admin verified via fallback check');
        setIsAdmin(true);
      } else {
        console.log('❌ No admin privileges found');
        setIsAdmin(false);
      }

    } catch (error) {
      console.error('❌ Admin status check error:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const forceRefresh = async () => {
    setIsLoading(true);
    await checkAdminStatus();
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

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
    isLoading,
    checkAdminStatus,
    updateAdminProfile,
    forceRefresh
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
