
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  isAdminAuthenticated: boolean;
  checkAdminStatus: () => Promise<void>;
  verifyAdminAccess: () => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
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
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setIsAdminAuthenticated(false);
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
        setIsAdminAuthenticated(false);
      } else {
        const adminStatus = !!data;
        setIsAdmin(adminStatus);
        setIsAdminAuthenticated(adminStatus);
      }
    } catch (error) {
      console.error('Admin check failed:', error);
      setIsAdmin(false);
      setIsAdminAuthenticated(false);
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

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Authentication Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        // Check if user is admin
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .eq('role', 'admin')
          .single();

        if (roleError || !roleData) {
          toast({
            title: "Access Denied",
            description: "Admin privileges required",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          return false;
        }

        setIsAdminAuthenticated(true);
        setIsAdmin(true);
        
        toast({
          title: "Admin Access Granted",
          description: "Welcome to the admin panel",
        });
        return true;
      }
    } catch (error) {
      console.error('Admin login failed:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }

    return false;
  };

  useEffect(() => {
    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading]);

  const value = {
    isAdmin,
    isLoading,
    isAdminAuthenticated,
    checkAdminStatus,
    verifyAdminAccess,
    adminLogin,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
