
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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

export const useMobileStats = () => {
  const { user } = useAuth();
  const { isOnline, pendingItems } = useOfflineSync();
  const [stats, setStats] = useState<MobileStats>({
    avgAnalysisTime: 0,
    aiAccuracy: 0,
    dailyUploads: 0,
    userUploadsToday: 0,
    offlineQueue: 0,
    isLoading: true
  });

  const fetchStats = async () => {
    if (!user?.id) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      // Get analysis performance data for mobile uploads
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

      // Calculate averages
      let avgTime = 0;
      let avgAccuracy = 0;
      
      if (analysisData && analysisData.length > 0) {
        avgTime = analysisData.reduce((sum, stat) => sum + (stat.analysis_time || 0), 0) / analysisData.length;
        avgAccuracy = analysisData.reduce((sum, stat) => sum + (stat.accuracy_score || 0), 0) / analysisData.length;
      }

      setStats({
        avgAnalysisTime: avgTime,
        aiAccuracy: avgAccuracy,
        dailyUploads: todayCount || 0,
        userUploadsToday: userCount || 0,
        offlineQueue: pendingItems.length,
        isLoading: false
      });

    } catch (error) {
      console.error('Error fetching mobile stats:', error);
      setStats(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchStats();

    // Refresh stats every 30 seconds when online
    const interval = setInterval(() => {
      if (isOnline) {
        fetchStats();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.id, isOnline, pendingItems.length]);

  const logAnalysis = async (analysisTime: number, accuracyScore: number, coinId?: string) => {
    if (!user?.id) return;

    try {
      await supabase
        .from('coin_analysis_logs')
        .insert({
          user_id: user.id,
          coin_id: coinId || null,
          analysis_time: analysisTime,
          accuracy_score: accuracyScore,
          analysis_type: 'mobile'
        });

      // Refresh stats after logging
      fetchStats();
    } catch (error) {
      console.error('Error logging analysis:', error);
    }
  };

  return {
    stats,
    refreshStats: fetchStats,
    logAnalysis
  };
};
