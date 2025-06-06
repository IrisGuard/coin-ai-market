
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Camera, Zap, TrendingUp, Target, Upload, BarChart3, WifiOff, Wifi, Clock, Users, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import MobileCoinUploadForm from '@/components/mobile/MobileCoinUploadForm';
import BulkCoinUploadManager from '@/components/mobile/BulkCoinUploadManager';
import OfflineStatusIndicator from '@/components/mobile/OfflineStatusIndicator';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { supabase } from '@/integrations/supabase/client';

interface MobileStats {
  avgAnalysisTime: number;
  aiAccuracy: number;
  dailyUploads: number;
  userUploadsToday: number;
  offlineQueue: number;
  isLoading: boolean;
}

const MobileUpload = () => {
  const { isAuthenticated, user } = useAuth();
  const { isOnline, pendingItems } = useOfflineSync();
  const [activeTab, setActiveTab] = useState('single');
  const [mobileStats, setMobileStats] = useState<MobileStats>({
    avgAnalysisTime: 0,
    aiAccuracy: 0,
    dailyUploads: 0,
    userUploadsToday: 0,
    offlineQueue: 0,
    isLoading: true
  });

  // Fetch real mobile statistics from database
  useEffect(() => {
    const fetchMobileStats = async () => {
      if (!user?.id) return;

      try {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        // Get analysis performance data
        const { data: analysisData } = await supabase
          .from('coin_analysis_logs')
          .select('analysis_time, accuracy_score')
          .gte('created_at', yesterday)
          .eq('analysis_type', 'mobile');

        // Get today's total uploads
        const { data: todayUploads, count: todayCount } = await supabase
          .from('coins')
          .select('id', { count: 'exact' })
          .gte('created_at', `${today}T00:00:00Z`);

        // Get user's uploads today
        const { data: userUploads, count: userCount } = await supabase
          .from('coins')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .gte('created_at', `${today}T00:00:00Z`);

        // Calculate statistics
        let avgTime = 0;
        let avgAccuracy = 0;
        
        if (analysisData && analysisData.length > 0) {
          avgTime = analysisData.reduce((sum, stat) => sum + (stat.analysis_time || 0), 0) / analysisData.length;
          avgAccuracy = analysisData.reduce((sum, stat) => sum + (stat.accuracy_score || 0), 0) / analysisData.length;
        }

        setMobileStats({
          avgAnalysisTime: avgTime,
          aiAccuracy: avgAccuracy,
          dailyUploads: todayCount || 0,
          userUploadsToday: userCount || 0,
          offlineQueue: pendingItems.length,
          isLoading: false
        });

      } catch (error) {
        console.error('Error fetching mobile stats:', error);
        setMobileStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchMobileStats();

    // Refresh stats every 30 seconds when online
    const interval = setInterval(() => {
      if (isOnline) {
        fetchMobileStats();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.id, isOnline, pendingItems.length]);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const formatAnalysisTime = (time: number) => {
    if (time === 0) return '--';
    return time < 10 ? `${time.toFixed(1)}s` : `${Math.round(time)}s`;
  };

  const formatAccuracy = (accuracy: number) => {
    if (accuracy === 0) return '--';
    return `${Math.round(accuracy * 100)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">
                Mobile Coin Upload
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <Wifi className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              ) : (
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Offline
                </Badge>
              )}
              {pendingItems.length > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Clock className="w-3 h-3 mr-1" />
                  {pendingItems.length} pending
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center mt-1">
            AI-Powered • Professional Quality • Real-Time Sync
          </p>
        </div>
        
        <OfflineStatusIndicator />
      </div>

      {/* Real Mobile Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4"
      >
        <div className="container mx-auto px-4">
          {mobileStats.isLoading ? (
            <div className="text-center">
              <div className="text-sm opacity-90">Loading stats...</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold">
                    {formatAnalysisTime(mobileStats.avgAnalysisTime)}
                  </div>
                  <div className="text-xs opacity-90">Avg Analysis</div>
                </div>
                <div>
                  <div className="text-lg font-bold">
                    {formatAccuracy(mobileStats.aiAccuracy)}
                  </div>
                  <div className="text-xs opacity-90">AI Accuracy</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{mobileStats.dailyUploads}</div>
                  <div className="text-xs opacity-90">Daily Uploads</div>
                </div>
              </div>
              
              {/* User-specific stats */}
              <div className="flex justify-center gap-4 mt-3">
                {mobileStats.userUploadsToday > 0 && (
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Users className="w-3 h-3 mr-1" />
                    You: {mobileStats.userUploadsToday} uploads today
                  </Badge>
                )}
                {mobileStats.offlineQueue > 0 && (
                  <Badge variant="secondary" className="bg-orange-500/20 text-white">
                    <Clock className="w-3 h-3 mr-1" />
                    {mobileStats.offlineQueue} queued offline
                  </Badge>
                )}
              </div>
            </>
          )}
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
                <span>Auto Compress</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <Zap className="w-4 h-4" />
                <span>AI Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-purple-600">
                <TrendingUp className="w-4 h-4" />
                <span>Offline Sync</span>
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
                <span>Smart Queue</span>
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

      {/* Dynamic Bottom Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-3"
      >
        <div className="text-center">
          <p className="text-xs opacity-90">
            {activeTab === 'single' 
              ? isOnline 
                ? '💡 Connected: Photos upload and analyze instantly'
                : `📱 Offline: ${mobileStats.offlineQueue > 0 ? `${mobileStats.offlineQueue} photos saved locally` : 'Photos saved locally, will sync when online'}`
              : mobileStats.offlineQueue > 0 
                ? `⚡ Bulk: ${mobileStats.offlineQueue} coins queued for upload`
                : '📸 Bulk Tip: Group 2-6 images per coin for optimal processing'
            }
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MobileUpload;
