
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Camera, Zap, TrendingUp, Target } from 'lucide-react';
import MobileCoinUploadForm from '@/components/mobile/MobileCoinUploadForm';

const MobileUpload = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-center text-gray-800">
            📱 Mobile Coin Upload
          </h1>
          <p className="text-sm text-gray-600 text-center mt-1">
            AI-Powered • Professional Quality • Instant Listing
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold">2.3s</div>
              <div className="text-xs opacity-90">Avg Analysis</div>
            </div>
            <div>
              <div className="text-lg font-bold">96%</div>
              <div className="text-xs opacity-90">AI Accuracy</div>
            </div>
            <div>
              <div className="text-lg font-bold">1000+</div>
              <div className="text-xs opacity-90">Daily Uploads</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white py-4 border-b"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-6 text-sm">
            <div className="flex items-center gap-2 text-green-600">
              <Camera className="w-4 h-4" />
              <span>Square Frame</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <Zap className="w-4 h-4" />
              <span>AI Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600">
              <TrendingUp className="w-4 h-4" />
              <span>Instant Price</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Upload Interface */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="py-6"
      >
        <MobileCoinUploadForm />
      </motion.div>

      {/* Bottom Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-3"
      >
        <div className="text-center">
          <p className="text-xs opacity-90">
            💡 Pro Tip: Use natural lighting for best AI recognition results
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MobileUpload;
