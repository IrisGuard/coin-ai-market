
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Zap, Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AIAnalyticsData {
  totalAnalyses: number;
  successRate: number;
  averageConfidence: number;
  processingTime: number;
  activeProviders: string[];
  errorRate: number;
  dailyAnalyses: { date: string; count: number }[];
  providerPerformance: { provider: string; accuracy: number; speed: number }[];
}

const EnhancedAIAnalytics = () => {
  const [analytics, setAnalytics] = useState<AIAnalyticsData>({
    totalAnalyses: 0,
    successRate: 0,
    averageConfidence: 0,
    processingTime: 0,
    activeProviders: [],
    errorRate: 0,
    dailyAnalyses: [],
    providerPerformance: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = async () => {
    try {
      const { data: recognitionData, error: recognitionError } = await supabase
        .from('ai_recognition_cache')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (recognitionError && recognitionError.code !== 'PGRST116') {
        throw recognitionError;
      }

      const { data: configData, error: configError } = await supabase
        .from('ai_configuration')
        .select('*')
        .single();

      if (configError && configError.code !== 'PGRST116') {
        console.log('No AI configuration found, using defaults');
      }

      const totalAnalyses = recognitionData?.length || 0;
      const successfulAnalyses = recognitionData?.filter(r => (r.confidence_score || 0) > 0.5).length || 0;
      const successRate = totalAnalyses > 0 ? (successfulAnalyses / totalAnalyses) * 100 : 0;
      
      const avgConfidence = recognitionData?.length > 0 
        ? recognitionData.reduce((sum, r) => sum + (r.confidence_score || 0), 0) / recognitionData.length * 100
        : 0;

      const avgProcessingTime = recognitionData?.length > 0
        ? recognitionData.reduce((sum, r) => sum + (r.processing_time_ms || 0), 0) / recognitionData.length
        : 0;

      const activeProviders = [...new Set(
        recognitionData?.flatMap(r => r.sources_consulted || []) || ['custom']
      )];

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const dailyAnalyses = last7Days.map(date => ({
        date,
        count: recognitionData?.filter(r => 
          r.created_at && new Date(r.created_at).toISOString().split('T')[0] === date
        ).length || 0
      }));

      const providerPerformance = activeProviders.map(provider => {
        const providerData = recognitionData?.filter(r => 
          r.sources_consulted?.includes(provider)
        ) || [];
        
        const accuracy = providerData.length > 0 
          ? providerData.reduce((sum, r) => sum + (r.confidence_score || 0), 0) / providerData.length * 100
          : 0;
        
        const speed = providerData.length > 0
          ? providerData.reduce((sum, r) => sum + (r.processing_time_ms || 0), 0) / providerData.length
          : 0;

        return {
          provider,
          accuracy,
          speed
        };
      });

      setAnalytics({
        totalAnalyses,
        successRate,
        averageConfidence: avgConfidence,
        processingTime: avgProcessingTime,
        activeProviders,
        errorRate: 100 - successRate,
        dailyAnalyses,
        providerPerformance
      });

    } catch (error) {
      console.error('Failed to load AI analytics:', error);
      setAnalytics({
        totalAnalyses: 0,
        successRate: 0,
        averageConfidence: 0,
        processingTime: 0,
        activeProviders: [],
        errorRate: 0,
        dailyAnalyses: [],
        providerPerformance: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Brain className="w-8 h-8 animate-pulse text-blue-600" />
            <span className="ml-2">Loading AI Analytics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Analyses</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalAnalyses.toLocaleString()}</p>
              </div>
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-green-600">{analytics.successRate.toFixed(1)}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <Progress value={analytics.successRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                <p className="text-3xl font-bold text-purple-600">{analytics.averageConfidence.toFixed(1)}%</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
            <Progress value={analytics.averageConfidence} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Processing</p>
                <p className="text-3xl font-bold text-orange-600">{analytics.processingTime.toFixed(0)}ms</p>
              </div>
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="providers">AI Providers</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Daily Analysis Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.dailyAnalyses.map((day, index) => (
                  <div key={day.date} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{day.date}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(day.count / Math.max(...analytics.dailyAnalyses.map(d => d.count))) * 100} className="w-32" />
                      <span className="text-sm font-medium">{day.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Active AI Providers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.providerPerformance.map((provider) => (
                  <div key={provider.provider} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{provider.provider}</Badge>
                      <span className="text-sm text-gray-600">Active</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{provider.accuracy.toFixed(1)}% Accuracy</div>
                        <div className="text-xs text-gray-500">{provider.speed.toFixed(0)}ms avg</div>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Error Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Error Rate</span>
                  <span className="text-sm font-medium text-red-600">{analytics.errorRate.toFixed(1)}%</span>
                </div>
                <Progress value={analytics.errorRate} className="bg-red-100" />
                
                <div className="mt-6 space-y-2">
                  <div className="text-sm font-medium">Common Error Types:</div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• Low image quality</div>
                    <div>• Obscure coin varieties</div>
                    <div>• Poor lighting conditions</div>
                    <div>• Network timeouts</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAIAnalytics;
