import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  isAdminAuthenticated: boolean;
  checkAdminStatus: () => Promise<void>;
  verifyAdminAccess: () => Promise<boolean>;
  makeCurrentUserAdmin: (adminData: { fullName: string; email: string }) => Promise<boolean>;
  updateAdminProfile: (updates: { fullName?: string; email?: string }) => Promise<boolean>;
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
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setIsAdminAuthenticated(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setIsAdminAuthenticated(false);
      } else {
        const adminStatus = !!data;
        setIsAdmin(adminStatus);
        setIsAdminAuthenticated(adminStatus);
      }
    } catch (error) {
      console.error('Admin check failed:', error);
      setIsAdmin(false);
      setIsAdminAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAdminAccess = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      return !error && !!data;
    } catch (error) {
      console.error('Admin verification failed:', error);
      return false;
    }
  };

  const makeCurrentUserAdmin = async (adminData: { fullName: string; email: string }): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to become an admin",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: adminData.fullName,
          email: adminData.email,
          role: 'admin'
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Add admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'admin'
        })
        .single();

      if (roleError && roleError.code !== '23505') { // Ignore duplicate key error
        throw roleError;
      }

      setIsAdmin(true);
      setIsAdminAuthenticated(true);
      
      toast({
        title: "Success!",
        description: "You are now an administrator",
      });
      
      return true;
    } catch (error: any) {
      console.error('Failed to make user admin:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to create admin',
        variant: "destructive",
      });
      return false;
    }
  };

  const updateAdminProfile = async (updates: { fullName?: string; email?: string }): Promise<boolean> => {
    if (!user || !isAdmin) {
      toast({
        title: "Error",
        description: "Only admins can update their profile",
        variant: "destructive",
      });
      return false;
    }

    try {
      const updateData: any = {};
      if (updates.fullName) updateData.full_name = updates.fullName;
      if (updates.email) updateData.email = updates.email;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your profile has been updated successfully",
      });
      
      return true;
    } catch (error: any) {
      console.error('Failed to update admin profile:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to update profile',
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading]);

  const value = {
    isAdmin,
    isLoading,
    isAdminAuthenticated,
    checkAdminStatus,
    verifyAdminAccess,
    makeCurrentUserAdmin,
    updateAdminProfile,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
