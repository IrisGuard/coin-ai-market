
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface AdminContextType {
  isAdmin: boolean;
  isAdminAuthenticated: boolean;
  loading: boolean;
  authenticateAdmin: (password: string) => Promise<boolean>;
  updateAdminProfile: (updates: any) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user has admin role in database
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Check both admin_roles and user_roles tables
        const [adminRoleCheck, userRoleCheck] = await Promise.all([
          supabase
            .from('admin_roles')
            .select('id')
            .eq('user_id', user.id)
            .single(),
          supabase
            .from('user_roles')
            .select('id')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .single()
        ]);

        const hasAdminRole = !adminRoleCheck.error || !userRoleCheck.error;
        setIsAdmin(hasAdminRole);
        
        if (hasAdminRole) {
          console.log('✅ User has admin role in database');
        } else {
          console.log('❌ User does not have admin role');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user?.id]);

  // Check admin authentication session
  useEffect(() => {
    const checkAdminAuth = () => {
      const adminAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
      const sessionTime = sessionStorage.getItem('adminSessionTime');
      
      if (adminAuthenticated && sessionTime) {
        const currentTime = Date.now();
        const timeSinceSession = currentTime - parseInt(sessionTime);
        
        // Check if session is still valid (within 10 minutes)
        if (timeSinceSession <= 10 * 60 * 1000) {
          setIsAdminAuthenticated(true);
          console.log('✅ Admin session is valid');
        } else {
          // Session expired
          sessionStorage.removeItem('adminAuthenticated');
          sessionStorage.removeItem('adminSessionTime');
          sessionStorage.removeItem('adminLastActivity');
          setIsAdminAuthenticated(false);
          console.log('🔒 Admin session expired');
        }
      } else {
        setIsAdminAuthenticated(false);
      }
    };

    checkAdminAuth();
    
    // Check session validity every minute
    const interval = setInterval(checkAdminAuth, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const authenticateAdmin = async (password: string): Promise<boolean> => {
    // Simple password check - in production this should be more secure
    if (password === 'admin123' && isAdmin) {
      const currentTime = Date.now();
      
      // Set session data
      sessionStorage.setItem('adminAuthenticated', 'true');
      sessionStorage.setItem('adminSessionTime', currentTime.toString());
      sessionStorage.setItem('adminLastActivity', currentTime.toString());
      
      setIsAdminAuthenticated(true);
      
      console.log('✅ Admin authentication successful');
      return true;
    }
    
    console.log('❌ Admin authentication failed');
    return false;
  };

  const updateAdminProfile = async (updates: any) => {
    if (!user?.id || !isAdminAuthenticated) {
      throw new Error('Admin authentication required');
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        isAdminAuthenticated,
        loading,
        authenticateAdmin,
        updateAdminProfile,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
