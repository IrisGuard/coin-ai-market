
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, BarChart3, Target } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MarketIntelligencePanel from '@/components/ai/MarketIntelligencePanel';
import PredictiveAnalytics from '@/components/ai/PredictiveAnalytics';
import TrendAnalyzer from '@/components/ai/TrendAnalyzer';
import { useMarketIntelligence, useAIPredictions } from '@/hooks/useMarketIntelligence';

const Phase17AdvancedAI = () => {
  const { reports, sentiment, trends, isLoading } = useMarketIntelligence();
  const { predictions } = useAIPredictions();

  const isComplete = reports && reports.length > 0 && predictions && predictions.length > 0;

  return (
    <div className="space-y-6">
      {/* Phase 17 Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            Phase 17: Advanced AI Marketplace Intelligence System
            <Badge variant={isComplete ? "default" : "secondary"}>
              {isComplete ? "OPERATIONAL" : "BUILDING"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-purple-600">
                {reports?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">AI Reports</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">
                {predictions?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Predictions</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">
                {trends?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Trend Analysis</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-orange-600">Live</p>
              <p className="text-sm text-muted-foreground">Real-time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI System Tabs */}
      <Tabs defaultValue="intelligence" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="intelligence" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Market Intelligence
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Predictive Analytics
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Trend Analyzer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="intelligence">
          <MarketIntelligencePanel />
        </TabsContent>

        <TabsContent value="predictions">
          <PredictiveAnalytics />
        </TabsContent>

        <TabsContent value="trends">
          <TrendAnalyzer />
        </TabsContent>
      </Tabs>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Phase 17 System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Market Intelligence Engine</span>
              <Badge variant={reports?.length ? "default" : "secondary"}>
                {reports?.length ? "Active" : "Initializing"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Predictive Analytics</span>
              <Badge variant={predictions?.length ? "default" : "secondary"}>
                {predictions?.length ? "Active" : "Building"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Trend Analysis</span>
              <Badge variant={trends?.length ? "default" : "secondary"}>
                {trends?.length ? "Active" : "Analyzing"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span>Real-time Processing</span>
              <Badge variant="default">Live</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Phase17AdvancedAI;
