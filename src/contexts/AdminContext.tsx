
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AdminContextType {
  isAdmin: boolean;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => Promise<void>;
  checkAdminStatus: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        setIsAdminAuthenticated(false);
        return;
      }

      const { data, error } = await supabase
        .rpc('is_admin_user', { user_id: user.id });

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setIsAdminAuthenticated(false);
        return;
      }

      setIsAdmin(!!data);
      setIsAdminAuthenticated(!!data);
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
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
        password
      });

      if (error) {
        toast({
          title: "Admin Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        const { data: isAdminUser, error: adminError } = await supabase
          .rpc('is_admin_user', { user_id: data.user.id });

        if (adminError || !isAdminUser) {
          await supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: "Admin privileges required",
            variant: "destructive",
          });
          return false;
        }

        setIsAdmin(true);
        setIsAdminAuthenticated(true);
        toast({
          title: "Admin Access Granted",
          description: "Welcome to the admin panel",
        });
        return true;
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
    return false;
  };

  const adminLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setIsAdminAuthenticated(false);
    toast({
      title: "Admin Logged Out",
      description: "You have been logged out from admin panel",
    });
  };

  useEffect(() => {
    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setIsAdmin(false);
          setIsAdminAuthenticated(false);
        } else if (event === 'SIGNED_IN' && session?.user) {
          checkAdminStatus();
        }
      }
    );

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
