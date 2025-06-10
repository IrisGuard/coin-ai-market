
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
  clearAdminSession: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const SESSION_TIMEOUT = 10 * 60 * 1000; // ΑΚΡΙΒΩΣ 10 λεπτά

  const clearAdminSession = () => {
    console.log('🧹 Clearing admin session completely');
    localStorage.removeItem('adminSession');
    sessionStorage.removeItem('adminSessionTime');
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('adminLastActivity');
    sessionStorage.removeItem('adminFingerprint');
    setIsAdminAuthenticated(false);
  };

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

      // ΑΚΡΙΒΗ έλεγχος session validity
      const adminSession = localStorage.getItem('adminSession');
      const sessionTime = sessionStorage.getItem('adminSessionTime');
      const lastActivity = sessionStorage.getItem('adminLastActivity');
      
      if (adminStatus && adminSession && sessionTime) {
        const sessionStart = parseInt(sessionTime);
        const lastActivityTime = lastActivity ? parseInt(lastActivity) : sessionStart;
        const now = Date.now();
        
        // Έλεγχος και για session start ΚΑΙ για last activity
        const sessionAge = now - sessionStart;
        const inactivityTime = now - lastActivityTime;
        
        if (sessionAge < SESSION_TIMEOUT && inactivityTime < SESSION_TIMEOUT) {
          setIsAdminAuthenticated(true);
          // Update last activity
          sessionStorage.setItem('adminLastActivity', now.toString());
          console.log('✅ Admin session restored and valid');
        } else {
          console.log('⏰ Admin session expired - clearing all session data');
          clearAdminSession();
        }
      } else {
        setIsAdminAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ Error checking admin status:', error);
      setIsAdmin(false);
      setIsAdminAuthenticated(false);
      clearAdminSession();
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

  // Enhanced session monitoring με ακριβή timing
  useEffect(() => {
    if (!isAdminAuthenticated) return;

    const checkSessionTimeout = () => {
      const sessionTime = sessionStorage.getItem('adminSessionTime');
      const lastActivity = sessionStorage.getItem('adminLastActivity');
      
      if (sessionTime) {
        const sessionStart = parseInt(sessionTime);
        const lastActivityTime = lastActivity ? parseInt(lastActivity) : sessionStart;
        const now = Date.now();
        
        const sessionAge = now - sessionStart;
        const inactivityTime = now - lastActivityTime;
        
        if (sessionAge >= SESSION_TIMEOUT || inactivityTime >= SESSION_TIMEOUT) {
          console.log('⏰ Admin session timeout detected - EXACTLY 10 minutes');
          clearAdminSession();
          
          toast({
            title: "Session Expired",
            description: "Your admin session has expired after 10 minutes of inactivity.",
            variant: "destructive",
          });
          
          // Force redirect to home
          window.location.href = '/';
        }
      }
    };

    // Check κάθε 30 δευτερόλεπτα για πιο ακριβή monitoring
    const interval = setInterval(checkSessionTimeout, 30000);
    
    return () => clearInterval(interval);
  }, [isAdminAuthenticated]);

  const value = {
    isAdmin,
    isAdminAuthenticated,
    isLoading,
    checkAdminStatus: checkAdminStatusInternal,
    updateAdminProfile,
    clearAdminSession,
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
