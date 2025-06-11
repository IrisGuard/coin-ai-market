
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Target, 
  AlertTriangle, 
  Sparkles,
  DollarSign,
  BarChart3,
  Zap,
  Star
} from 'lucide-react';
import { useEnhancedDashboardStats } from '@/hooks/useEnhancedDashboardStats';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SmartPortfolioAI = () => {
  const { stats, loading } = useEnhancedDashboardStats();
  const [aiAnalysisActive, setAiAnalysisActive] = useState(false);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    aiScore: 0,
    marketTrend: 'neutral',
    riskLevel: 'medium',
    recommendations: 0
  });

  const portfolioMetrics = [
    {
      title: "AI Portfolio Score",
      value: `${(stats.aiAccuracy * 100).toFixed(1)}/100`,
      change: stats.profitPercentage > 0 ? `+${stats.profitPercentage.toFixed(1)}%` : `${stats.profitPercentage.toFixed(1)}%`,
      trend: stats.profitPercentage > 0 ? "up" : "down",
      icon: <Brain className="w-6 h-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Portfolio Value",
      value: `$${stats.totalValue.toLocaleString()}`,
      change: `${stats.profitPercentage > 0 ? '+' : ''}${stats.profitPercentage.toFixed(1)}%`,
      trend: stats.profitPercentage > 0 ? "up" : "down",
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Growth Potential",
      value: stats.marketTrend === 'bullish' ? "High" : stats.marketTrend === 'bearish' ? "Low" : "Medium",
      change: `${(stats.aiAccuracy * 15).toFixed(1)}%`,
      trend: "up",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Risk Assessment",
      value: stats.riskScore < 0.3 ? "Low" : stats.riskScore < 0.7 ? "Medium" : "High",
      change: stats.riskScore < 0.5 ? "Stable" : "Monitor",
      trend: stats.riskScore < 0.5 ? "neutral" : "up",
      icon: <Target className="w-6 h-6" />,
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    }
  ];

  const startAIAnalysis = async () => {
    setAiAnalysisActive(true);
    try {
      // Execute real AI analysis using our edge function
      const { data, error } = await supabase.functions.invoke('market-intelligence-engine', {
        body: {
          commandType: 'coin_trend_analyzer',
          analysisData: {
            portfolioValue: stats.totalValue,
            portfolioItems: stats.portfolioItems,
            timeframe: '30d'
          }
        }
      });

      if (error) throw error;

      // Update real-time metrics with actual analysis results
      setRealTimeMetrics({
        aiScore: data.intelligence?.confidence || stats.aiAccuracy,
        marketTrend: data.intelligence?.overallTrend?.toLowerCase() || 'neutral',
        riskLevel: data.intelligence?.riskScore < 0.3 ? 'low' : 
                   data.intelligence?.riskScore < 0.7 ? 'medium' : 'high',
        recommendations: data.intelligence?.patterns?.length || 3
      });

      toast.success('AI analysis completed successfully!');
    } catch (error) {
      console.error('AI analysis error:', error);
      toast.error('AI analysis failed. Using cached data.');
      
      // Fallback to enhanced calculation
      setRealTimeMetrics({
        aiScore: stats.aiAccuracy,
        marketTrend: stats.marketTrend,
        riskLevel: stats.riskScore < 0.3 ? 'low' : stats.riskScore < 0.7 ? 'medium' : 'high',
        recommendations: Math.floor(stats.portfolioItems.length / 2) + 1
      });
    } finally {
      setTimeout(() => setAiAnalysisActive(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-600" />
            Smart Portfolio AI Dashboard
          </h2>
          <p className="text-gray-600 mt-2">Real-time AI insights for your coin collection</p>
        </div>
        <Button
          onClick={startAIAnalysis}
          disabled={aiAnalysisActive}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {aiAnalysisActive ? (
            <>
              <Zap className="w-4 h-4 mr-2 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Run AI Analysis
            </>
          )}
        </Button>
      </motion.div>

      {/* AI Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <div className={metric.color}>
                      {metric.icon}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {metric.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                    {metric.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
                    <span className={
                      metric.trend === "up" ? "text-green-600" : 
                      metric.trend === "down" ? "text-red-600" : "text-gray-600"
                    }>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600">
                  {metric.title}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Real-Time Analysis Results */}
      {aiAnalysisActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-700 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">Market Trend: <span className="font-semibold capitalize">{realTimeMetrics.marketTrend}</span></p>
                <p className="text-sm">Risk Level: <span className="font-semibold capitalize">{realTimeMetrics.riskLevel}</span></p>
                <p className="text-sm">AI Score: <span className="font-semibold">{(realTimeMetrics.aiScore * 100).toFixed(1)}%</span></p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-green-700">
                {realTimeMetrics.recommendations} opportunities identified based on current portfolio analysis.
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-700 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-blue-700">
                Portfolio tracking {stats.portfolioItems.length} items with ${stats.totalValue.toLocaleString()} total value.
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default SmartPortfolioAI;
