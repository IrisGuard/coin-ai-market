
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useMobileStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    avgAccuracy: 0.85,
    avgProcessingTime: 1200,
    successRate: 0.92
  });

  const logAnalysis = useCallback(async (processingTime: number, accuracy: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('coin_analysis_logs')
        .insert({
          user_id: user.id,
          analysis_time: processingTime,
          accuracy_score: accuracy,
          analysis_type: 'mobile'
        });

      if (error) throw error;

      // Update local stats
      setStats(prev => ({
        ...prev,
        totalAnalyses: prev.totalAnalyses + 1,
        avgAccuracy: (prev.avgAccuracy + accuracy) / 2,
        avgProcessingTime: (prev.avgProcessingTime + processingTime) / 2
      }));
    } catch (error) {
      console.error('Failed to log analysis:', error);
    }
  }, [user]);

  return {
    stats,
    logAnalysis
  };
};
