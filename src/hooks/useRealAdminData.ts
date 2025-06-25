
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealExternalSources = () => {
  return useQuery({
    queryKey: ['real-external-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('external_price_sources')
        .select('*')
        .eq('is_active', true)
        .order('priority_score', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching external sources:', error);
        throw error;
      }
      
      return data || [];
    }
  });
};

export const useRealMarketAnalytics = () => {
  return useQuery({
    queryKey: ['real-market-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_analytics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('❌ Error fetching market analytics:', error);
        throw error;
      }
      
      return data || [];
    }
  });
};

export const useRealAICommands = () => {
  return useQuery({
    queryKey: ['real-ai-commands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_commands')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching AI commands:', error);
        throw error;
      }
      
      return data || [];
    }
  });
};

export const useRealAutomationRules = () => {
  return useQuery({
    queryKey: ['real-automation-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching automation rules:', error);
        throw error;
      }
      
      return data || [];
    }
  });
};

export const useRealSystemMetrics = () => {
  return useQuery({
    queryKey: ['real-system-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('❌ Error fetching system metrics:', error);
        throw error;
      }
      
      return data || [];
    }
  });
};

export const useRealPerformanceMetrics = () => {
  return useQuery({
    queryKey: ['real-performance-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_performance_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('❌ Error fetching performance metrics:', error);
        throw error;
      }
      
      return data || [];
    }
  });
};
