
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import CoinUploadHeader from '@/components/upload/CoinUploadHeader';
import CoinUploadFeatures from '@/components/upload/CoinUploadFeatures';
import EnhancedCoinUploadForm from '@/components/upload/EnhancedCoinUploadForm';
import CoinUploadTips from '@/components/upload/CoinUploadTips';

const CoinUpload = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="relative overflow-hidden pt-20">
        <div className="mesh-bg"></div>
        
        <div className="max-w-7xl mx-auto container-padding section-spacing relative z-10">
          <CoinUploadHeader />
          <CoinUploadFeatures />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <EnhancedCoinUploadForm />
            <CoinUploadTips />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CoinUpload;
