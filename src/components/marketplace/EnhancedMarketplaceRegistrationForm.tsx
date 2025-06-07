
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStore } from '@/hooks/useStores';
import { Navigate } from 'react-router-dom';
import StoreSetupFlow from './StoreSetupFlow';
import { Loader2 } from 'lucide-react';

const EnhancedMarketplaceRegistrationForm = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: store, isLoading: storeLoading, refetch } = useUserStore();

  // Show loading while checking auth and store status
  if (authLoading || storeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-electric-orange" />
          <span className="text-electric-blue">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect non-authenticated users to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If user has a store, redirect to dashboard
  if (store) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show store setup flow for authenticated users without a store
  return (
    <StoreSetupFlow 
      onComplete={() => {
        refetch();
      }} 
    />
  );
};

export default EnhancedMarketplaceRegistrationForm;
