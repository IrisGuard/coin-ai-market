
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
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminStatus = async () => {
    // SECURITY: Start with false and strict loading state
    setIsAdmin(false);
    setIsLoading(true);

    // Guard against undefined user
    if (!user?.id || !isAuthenticated || authLoading) {
      console.log('❌ AdminContext: No user, not authenticated, or auth still loading');
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔍 AdminContext: Checking admin status for user:', user.id, user.email);

      // Method 1: Check user_roles table with maybeSingle (most reliable)
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!roleError && roleData) {
        console.log('✅ AdminContext: Admin verified via user_roles table');
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }

      // Method 2: Check with new secure RPC function as backup
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('is_admin_secure');

      if (!rpcError && rpcData === true) {
        console.log('✅ AdminContext: Admin verified via secure RPC function');
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }

      // Method 3: Fallback check for any admin role
      const { data: anyAdminRole, error: anyAdminError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .in('role', ['admin'])
        .limit(1);

      if (!anyAdminError && anyAdminRole && anyAdminRole.length > 0) {
        console.log('✅ AdminContext: Admin verified via fallback check');
        setIsAdmin(true);
      } else {
        console.log('❌ AdminContext: No admin privileges found');
        setIsAdmin(false);
      }

    } catch (error) {
      console.error('❌ AdminContext: Admin status check error:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const forceRefresh = async () => {
    console.log('🔄 AdminContext: Force refreshing admin status');
    setIsLoading(true);
    await checkAdminStatus();
  };

  useEffect(() => {
    // Only check admin status when auth is complete and user exists
    if (!authLoading && isAuthenticated && user?.id) {
      console.log('🔄 AdminContext: User authenticated, checking admin status');
      checkAdminStatus();
    } else {
      console.log('❌ AdminContext: User not authenticated or auth loading, clearing admin status');
      setIsAdmin(false);
      setIsLoading(false);
    }
  }, [user?.id, isAuthenticated, authLoading]);

  const updateAdminProfile = async (data: { fullName: string; email: string }) => {
    if (!user?.id) {
      console.error('❌ No user ID available for admin profile update');
      throw new Error('No user found');
    }
    
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
