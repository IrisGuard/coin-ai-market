
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Camera, Zap, TrendingUp, Target, Upload, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MobileCoinUploadForm from '@/components/mobile/MobileCoinUploadForm';
import BulkCoinUploadManager from '@/components/mobile/BulkCoinUploadManager';

const MobileUpload = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('single');

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

      {/* Upload Mode Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white py-4 border-b"
      >
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single" className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Single Coin
              </TabsTrigger>
              <TabsTrigger value="bulk" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Bulk Upload
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </motion.div>

      {/* Features Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white py-4 border-b"
      >
        <div className="container mx-auto px-4">
          {activeTab === 'single' ? (
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
          ) : (
            <div className="flex justify-center space-x-6 text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <Upload className="w-4 h-4" />
                <span>Batch Process</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <BarChart3 className="w-4 h-4" />
                <span>Progress Track</span>
              </div>
              <div className="flex items-center gap-2 text-purple-600">
                <Target className="w-4 h-4" />
                <span>100+ Coins/Day</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Upload Interface */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="py-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="single" className="mt-0">
            <MobileCoinUploadForm />
          </TabsContent>
          
          <TabsContent value="bulk" className="mt-0">
            <BulkCoinUploadManager />
          </TabsContent>
        </Tabs>
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
            {activeTab === 'single' 
              ? '💡 Pro Tip: Use natural lighting for best AI recognition results'
              : '⚡ Bulk Tip: Group 2-6 images per coin for optimal processing'
            }
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MobileUpload;
