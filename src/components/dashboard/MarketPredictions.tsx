
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { BarChart3, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';

interface MarketPredictionsProps {
  portfolioValue: number;
  isAnalyzing: boolean;
}

const MarketPredictions: React.FC<MarketPredictionsProps> = ({ 
  portfolioValue, 
  isAnalyzing 
}) => {
  // Mock prediction data
  const predictionData = [
    { month: 'Jan', actual: portfolioValue * 0.85, predicted: portfolioValue * 0.87, confidence: 95 },
    { month: 'Feb', actual: portfolioValue * 0.89, predicted: portfolioValue * 0.91, confidence: 92 },
    { month: 'Mar', actual: portfolioValue * 0.94, predicted: portfolioValue * 0.96, confidence: 88 },
    { month: 'Apr', actual: portfolioValue, predicted: portfolioValue, confidence: 85 },
    { month: 'May', actual: null, predicted: portfolioValue * 1.05, confidence: 82 },
    { month: 'Jun', actual: null, predicted: portfolioValue * 1.12, confidence: 78 },
    { month: 'Jul', actual: null, predicted: portfolioValue * 1.18, confidence: 74 },
    { month: 'Aug', actual: null, predicted: portfolioValue * 1.23, confidence: 70 }
  ];

  const marketTrends = [
    {
      category: "US Silver Coins",
      trend: "bullish",
      prediction: "+12%",
      confidence: 87,
      factors: ["Inflation hedge", "Limited supply", "Collector demand"]
    },
    {
      category: "Ancient Coins",
      trend: "stable",
      prediction: "+3%",
      confidence: 72,
      factors: ["Steady interest", "Archaeological finds", "Museum acquisitions"]
    },
    {
      category: "Modern Commemoratives",
      trend: "bearish",
      prediction: "-5%",
      confidence: 64,
      factors: ["High mintages", "Market saturation", "Limited collector base"]
    }
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish': return 'text-green-600 bg-green-50 border-green-200';
      case 'bearish': return 'text-red-600 bg-red-50 border-red-200';
      case 'stable': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return <TrendingUp className="w-4 h-4" />;
      case 'bearish': return <AlertTriangle className="w-4 h-4" />;
      case 'stable': return <BarChart3 className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-600" />
          Market Predictions
          {isAnalyzing && (
            <Badge variant="secondary" className="ml-2 animate-pulse">
              Forecasting...
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          AI-powered market analysis and value predictions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Portfolio Value Prediction Chart */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Portfolio Value Forecast
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    `$${value?.toLocaleString()}`, 
                    name === 'actual' ? 'Actual Value' : 'Predicted Value'
                  ]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Trends */}
        <div>
          <h4 className="font-semibold mb-3">Category Predictions</h4>
          <div className="space-y-3">
            {marketTrends.map((trend, index) => (
              <motion.div
                key={trend.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${getTrendColor(trend.trend)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(trend.trend)}
                    <h5 className="font-medium text-sm">{trend.category}</h5>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{trend.prediction}</div>
                    <div className="text-xs opacity-75">{trend.confidence}% confidence</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {trend.factors.map((factor, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Disclaimer */}
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <AlertTriangle className="w-3 h-3 inline mr-1" />
          AI predictions are based on historical data and market trends. 
          Actual results may vary. Always do your own research.
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketPredictions;
