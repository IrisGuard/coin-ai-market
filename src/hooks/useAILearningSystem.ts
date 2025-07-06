import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AILearningFeedback {
  learningSessionId: string;
  userCorrections: {
    name?: string;
    year?: number;
    country?: string;
    denomination?: string;
    composition?: string;
    grade?: string;
    estimated_value?: number;
    rarity?: string;
    error_types?: string[];
    category?: string;
  };
  accuracyRating: number; // 1-5 scale
  isCorrect: boolean;
}

interface AILearningStats {
  totalSessions: number;
  averageAccuracy: number;
  improvementRate: number;
  categoriesLearned: string[];
  topContributors: {
    user_id: string;
    contribution_score: number;
  }[];
}

export const useAILearningSystem = () => {
  // Submit user feedback to improve AI
  const submitFeedback = useMutation({
    mutationFn: async (feedback: AILearningFeedback) => {
      console.log('📚 Submitting AI learning feedback:', feedback);

      const { data, error } = await supabase
        .from('ai_learning_sessions')
        .update({
          user_corrections: feedback.userCorrections,
          accuracy_score: feedback.accuracyRating / 5, // Convert to 0-1 scale
          learning_applied: true,
          contribution_score: feedback.isCorrect ? 5 : Math.max(1, feedback.accuracyRating)
        })
        .eq('id', feedback.learningSessionId)
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to submit learning feedback:', error);
        throw error;
      }

      // Trigger AI model update if significant feedback received
      if (feedback.accuracyRating >= 4 || !feedback.isCorrect) {
        await supabase.functions.invoke('ai-model-update', {
          body: {
            sessionId: feedback.learningSessionId,
            feedbackType: feedback.isCorrect ? 'positive' : 'negative',
            corrections: feedback.userCorrections
          }
        });
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Feedback Submitted",
        description: "Thank you! Your feedback helps improve AI accuracy for everyone.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Feedback Failed",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Get AI learning statistics
  const learningStats = useQuery({
    queryKey: ['ai-learning-stats'],
    queryFn: async (): Promise<AILearningStats> => {
      const { data, error } = await supabase
        .from('ai_learning_sessions')
        .select('*');

      if (error) throw error;

      const stats: AILearningStats = {
        totalSessions: data.length,
        averageAccuracy: data.reduce((sum, session) => sum + session.accuracy_score, 0) / data.length,
        improvementRate: calculateImprovementRate(data),
        categoriesLearned: [...new Set(data.map(session => session.category))],
        topContributors: getTopContributors(data)
      };

      return stats;
    },
    refetchInterval: 30000, // Update every 30 seconds
  });

  // Get user's learning contribution
  const userContribution = useQuery({
    queryKey: ['user-ai-contribution'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('ai_learning_sessions')
        .select('contribution_score, accuracy_score, category, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        totalContributions: data.length,
        totalScore: data.reduce((sum, session) => sum + session.contribution_score, 0),
        averageAccuracy: data.reduce((sum, session) => sum + session.accuracy_score, 0) / data.length,
        recentSessions: data.slice(0, 10)
      };
    },
    enabled: true
  });

  return {
    submitFeedback,
    learningStats,
    userContribution,
    isSubmittingFeedback: submitFeedback.isPending
  };
};

function calculateImprovementRate(sessions: any[]): number {
  if (sessions.length < 10) return 0;

  // Sort by creation date
  const sorted = sessions.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  
  // Compare first 25% vs last 25%
  const firstQuarter = sorted.slice(0, Math.floor(sorted.length * 0.25));
  const lastQuarter = sorted.slice(-Math.floor(sorted.length * 0.25));
  
  const firstAvg = firstQuarter.reduce((sum, s) => sum + s.accuracy_score, 0) / firstQuarter.length;
  const lastAvg = lastQuarter.reduce((sum, s) => sum + s.accuracy_score, 0) / lastQuarter.length;
  
  return ((lastAvg - firstAvg) / firstAvg) * 100;
}

function getTopContributors(sessions: any[]): { user_id: string; contribution_score: number }[] {
  const contributionMap = new Map<string, number>();
  
  sessions.forEach(session => {
    if (session.user_id) {
      const current = contributionMap.get(session.user_id) || 0;
      contributionMap.set(session.user_id, current + session.contribution_score);
    }
  });
  
  return Array.from(contributionMap.entries())
    .map(([user_id, contribution_score]) => ({ user_id, contribution_score }))
    .sort((a, b) => b.contribution_score - a.contribution_score)
    .slice(0, 10);
}