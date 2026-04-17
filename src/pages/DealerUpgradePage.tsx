
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useSmartUserRole } from '@/hooks/useSmartUserRole';
import Navbar from '@/components/Navbar';
import DealerSubscriptionUpgrade from '@/components/dealer/DealerSubscriptionUpgrade';
import { Loader2 } from 'lucide-react';

const DealerUpgradePage = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useSmartUserRole();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
          <span className="text-primary font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (userRole !== 'dealer') {
    return <Navigate to="/marketplace" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Upgrade Your Store</h1>
            <p className="text-muted-foreground">Choose the perfect plan to enhance your coin dealing experience</p>
          </div>
          
          <DealerSubscriptionUpgrade />
        </div>
      </div>
    </div>
  );
};

export default DealerUpgradePage;
