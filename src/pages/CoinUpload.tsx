
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useSmartUserRole } from '@/hooks/useSmartUserRole';
import EnhancedCoinUploadManager from '@/components/dealer/EnhancedCoinUploadManager';
import { Loader2 } from 'lucide-react';

const CoinUpload = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useSmartUserRole();

  console.log('🚀 CoinUpload page render:', {
    isAuthenticated,
    userId: user?.id,
    userRole,
    authLoading,
    roleLoading
  });

  if (authLoading) {
    console.log('⏳ Auth still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin h-8 w-8 text-electric-blue" />
          <span className="text-electric-blue font-medium">Initializing...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  if (roleLoading) {
    console.log('⏳ Role still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin h-8 w-8 text-electric-blue" />
          <span className="text-electric-blue font-medium">Loading dealer panel...</span>
        </div>
      </div>
    );
  }

  if (userRole !== 'dealer') {
    console.log('❌ User is not a dealer, redirecting to marketplace. Role:', userRole);
    return <Navigate to="/marketplace" replace />;
  }

  console.log('✅ Dealer access granted, rendering upload panel');

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
            <EnhancedCoinUploadManager />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CoinUpload;
