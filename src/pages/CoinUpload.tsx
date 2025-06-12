
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdvancedDealerUploadPanel from '@/components/dealer/AdvancedDealerUploadPanel';

const CoinUpload = () => {
  const { isAuthenticated, user } = useAuth();

  // Check user role with fallback for new dealers
  const { data: userRole, isLoading, error } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) {
        // If profile doesn't exist yet (new user), check raw metadata
        if (error.code === 'PGRST116') {
          return user.user_metadata?.role || null;
        }
        throw error;
      }
      return data?.role;
    },
    enabled: !!user?.id,
    retry: (failureCount, error: any) => {
      // Don't retry if it's a profile not found error for new users
      if (error?.code === 'PGRST116') return false;
      return failureCount < 3;
    }
  });

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-electric-blue border-t-transparent rounded-full"></div>
          <span className="text-electric-blue font-medium">Loading dealer panel...</span>
        </div>
      </div>
    );
  }

  // Check if user is dealer (from profile or metadata)
  const isDealerFromProfile = userRole === 'dealer';
  const isDealerFromMetadata = user?.user_metadata?.role === 'dealer';
  const isDealer = isDealerFromProfile || isDealerFromMetadata;

  // Redirect non-dealers to marketplace
  if (!isDealer && !error) {
    return <Navigate to="/marketplace" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="relative overflow-hidden pt-20">
        <div className="mesh-bg"></div>
        
        <div className="max-w-7xl mx-auto container-padding section-spacing relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <AdvancedDealerUploadPanel />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CoinUpload;
