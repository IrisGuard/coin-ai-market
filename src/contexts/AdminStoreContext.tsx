
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

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

  // Check if user is admin - using user metadata since profile is not available
  // Add guard to prevent undefined user checks
  const isAdminUser = user?.user_metadata?.role === 'admin' || false;

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
