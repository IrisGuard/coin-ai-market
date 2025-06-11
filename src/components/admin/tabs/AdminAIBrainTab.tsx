
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  // Mock AI Brain stats
  const mockAiStats: AIStatsData = {
    active_commands: 12,
    active_automation_rules: 8,
    active_prediction_models: 6,
    pending_commands: 3,
    executions_24h: 1247,
    average_prediction_confidence: 0.89,
    automation_rules_executed_24h: 156
  };

  const mockPendingOps = 3;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">AI Brain Control Center</h3>
          <p className="text-sm text-muted-foreground">Manage AI commands, automation rules, and prediction models</p>
        </div>
      </div>

      <AIBrainStats aiStatsRaw={mockAiStats} pendingOps={mockPendingOps} />
      <AICommandsSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <AutomationRulesSection />
      <PredictionModelsSection />
    </div>
  );
};

export default AdminAIBrainTab;
