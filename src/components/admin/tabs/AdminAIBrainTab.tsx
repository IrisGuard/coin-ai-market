
import React, { useState } from 'react';
import AIBrainStats from '../ai-brain/AIBrainStats';
import AICommandsSection from '../ai-brain/AICommandsSection';
import AutomationRulesSection from '../ai-brain/AutomationRulesSection';
import PredictionModelsSection from '../ai-brain/PredictionModelsSection';

const AdminAIBrainTab = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">AI Brain Control Center</h3>
          <p className="text-sm text-muted-foreground">Manage AI commands, automation rules, and prediction models</p>
        </div>
      </div>

      <AIBrainStats />
      <AICommandsSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <AutomationRulesSection />
      <PredictionModelsSection />
    </div>
  );
};

export default AdminAIBrainTab;
