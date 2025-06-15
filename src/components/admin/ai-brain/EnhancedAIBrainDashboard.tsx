import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Settings, TrendingUp, Globe } from 'lucide-react';
import AIBrainStats from './AIBrainStats';
import AICommandsSection from './AICommandsSection';
import AutomationRulesSection from './AutomationRulesSection';
import PredictionModelsSection from './PredictionModelsSection';
import SiteManagementSection from './SiteManagementSection';

const EnhancedAIBrainDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold">AI Brain Dashboard</h2>
            <p className="text-muted-foreground">
              Advanced AI command center and automation hub
            </p>
          </div>
        </div>
        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
          Production Ready
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="commands" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            AI Commands
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="sites" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Site Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AIBrainStats />
        </TabsContent>

        <TabsContent value="commands">
          <AICommandsSection />
        </TabsContent>

        <TabsContent value="automation">
          <AutomationRulesSection />
        </TabsContent>

        <TabsContent value="predictions">
          <PredictionModelsSection />
        </TabsContent>

        <TabsContent value="sites">
          <SiteManagementSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAIBrainDashboard;
