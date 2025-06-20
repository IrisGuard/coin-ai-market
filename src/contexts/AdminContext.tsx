
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  adminUser: any;
  setAdminUser: (user: any) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  forceRefresh: () => Promise<void>;
  updateAdminProfile: (data: { fullName?: string; email?: string }) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Query to check if user is admin
  const { data: isAdmin = false, isLoading, refetch } = useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      try {
        // Check user_roles table for admin role
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin');

        if (error) {
          console.error('Error checking admin status:', error);
          return false;
        }

        return roles && roles.length > 0;
      } catch (error) {
        console.error('Error in admin check:', error);
        return false;
      }
    },
    enabled: !!user?.id && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Check for admin session on mount
  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession);
        setAdminUser(session.user);
      } catch (error) {
        console.error('Error parsing admin session:', error);
        localStorage.removeItem('adminSession');
      }
    }
  }, []);

  // Update admin user when user changes
  useEffect(() => {
    if (user && isAdmin) {
      setAdminUser(user);
      // Store admin session
      localStorage.setItem('adminSession', JSON.stringify({ user }));
    } else {
      setAdminUser(null);
      localStorage.removeItem('adminSession');
    }
  }, [user, isAdmin]);

  const forceRefresh = async () => {
    await refetch();
  };

  const updateAdminProfile = async (data: { fullName?: string; email?: string }) => {
    if (!user) throw new Error('No user logged in');

    try {
      // Update auth user metadata
      const updates: any = {};
      if (data.fullName) {
        updates.data = { full_name: data.fullName };
      }
      if (data.email) {
        updates.email = data.email;
      }

      if (Object.keys(updates).length > 0) {
        const { error } = await supabase.auth.updateUser(updates);
        if (error) throw error;
      }

      // Update local admin user state
      const updatedUser = { ...user, ...updates };
      setAdminUser(updatedUser);
      
      // Update stored session
      localStorage.setItem('adminSession', JSON.stringify({ user: updatedUser }));
    } catch (error) {
      console.error('Error updating admin profile:', error);
      throw error;
    }
  };

  const value = {
    isAdmin,
    isLoading,
    adminUser,
    setAdminUser,
    activeTab,
    setActiveTab,
    forceRefresh,
    updateAdminProfile,
  };

  return (
    <AdminContext.Provider value={value}>
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
