import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AutonomousSystemStats {
  total_sources: number;
  multi_category_sources: number;
  auto_discovered_sources: number;
  learning_sessions_active: number;
  ai_accuracy_improvement: number;
  global_intelligence_score: number;
  last_discovery_run: string;
  next_discovery_scheduled: string;
  system_status: 'active' | 'learning' | 'discovering' | 'optimizing';
}

interface SourceDiscoveryResult {
  success: boolean;
  total_sources_discovered: number;
  discovery_results: any[];
  timestamp: string;
}

interface AILearningResult {
  success: boolean;
  learning_applied: boolean;
  performance_improvement: number;
  categories_improved: number;
}

export const useAutonomousAISystem = () => {
  // Get autonomous system statistics
  const systemStats = useQuery({
    queryKey: ['autonomous-ai-system-stats'],
    queryFn: async (): Promise<AutonomousSystemStats> => {
      // Get source statistics
      const [sourcesResult, mappingsResult, learningResult, intelligenceResult] = await Promise.all([
        supabase.from('global_coin_sources').select('id, auto_discovered, multi_category_support'),
        supabase.from('source_category_mapping').select('id'),
        supabase.from('ai_learning_sessions').select('id, accuracy_score').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('global_source_intelligence').select('id, confidence_level').order('created_at', { ascending: false }).limit(1)
      ]);

      const sources = sourcesResult.data || [];
      const mappings = mappingsResult.data || [];
      const learningSessions = learningResult.data || [];
      const intelligence = intelligenceResult.data || [];

      const avgAccuracy = learningSessions.length > 0 
        ? learningSessions.reduce((sum, s) => sum + s.accuracy_score, 0) / learningSessions.length 
        : 0.5;

      return {
        total_sources: sources.length,
        multi_category_sources: sources.filter(s => s.multi_category_support).length,
        auto_discovered_sources: sources.filter(s => s.auto_discovered).length,
        learning_sessions_active: learningSessions.length,
        ai_accuracy_improvement: Math.round((avgAccuracy - 0.5) * 100),
        global_intelligence_score: intelligence[0]?.confidence_level || 0.5,
        last_discovery_run: new Date().toISOString(),
        next_discovery_scheduled: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        system_status: 'active'
      };
    },
    refetchInterval: 30000, // Update every 30 seconds
  });

  // Execute autonomous source discovery
  const executeSourceDiscovery = useMutation({
    mutationFn: async (): Promise<SourceDiscoveryResult> => {
      console.log('🚀 Executing autonomous source discovery...');
      
      const { data, error } = await supabase.functions.invoke('autonomous-source-discovery', {
        body: { action: 'discover_all' }
      });

      if (error) {
        console.error('❌ Source discovery error:', error);
        throw new Error(error.message || 'Source discovery failed');
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Source Discovery Complete",
        description: `Discovered ${data.total_sources_discovered} new sources across all categories`,
      });
      systemStats.refetch();
    },
    onError: (error: any) => {
      console.error('❌ Source discovery mutation error:', error);
      toast({
        title: "Discovery Failed",
        description: error.message || "Failed to execute source discovery",
        variant: "destructive",
      });
    },
  });

  // Execute AI learning engine
  const executeAILearning = useMutation({
    mutationFn: async (params?: { category?: string; auto_learn?: boolean }): Promise<AILearningResult> => {
      console.log('🧠 Executing AI learning engine...');
      
      const { data, error } = await supabase.functions.invoke('ai-learning-engine', {
        body: {
          auto_learn: true,
          category: params?.category,
          ...params
        }
      });

      if (error) {
        console.error('❌ AI learning error:', error);
        throw new Error(error.message || 'AI learning failed');
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "AI Learning Complete",
        description: `Performance improved by ${data.performance_improvement}% across ${data.categories_improved} categories`,
      });
      systemStats.refetch();
    },
    onError: (error: any) => {
      console.error('❌ AI learning mutation error:', error);
      toast({
        title: "Learning Failed",
        description: error.message || "Failed to execute AI learning",
        variant: "destructive",
      });
    },
  });

  // Execute global intelligence network
  const executeGlobalIntelligence = useMutation({
    mutationFn: async (action: 'analyze' | 'predict' | 'optimize' | 'discover' = 'analyze') => {
      console.log('🌐 Executing global intelligence network...');
      
      const { data, error } = await supabase.functions.invoke('global-intelligence-network', {
        body: { action }
      });

      if (error) {
        console.error('❌ Global intelligence error:', error);
        throw new Error(error.message || 'Global intelligence failed');
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Intelligence Analysis Complete",
        description: `Global intelligence score: ${Math.round(data.intelligence_score * 100)}%`,
      });
      systemStats.refetch();
    },
    onError: (error: any) => {
      console.error('❌ Global intelligence mutation error:', error);
      toast({
        title: "Intelligence Failed",
        description: error.message || "Failed to execute intelligence analysis",
        variant: "destructive",
      });
    },
  });

  // Get source discovery configurations
  const discoveryConfigs = useQuery({
    queryKey: ['source-discovery-configs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('source_discovery_config')
        .select('*')
        .eq('is_active', true)
        .order('quality_threshold', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Get AI learning performance
  const learningPerformance = useQuery({
    queryKey: ['ai-learning-performance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_learning_performance')
        .select('*')
        .order('last_learning_update', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Get global source intelligence
  const sourceIntelligence = useQuery({
    queryKey: ['global-source-intelligence'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('global_source_intelligence')
        .select('*')
        .order('last_intelligence_update', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });

  return {
    // System statistics
    systemStats,
    discoveryConfigs,
    learningPerformance,
    sourceIntelligence,
    
    // Autonomous operations
    executeSourceDiscovery,
    executeAILearning,
    executeGlobalIntelligence,
    
    // Loading states
    isDiscovering: executeSourceDiscovery.isPending,
    isLearning: executeAILearning.isPending,
    isAnalyzing: executeGlobalIntelligence.isPending,
    
    // System status
    isSystemReady: systemStats.data?.total_sources > 0,
    systemHealthScore: calculateSystemHealth(systemStats.data),
    autonomousCapabilities: {
      source_discovery: true,
      ai_learning: true,
      global_intelligence: true,
      multi_category_support: true,
      real_time_optimization: true
    }
  };
};

function calculateSystemHealth(stats?: AutonomousSystemStats): number {
  if (!stats) return 0;
  
  const sourceScore = Math.min(1, stats.total_sources / 500); // Target: 500 sources
  const categoryScore = Math.min(1, stats.multi_category_sources / stats.total_sources);
  const learningScore = Math.min(1, stats.ai_accuracy_improvement / 50); // Target: 50% improvement
  const intelligenceScore = stats.global_intelligence_score;
  
  return Math.round((sourceScore + categoryScore + learningScore + intelligenceScore) / 4 * 100);
}

export default useAutonomousAISystem;