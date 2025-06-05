
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  isAdminAuthenticated: boolean;
  checkAdminStatus: () => Promise<void>;
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

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const { user } = useAuth();

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setIsAdminAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Use the new secure admin check function
      const { data, error } = await supabase
        .rpc('is_admin_user', { user_id: user.id });

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setIsAdminAuthenticated(false);
      } else {
        const adminStatus = !!data;
        setIsAdmin(adminStatus);
        setIsAdminAuthenticated(adminStatus);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to check admin status';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setIsAdmin(false);
      setIsAdminAuthenticated(false);
    } finally {
      setIsLoading(false);
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
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        await checkAdminStatus();
        return isAdmin;
      }

      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const value = {
    isAdmin,
    isLoading,
    isAdminAuthenticated,
    checkAdminStatus,
    adminLogin,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
