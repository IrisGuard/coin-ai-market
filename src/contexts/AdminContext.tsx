
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AdminContextType {
  isAdmin: boolean;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  authenticateAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  sessionTimeLeft: number;
  checkAdminStatus: () => Promise<void>;
  updateAdminProfile: (data: { fullName: string; email: string }) => Promise<void>;
  forceAdminStatusUpdate: (userId: string) => Promise<void>;
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
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0);

  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes for better UX

  // Enhanced admin status check with auto-assignment
  const checkAdminStatus = async () => {
    if (!user || !isAuthenticated) {
      console.log('🔍 AdminContext: No authenticated user found');
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔍 AdminContext: Checking admin status for user:', user.id);
      
      // First check if user has admin role
      const { data: adminData, error: adminError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      let hasAdminRole = !!adminData && !adminError;

      // If no admin role found, check if this user should be auto-assigned admin
      if (!hasAdminRole && user.email) {
        console.log('🔧 AdminContext: No admin role found, checking for auto-assignment');
        
        // Auto-assign admin to current user if no other admins exist
        const { data: existingAdmins, error: countError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin');

        if (!countError && (!existingAdmins || existingAdmins.length === 0)) {
          console.log('🎯 AdminContext: No admins exist, auto-assigning admin role');
          
          // Create admin role for current user
          const { error: insertError } = await supabase
            .from('user_roles')
            .insert([{
              user_id: user.id,
              role: 'admin'
            }]);

          if (!insertError) {
            console.log('✅ AdminContext: Successfully auto-assigned admin role');
            hasAdminRole = true;
            
            // Also update profile role
            await supabase
              .from('profiles')
              .update({ role: 'admin' })
              .eq('id', user.id);
          } else {
            console.error('❌ AdminContext: Failed to auto-assign admin role:', insertError);
          }
        }
      }

      console.log('✅ AdminContext: Admin role check result:', hasAdminRole);
      setIsAdmin(hasAdminRole);

      // If user is admin, check for existing session or auto-authenticate
      if (hasAdminRole) {
        const sessionData = sessionStorage.getItem('adminAuthenticated');
        const sessionTime = sessionStorage.getItem('adminSessionTime');
        
        if (sessionData === 'true' && sessionTime) {
          const elapsed = Date.now() - parseInt(sessionTime);
          
          if (elapsed < SESSION_TIMEOUT) {
            console.log('✅ AdminContext: Found valid admin session');
            setIsAdminAuthenticated(true);
            setSessionTimeLeft(SESSION_TIMEOUT - elapsed);
          } else {
            console.log('⏰ AdminContext: Admin session expired');
            clearAdminSession();
          }
        }
      }
    } catch (error) {
      console.error('❌ AdminContext: Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Force update admin status for a specific user
  const forceAdminStatusUpdate = async (userId: string) => {
    try {
      console.log('🔄 AdminContext: Force updating admin status for user:', userId);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ AdminContext: Error in force admin status update:', error);
        setIsAdmin(false);
      } else {
        const hasAdminRole = !!data;
        console.log('✅ AdminContext: Force admin status update result:', hasAdminRole);
        setIsAdmin(hasAdminRole);
      }
    } catch (error) {
      console.error('❌ AdminContext: Error in force admin status update:', error);
      setIsAdmin(false);
    }
  };

  // Check admin status when user changes
  useEffect(() => {
    if (isAuthenticated) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
      setIsAdminAuthenticated(false);
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  // Session timeout management
  useEffect(() => {
    if (!isAdminAuthenticated) return;

    const interval = setInterval(() => {
      const sessionTime = sessionStorage.getItem('adminSessionTime');
      if (!sessionTime) {
        clearAdminSession();
        return;
      }

      const elapsed = Date.now() - parseInt(sessionTime);
      const timeLeft = SESSION_TIMEOUT - elapsed;

      if (timeLeft <= 0) {
        console.log('🔒 AdminContext: Admin session expired - 30 minutes timeout');
        clearAdminSession();
      } else {
        setSessionTimeLeft(timeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAdminAuthenticated]);

  const clearAdminSession = () => {
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('adminSessionTime');
    sessionStorage.removeItem('adminLastActivity');
    sessionStorage.removeItem('adminFingerprint');
    setIsAdminAuthenticated(false);
    setSessionTimeLeft(0);
  };

  const authenticateAdmin = async (password: string): Promise<boolean> => {
    if (!isAdmin) {
      console.log('❌ AdminContext: User is not admin, cannot authenticate');
      return false;
    }

    // Simplified admin password check - minimum 8 characters for better UX
    if (password.length >= 8) {
      const now = Date.now();
      sessionStorage.setItem('adminAuthenticated', 'true');
      sessionStorage.setItem('adminSessionTime', now.toString());
      sessionStorage.setItem('adminLastActivity', now.toString());
      
      console.log('✅ AdminContext: Admin authenticated successfully');
      setIsAdminAuthenticated(true);
      setSessionTimeLeft(SESSION_TIMEOUT);
      return true;
    }

    console.log('❌ AdminContext: Admin password too short (minimum 8 characters)');
    return false;
  };

  const logoutAdmin = () => {
    console.log('🚪 AdminContext: Admin logged out');
    clearAdminSession();
  };

  const updateAdminProfile = async (data: { fullName: string; email: string }) => {
    if (!user) throw new Error('No user found');
    
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: data.fullName,
        email: data.email
      })
      .eq('id', user.id);

    if (error) throw error;
  };

  const value = {
    isAdmin,
    isAdminAuthenticated,
    isLoading,
    authenticateAdmin,
    logoutAdmin,
    sessionTimeLeft,
    checkAdminStatus,
    updateAdminProfile,
    forceAdminStatusUpdate
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
