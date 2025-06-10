
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
import { useRealTimeMetrics } from '@/hooks/admin/useRealTimeMetrics';
import AIPortfolioInsights from './AIPortfolioInsights';
import SmartRecommendations from './SmartRecommendations';
import MarketPredictions from './MarketPredictions';
import PersonalizedAlerts from './PersonalizedAlerts';

const SmartPortfolioAI = () => {
  const { stats, loading } = useEnhancedDashboardStats();
  const { metrics, isConnected } = useRealTimeMetrics();
  const [aiAnalysisActive, setAiAnalysisActive] = useState(false);

  const portfolioMetrics = [
    {
      title: "AI Portfolio Score",
      value: "94.2/100",
      change: "+2.4%",
      trend: "up",
      icon: <Brain className="w-6 h-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Smart Value",
      value: `$${stats.totalValue.toLocaleString()}`,
      change: `${stats.profitPercentage > 0 ? '+' : ''}${stats.profitPercentage.toFixed(1)}%`,
      trend: stats.profitPercentage > 0 ? "up" : "down",
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Growth Potential",
      value: "High",
      change: "+15.2%",
      trend: "up",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Risk Assessment",
      value: "Low-Medium",
      change: "Stable",
      trend: "neutral",
      icon: <Target className="w-6 h-6" />,
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    }
  ];

  const startAIAnalysis = () => {
    setAiAnalysisActive(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAiAnalysisActive(false);
    }, 3000);
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
          <p className="text-gray-600 mt-2">AI-powered insights for your coin collection</p>
          {isConnected && (
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600">Real-time data active</span>
            </div>
          )}
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

      {/* Real-time System Status */}
      {isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Active Users</div>
              <div className="text-xl font-bold text-blue-600">{metrics.activeUsers}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Live Auctions</div>
              <div className="text-xl font-bold text-green-600">{metrics.liveAuctions}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">System Load</div>
              <div className="text-xl font-bold text-purple-600">{metrics.systemLoad.toFixed(1)}%</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Response Time</div>
              <div className="text-xl font-bold text-orange-600">{metrics.responseTime.toFixed(0)}ms</div>
            </CardContent>
          </Card>
        </motion.div>
      )}

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

      {/* AI Components Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AIPortfolioInsights 
          portfolioData={stats.portfolioItems} 
          totalValue={stats.totalValue}
          isAnalyzing={aiAnalysisActive}
        />
        <SmartRecommendations 
          portfolioItems={stats.portfolioItems}
          isAnalyzing={aiAnalysisActive}
        />
        <MarketPredictions 
          portfolioValue={stats.totalValue}
          isAnalyzing={aiAnalysisActive}
        />
        <PersonalizedAlerts 
          portfolioItems={stats.portfolioItems}
          isAnalyzing={aiAnalysisActive}
        />
      </div>
    </div>
  );
};

export default SmartPortfolioAI;
