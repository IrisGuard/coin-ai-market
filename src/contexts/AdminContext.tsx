
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { checkAdminStatus } from '@/utils/adminUtils';

interface AdminContextType {
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  isAdmin: boolean;
  checkAdminStatus: () => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatusInternal = async (): Promise<boolean> => {
    try {
      const isAdminUser = await checkAdminStatus();
      setIsAdmin(isAdminUser);
      
      // If user is admin and authenticated, set admin authentication status
      const { data: { user } } = await supabase.auth.getUser();
      if (user && isAdminUser) {
        setIsAdminAuthenticated(true);
      } else {
        setIsAdminAuthenticated(false);
      }
      
      return isAdminUser;
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setIsAdminAuthenticated(false);
      return false;
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const isAdminUser = await checkAdminStatusInternal();
        if (isAdminUser) {
          setIsAdminAuthenticated(true);
          setIsAdmin(true);
          
          toast({
            title: "Admin Access Granted",
            description: "Welcome to the admin panel",
          });
          return true;
        } else {
          await supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges",
            variant: "destructive",
          });
          return false;
        }
      }
      
      return false;
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const adminLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during admin logout:', error);
    }
    
    setIsAdminAuthenticated(false);
    setIsAdmin(false);
  };

  // Check admin status on mount and auth state changes
  useEffect(() => {
    checkAdminStatusInternal();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await checkAdminStatusInternal();
      } else {
        setIsAdmin(false);
        setIsAdminAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AdminContext.Provider 
      value={{ 
        isAdminAuthenticated, 
        adminLogin, 
        adminLogout, 
        isAdmin,
        checkAdminStatus: checkAdminStatusInternal
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
