
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return false;
      }

      // Check if user has admin role - this will be implemented later with proper RLS
      const { data, error } = await supabase
        .from('admin_roles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        setIsAdmin(false);
        return false;
      }

      setIsAdmin(true);
      return true;
    } catch (error) {
      setIsAdmin(false);
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
        const isAdminUser = await checkAdminStatus();
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

  useEffect(() => {
    checkAdminStatus();
  }, []);

  return (
    <AdminContext.Provider 
      value={{ 
        isAdminAuthenticated, 
        adminLogin, 
        adminLogout, 
        isAdmin,
        checkAdminStatus
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
