
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Globe, CheckCircle, Activity } from 'lucide-react';
import Phase17AdvancedAI from '@/components/admin/enhanced/Phase17AdvancedAI';
import Phase18ProductionOptimization from '@/components/admin/enhanced/Phase18ProductionOptimization';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminSystemPhasesTab = () => {
  // Check Phase 17 status using existing tables
  const { data: phase17Data } = useQuery({
    queryKey: ['phase-17-status'],
    queryFn: async () => {
      const [aiPerformance, marketAnalytics] = await Promise.all([
        supabase.from('ai_performance_metrics').select('id').limit(1),
        supabase.from('market_analytics').select('id').limit(1)
      ]);
      
      return {
        aiPerformance: aiPerformance.data?.length || 0,
        marketAnalytics: marketAnalytics.data?.length || 0
      };
    }
  });

  // Check Phase 18 status
  const { data: phase18Data } = useQuery({
    queryKey: ['phase-18-status'], 
    queryFn: async () => {
      const [systemMetrics, errorLogs] = await Promise.all([
        supabase.from('system_metrics').select('id').limit(1),
        supabase.from('error_logs').select('id').gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ]);
      
      return {
        systemMetrics: systemMetrics.data?.length || 0,
        errorLogs: errorLogs.data?.length || 0
      };
    }
  });

  const phase17Complete = (phase17Data?.aiPerformance || 0) > 0 && (phase17Data?.marketAnalytics || 0) > 0;
  const phase18Complete = (phase18Data?.systemMetrics || 0) > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Advanced System Phases</h2>
          <p className="text-muted-foreground">
            Phase 17-18: Advanced AI Marketplace Intelligence & Global Production Optimization
          </p>
        </div>
      </div>

      {/* Phases Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Phase 17: Advanced AI Intelligence
              <Badge variant={phase17Complete ? "default" : "secondary"}>
                {phase17Complete ? "Complete" : "In Progress"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {phase17Complete ? 
                  <CheckCircle className="w-4 h-4 text-green-600" /> :
                  <Activity className="w-4 h-4 text-blue-600" />
                }
                <span className="text-sm">Market Intelligence System</span>
              </div>
              <div className="flex items-center gap-2">
                {(phase17Data?.aiPerformance || 0) > 0 ? 
                  <CheckCircle className="w-4 h-4 text-green-600" /> :
                  <Activity className="w-4 h-4 text-blue-600" />
                }
                <span className="text-sm">Predictive Analytics Engine</span>
              </div>
              <div className="flex items-center gap-2">
                {(phase17Data?.marketAnalytics || 0) > 0 ? 
                  <CheckCircle className="w-4 h-4 text-green-600" /> :
                  <Activity className="w-4 h-4 text-blue-600" />
                }
                <span className="text-sm">Trend Analysis System</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-600" />
              Phase 18: Production Optimization
              <Badge variant={phase18Complete ? "default" : "secondary"}>
                {phase18Complete ? "Complete" : "In Progress"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">CDN Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Global Load Balancing</span>
              </div>
              <div className="flex items-center gap-2">
                {phase18Complete ? 
                  <CheckCircle className="w-4 h-4 text-green-600" /> :
                  <Activity className="w-4 h-4 text-blue-600" />
                }
                <span className="text-sm">Performance Monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Security Hardening</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phase Tabs */}
      <Tabs defaultValue="phase17" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="phase17" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Phase 17: Advanced AI
          </TabsTrigger>
          <TabsTrigger value="phase18" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Phase 18: Global Optimization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="phase17">
          <Phase17AdvancedAI />
        </TabsContent>

        <TabsContent value="phase18">
          <Phase18ProductionOptimization />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSystemPhasesTab;
