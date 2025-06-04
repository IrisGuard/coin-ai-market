
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

      const { data } = await supabase
        .from('admin_roles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const adminStatus = !!data;
      setIsAdmin(adminStatus);
      return adminStatus;
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

      const adminStatus = await checkAdminStatus();
      if (adminStatus) {
        setIsAdminAuthenticated(true);
        
        // Log admin login activity
        await supabase.rpc('log_admin_activity', {
          action_type: 'admin_login',
          target_type: 'system',
          details: { timestamp: new Date().toISOString() }
        });

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
    } catch (error) {
      toast({
        title: "Login Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
      return false;
    }
  };

  const adminLogout = async () => {
    try {
      await supabase.rpc('log_admin_activity', {
        action_type: 'admin_logout',
        target_type: 'system',
        details: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      console.error('Error logging admin logout:', error);
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
