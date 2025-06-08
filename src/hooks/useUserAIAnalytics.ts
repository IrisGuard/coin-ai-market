
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserAIAnalytics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-ai-analytics', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Get AI analysis logs for user's coins
      const { data: analysisLogs, error: logsError } = await supabase
        .from('coin_analysis_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (logsError) {
        throw logsError;
      }

      // Get AI recognition cache for user's coins
      const { data: recognitionCache, error: cacheError } = await supabase
        .from('ai_recognition_cache')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (cacheError) {
        throw cacheError;
      }

      // Calculate user-specific metrics
      const totalAnalyses = analysisLogs?.length || 0;
      const avgAccuracy = analysisLogs?.length > 0 
        ? analysisLogs.reduce((sum, log) => sum + log.accuracy_score, 0) / analysisLogs.length * 100
        : 0;
      
      const avgProcessingTime = analysisLogs?.length > 0
        ? analysisLogs.reduce((sum, log) => sum + log.analysis_time, 0) / analysisLogs.length
        : 0;

      return {
        analysisLogs: analysisLogs || [],
        recognitionCache: recognitionCache || [],
        metrics: {
          totalAnalyses,
          avgAccuracy: Math.round(avgAccuracy * 10) / 10,
          avgProcessingTime: Math.round(avgProcessingTime),
          successRate: avgAccuracy,
        }
      };
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000, // 30 seconds
  });
};
