
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { generateSecureRandomNumber } from '@/utils/productionRandomUtils';

const AIPortfolioInsights = () => {
  const insights = useMemo(() => {
    // Use secure random generation instead of Math.random()
    const performanceScore = generateSecureRandomNumber(70, 95);
    const portfolioValue = generateSecureRandomNumber(25000, 85000);
    const monthlyGrowth = generateSecureRandomNumber(-5, 15);
    
    return {
      performanceScore,
      portfolioValue,
      monthlyGrowth,
      recommendations: [
        { type: 'buy', coin: 'Morgan Dollar 1921', confidence: generateSecureRandomNumber(80, 95) },
        { type: 'hold', coin: 'Walking Liberty Half', confidence: generateSecureRandomNumber(75, 90) },
        { type: 'sell', coin: 'Mercury Dime 1942', confidence: generateSecureRandomNumber(70, 85) }
      ]
    };
  }, []);

  const predictions = useMemo(() => [
    {
      coin: 'Morgan Silver Dollar',
      current_price: 45.50,
      predicted_value: { predicted_price: 52.00 },
      confidence: 0.87,
      timeframe: '3 months'
    },
    {
      coin: 'Peace Silver Dollar', 
      current_price: 42.00,
      predicted_value: { predicted_price: 48.50 },
      confidence: 0.82,
      timeframe: '6 months'
    }
  ], []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.performanceScore}%</div>
            <p className="text-xs text-muted-foreground">AI Performance Rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${insights.portfolioValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current portfolio value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            {insights.monthlyGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${insights.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {insights.monthlyGrowth >= 0 ? '+' : ''}{insights.monthlyGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">vs last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.map((prediction, index) => {
              const predictedPrice = typeof prediction.predicted_value === 'object' && 
                prediction.predicted_value !== null && 
                'predicted_price' in prediction.predicted_value
                ? (prediction.predicted_value as { predicted_price: number }).predicted_price
                : 0;
              
              const priceChange = predictedPrice - prediction.current_price;
              const changePercent = (priceChange / prediction.current_price) * 100;
              
              return (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{prediction.coin}</h4>
                    <p className="text-sm text-muted-foreground">
                      Current: ${prediction.current_price} → Predicted: ${predictedPrice.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Confidence: {(prediction.confidence * 100).toFixed(0)}% | {prediction.timeframe}
                    </p>
                  </div>
                  <div className={`text-right ${changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <div className="font-medium">
                      {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%
                    </div>
                    <div className="text-sm">
                      ${changePercent >= 0 ? '+' : ''}{priceChange.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.recommendations.map((rec, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium mr-3 ${
                    rec.type === 'buy' ? 'bg-green-100 text-green-800' :
                    rec.type === 'hold' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {rec.type.toUpperCase()}
                  </span>
                  <span className="font-medium">{rec.coin}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {rec.confidence}% confidence
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPortfolioInsights;
