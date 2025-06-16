
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Store {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  user_id: string;
  is_active: boolean;
  verified: boolean;
  created_at: string;
  country?: string;
}

interface AdminStoreContextType {
  selectedStoreId: string | null;
  setSelectedStoreId: (storeId: string | null) => void;
  isAdminUser: boolean;
}

const AdminStoreContext = createContext<AdminStoreContextType | undefined>(undefined);

interface AdminStoreProviderProps {
  children: ReactNode;
}

export const AdminStoreProvider: React.FC<AdminStoreProviderProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [selectedStoreId, setSelectedStoreIdState] = useState<string | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id || authLoading) {
        setIsAdminUser(false);
        return;
      }

      try {
        // Check user_roles table for admin role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();

        if (!roleError && roleData) {
          console.log('✅ AdminStoreContext: User is admin via user_roles');
          setIsAdminUser(true);
          return;
        }

        // Fallback: check user metadata
        if (user.user_metadata?.role === 'admin') {
          console.log('✅ AdminStoreContext: User is admin via metadata');
          setIsAdminUser(true);
          return;
        }

        console.log('❌ AdminStoreContext: User is not admin');
        setIsAdminUser(false);
      } catch (error) {
        console.error('❌ AdminStoreContext: Error checking admin status:', error);
        setIsAdminUser(false);
      }
    };

    checkAdminStatus();
  }, [user?.id, authLoading]);

  const setSelectedStoreId = (storeId: string | null) => {
    setSelectedStoreIdState(storeId);
    // Persist selection to localStorage for admin users only
    if (isAdminUser && user?.id) {
      if (storeId) {
        localStorage.setItem(`admin_selected_store_${user.id}`, storeId);
      } else {
        localStorage.removeItem(`admin_selected_store_${user.id}`);
      }
    }
  };

  // Load persisted store selection on mount for admin users
  useEffect(() => {
    // Only proceed if auth is not loading and user exists
    if (!authLoading && user?.id && isAdminUser) {
      const savedStoreId = localStorage.getItem(`admin_selected_store_${user.id}`);
      if (savedStoreId) {
        setSelectedStoreIdState(savedStoreId);
      }
    }
  }, [isAdminUser, user?.id, authLoading]);

  return (
    <AdminStoreContext.Provider
      value={{
        selectedStoreId,
        setSelectedStoreId,
        isAdminUser
      }}
    >
      {children}
    </AdminStoreContext.Provider>
  );
};

export const useAdminStore = () => {
  const context = useContext(AdminStoreContext);
  if (context === undefined) {
    throw new Error('useAdminStore must be used within an AdminStoreProvider');
  }
  return context;
};
