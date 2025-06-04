
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '@/lib/mockApi';
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
      // Mock admin check - in production this would check against real admin roles
      const isAdminUser = localStorage.getItem('mock_admin_authenticated') === 'true';
      setIsAdmin(isAdminUser);
      return isAdminUser;
    } catch (error) {
      setIsAdmin(false);
      return false;
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      // Mock admin login - in production this would verify against real admin credentials
      if (email === 'admin@coinvision.com' && password === 'admin123') {
        setIsAdminAuthenticated(true);
        setIsAdmin(true);
        localStorage.setItem('mock_admin_authenticated', 'true');
        
        toast({
          title: "Admin Access Granted",
          description: "Welcome to the admin panel",
        });
        return true;
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid admin credentials",
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
      localStorage.removeItem('mock_admin_authenticated');
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
