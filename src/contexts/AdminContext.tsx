
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { verifyAdminAccess, logSecurityEvent } from '@/utils/supabaseSecurityHelpers';

interface AdminContextType {
  isAdmin: boolean;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  checkAdminStatus: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminStatus = async () => {
    try {
      setIsLoading(true);
      const hasAdminAccess = await verifyAdminAccess();
      setIsAdmin(hasAdminAccess);
      setIsAdminAuthenticated(hasAdminAccess);
      
      if (hasAdminAccess) {
        await logSecurityEvent('admin_access_verified');
      }
    } catch (error) {
      console.error('Admin status check failed:', error);
      setIsAdmin(false);
      setIsAdminAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // First authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        await logSecurityEvent('admin_login_failed', { email, error: error.message });
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      // Then verify admin status
      const hasAdminAccess = await verifyAdminAccess();
      
      if (!hasAdminAccess) {
        await supabase.auth.signOut();
        await logSecurityEvent('admin_privilege_denied', { email });
        toast({
          title: "Access Denied",
          description: "Admin privileges required",
          variant: "destructive",
        });
        return false;
      }

      setIsAdmin(true);
      setIsAdminAuthenticated(true);
      
      await logSecurityEvent('admin_login_success', { email });
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the admin panel",
      });
      
      return true;
    } catch (error) {
      console.error('Admin login error:', error);
      await logSecurityEvent('admin_login_error', { email, error });
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogout = async () => {
    try {
      await logSecurityEvent('admin_logout');
      await supabase.auth.signOut();
      setIsAdmin(false);
      setIsAdminAuthenticated(false);
      toast({
        title: "Logged Out",
        description: "Admin session ended",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    checkAdminStatus();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        setIsAdminAuthenticated(false);
      } else if (event === 'SIGNED_IN' && session) {
        await checkAdminStatus();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AdminContext.Provider value={{
      isAdmin,
      isAdminAuthenticated,
      isLoading,
      adminLogin,
      adminLogout,
      checkAdminStatus
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
