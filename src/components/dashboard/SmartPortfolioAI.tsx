
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SmartPortfolioAI = () => {
  const { data: portfolioAnalysis, isLoading } = useQuery({
    queryKey: ['smart-portfolio-analysis'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Get user's portfolio (favorites + owned coins)
      const { data: favorites } = await supabase
        .from('favorites')
        .select(`
          coins (
            id,
            name,
            price,
            rarity,
            category,
            grade,
            year,
            country
          )
        `)
        .eq('user_id', user.id);

      const portfolio = favorites?.map(fav => fav.coins).filter(Boolean) || [];

      if (portfolio.length === 0) {
        return {
          totalValue: 0,
          itemCount: 0,
          recommendations: [],
          insights: ['Add coins to your portfolio to get AI insights'],
          riskLevel: 'low'
        };
      }

      const totalValue = portfolio.reduce((sum, coin) => sum + (coin?.price || 0), 0);
      
      // Analyze portfolio composition
      const categoryBreakdown = portfolio.reduce((acc: Record<string, number>, coin) => {
        const category = coin?.category || 'unknown';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      const rarityBreakdown = portfolio.reduce((acc: Record<string, number>, coin) => {
        const rarity = coin?.rarity || 'unknown';
        acc[rarity] = (acc[rarity] || 0) + 1;
        return acc;
      }, {});

      // Generate AI recommendations based on real portfolio analysis
      const recommendations = [];
      const insights = [];

      // Diversification analysis
      const categories = Object.keys(categoryBreakdown).length;
      if (categories < 3) {
        recommendations.push({
          type: 'diversification',
          title: 'Diversify Your Portfolio',
          description: 'Consider adding coins from different categories to reduce risk.',
          priority: 'high'
        });
        insights.push('Your portfolio focuses on limited categories - consider diversification');
      }

      // Rarity analysis
      const hasRareCoins = Object.keys(rarityBreakdown).some(rarity => 
        ['rare', 'extremely_rare'].includes(rarity)
      );
      
      if (!hasRareCoins) {
        recommendations.push({
          type: 'quality',
          title: 'Add Premium Coins',
          description: 'Include some rare or extremely rare coins for better growth potential.',
          priority: 'medium'
        });
      }

      // Value analysis
      const avgValue = totalValue / portfolio.length;
      if (avgValue < 100) {
        insights.push('Portfolio consists mainly of lower-value coins');
      } else if (avgValue > 1000) {
        insights.push('High-value portfolio with strong growth potential');
      }

      // Risk assessment based on real data
      let riskLevel = 'low';
      if (totalValue > 5000 && categories < 3) {
        riskLevel = 'high';
      } else if (totalValue > 1000 || categories < 2) {
        riskLevel = 'medium';
      }

      // Get real market trends from recent coins
      const { data: marketTrends } = await supabase
        .from('coins')
        .select('category, price')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const trendingCategories = marketTrends?.reduce((acc: Record<string, number>, coin) => {
        const category = coin.category || 'unknown';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {}) || {};

      const hotCategory = Object.entries(trendingCategories)
        .sort(([,a], [,b]) => b - a)[0]?.[0];

      if (hotCategory && !categoryBreakdown[hotCategory]) {
        recommendations.push({
          type: 'trend',
          title: `Consider ${hotCategory} Category`,
          description: `${hotCategory} coins are trending in the market.`,
          priority: 'low'
        });
      }

      // Get real performance data from AI predictions
      const { data: predictions } = await supabase
        .from('ai_predictions')
        .select('confidence_score, predicted_value')
        .eq('prediction_type', 'market_prediction')
        .limit(5);

      if (predictions && predictions.length > 0) {
        const avgConfidence = predictions.reduce((sum, pred) => 
          sum + (pred.confidence_score || 0), 0) / predictions.length;
        
        if (avgConfidence > 0.8) {
          insights.push('AI models show high confidence in current market conditions');
        }
      }

      return {
        totalValue: Math.round(totalValue),
        itemCount: portfolio.length,
        recommendations: recommendations.slice(0, 3),
        insights,
        riskLevel,
        categoryBreakdown,
        rarityBreakdown
      };
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Portfolio Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!portfolioAnalysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Portfolio Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Sign in to get personalized portfolio insights</p>
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Portfolio Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">${portfolioAnalysis.totalValue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Value</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{portfolioAnalysis.itemCount}</p>
            <p className="text-sm text-muted-foreground">Items</p>
          </div>
          <div className="text-center">
            <Badge className={`${getRiskColor(portfolioAnalysis.riskLevel)} border-0`}>
              {portfolioAnalysis.riskLevel.toUpperCase()} RISK
            </Badge>
          </div>
        </div>

        {/* AI Insights */}
        <div>
          <h4 className="font-semibold mb-2">AI Insights</h4>
          <ul className="space-y-1 text-sm">
            {portfolioAnalysis.insights.map((insight, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-blue-500 flex-shrink-0" />
                {insight}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        {portfolioAnalysis.recommendations.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Recommendations</h4>
            <div className="space-y-2">
              {portfolioAnalysis.recommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    {getPriorityIcon(rec.priority)}
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{rec.title}</h5>
                      <p className="text-xs text-muted-foreground">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button className="w-full" size="sm">
          View Detailed Analysis
        </Button>
      </CardContent>
    </Card>
  );
};

export default SmartPortfolioAI;
