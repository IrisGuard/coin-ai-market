
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { Brain, TrendingUp, AlertCircle, Star } from 'lucide-react';

interface AIPortfolioInsightsProps {
  portfolioData: any[];
  totalValue: number;
  isAnalyzing: boolean;
}

const AIPortfolioInsights: React.FC<AIPortfolioInsightsProps> = ({ 
  portfolioData, 
  totalValue, 
  isAnalyzing 
}) => {
  // Mock AI insights data
  const diversificationData = [
    { name: 'US Coins', value: 45, color: '#3B82F6' },
    { name: 'European', value: 25, color: '#8B5CF6' },
    { name: 'Ancient', value: 20, color: '#10B981' },
    { name: 'Modern', value: 10, color: '#F59E0B' }
  ];

  const performanceData = [
    { period: 'Last Week', growth: 3.2, ai_prediction: 4.1 },
    { period: 'Last Month', growth: 12.5, ai_prediction: 15.2 },
    { period: 'Last Quarter', growth: 28.3, ai_prediction: 32.1 },
    { period: 'Last Year', growth: 67.8, ai_prediction: 72.4 }
  ];

  const aiInsights = [
    {
      type: "strength",
      icon: <Star className="w-4 h-4" />,
      title: "Strong Diversification",
      description: "Your portfolio shows excellent geographic and period diversity",
      confidence: 94
    },
    {
      type: "opportunity",
      icon: <TrendingUp className="w-4 h-4" />,
      title: "Growth Opportunity",
      description: "Consider adding more ancient coins for better long-term growth",
      confidence: 87
    },
    {
      type: "warning",
      icon: <AlertCircle className="w-4 h-4" />,
      title: "Market Timing",
      description: "Some US silver coins may be overvalued currently",
      confidence: 76
    }
  ];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Portfolio Insights
          {isAnalyzing && (
            <Badge variant="secondary" className="ml-2 animate-pulse">
              Analyzing...
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          AI-powered analysis of your collection performance and composition
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Diversification Chart */}
        <div>
          <h4 className="font-semibold mb-3">Portfolio Composition</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={diversificationData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  stroke="none"
                >
                  {diversificationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {diversificationData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span>{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div>
          <h4 className="font-semibold mb-3">AI Insights</h4>
          <div className="space-y-3">
            {aiInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border-l-4 ${
                  insight.type === 'strength' ? 'bg-green-50 border-green-500' :
                  insight.type === 'opportunity' ? 'bg-blue-50 border-blue-500' :
                  'bg-yellow-50 border-yellow-500'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`mt-0.5 ${
                    insight.type === 'strength' ? 'text-green-600' :
                    insight.type === 'opportunity' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>
                    {insight.icon}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{insight.title}</h5>
                    <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs text-gray-500">Confidence:</span>
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIPortfolioInsights;
