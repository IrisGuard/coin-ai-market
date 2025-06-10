
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Brain, Key, Settings, Activity } from 'lucide-react';
import AIBrainStats from '../ai-brain/AIBrainStats';
import AICommandsSection from '../ai-brain/AICommandsSection';
import AutomationRulesSection from '../ai-brain/AutomationRulesSection';
import PredictionModelsSection from '../ai-brain/PredictionModelsSection';

interface AIStatsData {
  active_commands: number;
  active_automation_rules: number;
  active_prediction_models: number;
  pending_commands: number;
  executions_24h: number;
  average_prediction_confidence: number;
  automation_rules_executed_24h: number;
}

const AdminAIBrainTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Get AI Brain dashboard stats
  const { data: aiStatsRaw, isLoading: statsLoading } = useQuery({
    queryKey: ['ai-brain-dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_ai_brain_dashboard_stats');
      if (error) throw error;
      return data as unknown as AIStatsData;
    },
    refetchInterval: 30000,
  });

  // Get pending operations count
  const { data: pendingOps } = useQuery({
    queryKey: ['pending-operations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bulk_operations')
        .select('id')
        .eq('status', 'pending');
      
      if (error) throw error;
      return data?.length || 0;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">AI Brain Control Center</h3>
          <p className="text-sm text-muted-foreground">Manage AI commands, automation rules, and prediction models</p>
        </div>
      </div>

      <AIBrainStats aiStatsRaw={aiStatsRaw} pendingOps={pendingOps} />
      <AICommandsSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <AutomationRulesSection />
      <PredictionModelsSection />
    </div>
  );
};

export default AdminAIBrainTab;
