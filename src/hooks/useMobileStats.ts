
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MobileStats {
  avgAnalysisTime: number;
  aiAccuracy: number;
  userUploadsToday: number;
  dailyUploads: number;
  offlineQueue: number;
  isLoading: boolean;
}

export const useMobileStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<MobileStats>({
    avgAnalysisTime: 1500,
    aiAccuracy: 0.85,
    userUploadsToday: 0,
    dailyUploads: 0,
    offlineQueue: 0,
    isLoading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setStats(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        // Get user's analysis logs for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data: userLogs } = await supabase
          .from('coin_analysis_logs')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', today.toISOString());

        // Get total uploads today
        const { data: totalLogs } = await supabase
          .from('coin_analysis_logs')
          .select('id')
          .gte('created_at', today.toISOString());

        // Calculate stats
        const userUploadsToday = userLogs?.length || 0;
        const dailyUploads = totalLogs?.length || 0;
        const avgAnalysisTime = userLogs?.length 
          ? userLogs.reduce((sum, log) => sum + log.analysis_time, 0) / userLogs.length
          : 1500;
        const aiAccuracy = userLogs?.length
          ? userLogs.reduce((sum, log) => sum + log.accuracy_score, 0) / userLogs.length
          : 0.85;

        setStats({
          avgAnalysisTime,
          aiAccuracy,
          userUploadsToday,
          dailyUploads,
          offlineQueue: 0, // Will be implemented with offline sync
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching mobile stats:', error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchStats();
  }, [user]);

  const logAnalysis = async (analysisTime: number, accuracy: number) => {
    if (!user) return;

    try {
      await supabase
        .from('coin_analysis_logs')
        .insert({
          user_id: user.id,
          analysis_time: analysisTime,
          accuracy_score: accuracy,
          analysis_type: 'mobile'
        });

      // Update local stats
      setStats(prev => ({
        ...prev,
        userUploadsToday: prev.userUploadsToday + 1,
        dailyUploads: prev.dailyUploads + 1,
        avgAnalysisTime: (prev.avgAnalysisTime + analysisTime) / 2,
        aiAccuracy: (prev.aiAccuracy + accuracy) / 2
      }));
    } catch (error) {
      console.error('Error logging analysis:', error);
    }
  };

  return {
    stats,
    logAnalysis
  };
};
