
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { checkAdminStatus } from '@/utils/adminUtils';
import { toast } from '@/hooks/use-toast';

interface AdminContextType {
  isAdmin: boolean;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  checkAdminStatus: () => Promise<void>;
  updateAdminProfile: (data: { fullName: string; email: string }) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes

  const checkAdminStatusInternal = async () => {
    if (!user || !isAuthenticated) {
      setIsAdmin(false);
      setIsAdminAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Check if user has admin privileges
      const adminStatus = await checkAdminStatus();
      setIsAdmin(adminStatus);

      // Check if admin session is still valid
      const adminSession = localStorage.getItem('adminSession');
      const sessionTime = sessionStorage.getItem('adminSessionTime');
      
      if (adminStatus && adminSession && sessionTime) {
        const sessionStart = parseInt(sessionTime);
        const now = Date.now();
        
        if (now - sessionStart < SESSION_TIMEOUT) {
          setIsAdminAuthenticated(true);
          console.log('Admin session restored and valid');
        } else {
          console.log('Admin session expired, clearing...');
          localStorage.removeItem('adminSession');
          sessionStorage.removeItem('adminSessionTime');
          sessionStorage.removeItem('adminAuthenticated');
          setIsAdminAuthenticated(false);
        }
      } else {
        setIsAdminAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setIsAdminAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAdminProfile = async (data: { fullName: string; email: string }): Promise<boolean> => {
    try {
      // For now, just simulate a successful update
      // In a real app, this would make an API call to update the admin profile
      console.log('Updating admin profile:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile Updated",
        description: "Admin profile has been updated successfully.",
      });
      
      return true;
    } catch (error) {
      console.error('Error updating admin profile:', error);
      toast({
        title: "Error",
        description: "Failed to update admin profile. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    checkAdminStatusInternal();
  }, [user, isAuthenticated]);

  // Monitor admin session timeout
  useEffect(() => {
    if (!isAdminAuthenticated) return;

    const checkSessionTimeout = () => {
      const sessionTime = sessionStorage.getItem('adminSessionTime');
      if (sessionTime) {
        const sessionStart = parseInt(sessionTime);
        const now = Date.now();
        
        if (now - sessionStart >= SESSION_TIMEOUT) {
          console.log('Admin session timeout detected');
          localStorage.removeItem('adminSession');
          sessionStorage.removeItem('adminSessionTime');
          sessionStorage.removeItem('adminAuthenticated');
          setIsAdminAuthenticated(false);
          
          // Force redirect to home
          window.location.href = '/';
        }
      }
    };

    const interval = setInterval(checkSessionTimeout, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [isAdminAuthenticated]);

  const value = {
    isAdmin,
    isAdminAuthenticated,
    isLoading,
    checkAdminStatus: checkAdminStatusInternal,
    updateAdminProfile,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
