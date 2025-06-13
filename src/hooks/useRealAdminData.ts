
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealAICommands = () => {
  return useQuery({
    queryKey: ['real-ai-commands'],
    queryFn: async () => {
      console.log('🤖 Fetching REAL AI commands from admin database...');
      
      const { data, error } = await supabase
        .from('ai_commands')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching AI commands:', error);
        throw error;
      }
      
      console.log('✅ Real AI commands loaded:', data?.length);
      return data || [];
    }
  });
};

export const useRealAutomationRules = () => {
  return useQuery({
    queryKey: ['real-automation-rules'],
    queryFn: async () => {
      console.log('⚡ Fetching REAL automation rules from admin database...');
      
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching automation rules:', error);
        throw error;
      }
      
      console.log('✅ Real automation rules loaded:', data?.length);
      return data || [];
    }
  });
};

export const useRealExternalSources = () => {
  return useQuery({
    queryKey: ['real-external-sources'],
    queryFn: async () => {
      console.log('🌐 Fetching REAL external price sources from admin database...');
      
      const { data, error } = await supabase
        .from('external_price_sources')
        .select('*')
        .eq('is_active', true)
        .order('priority_score', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching external sources:', error);
        throw error;
      }
      
      console.log('✅ Real external sources loaded:', data?.length);
      return data || [];
    }
  });
};

export const useRealErrorKnowledge = () => {
  return useQuery({
    queryKey: ['real-error-knowledge'],
    queryFn: async () => {
      console.log('🔍 Fetching REAL error knowledge from admin database...');
      
      const { data, error } = await supabase
        .from('error_coins_knowledge')
        .select('*')
        .order('rarity_score', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching error knowledge:', error);
        throw error;
      }
      
      console.log('✅ Real error knowledge loaded:', data?.length);
      return data || [];
    }
  });
};

export const useRealPerformanceMetrics = () => {
  return useQuery({
    queryKey: ['real-performance-metrics'],
    queryFn: async () => {
      console.log('📊 Fetching REAL performance metrics from admin database...');
      
      const { data, error } = await supabase
        .from('ai_performance_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('❌ Error fetching performance metrics:', error);
        throw error;
      }
      
      console.log('✅ Real performance metrics loaded:', data?.length);
      return data || [];
    }
  });
};

export const useRealMarketAnalytics = () => {
  return useQuery({
    queryKey: ['real-market-analytics'],
    queryFn: async () => {
      console.log('📈 Fetching REAL market analytics from admin database...');
      
      const { data, error } = await supabase
        .from('market_analytics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('❌ Error fetching market analytics:', error);
        throw error;
      }
      
      console.log('✅ Real market analytics loaded:', data?.length);
      return data || [];
    }
  });
};
