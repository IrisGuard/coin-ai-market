
import { supabase } from '@/integrations/supabase/client';

interface MarketAnalysis {
  coinId: string;
  predictedValue: number;
  confidence: number;
  marketTrend: 'increasing' | 'decreasing' | 'stable';
  factors: string[];
}

export const analyzeMarketTrends = async (coinId: string): Promise<MarketAnalysis | null> => {
  try {
    // Get coin data
    const { data: coin, error } = await supabase
      .from('coins')
      .select('*')
      .eq('id', coinId)
      .single();

    if (error || !coin) {
      console.error('Error fetching coin for analysis:', error);
      return null;
    }

    // Simulate AI market analysis
    const baseValue = coin.price || 100;
    const marketMultiplier = 1 + (Math.random() - 0.5) * 0.3; // ±15% variation
    const predictedValue = Math.round(baseValue * marketMultiplier);

    const analysis: MarketAnalysis = {
      coinId,
      predictedValue,
      confidence: 0.75 + Math.random() * 0.2, // 75-95% confidence
      marketTrend: predictedValue > baseValue ? 'increasing' : 
                   predictedValue < baseValue ? 'decreasing' : 'stable',
      factors: [
        'Historical price data',
        'Market demand indicators',
        'Collector interest trends',
        'Auction results'
      ]
    };

    return analysis;
  } catch (error) {
    console.error('Error in market analysis:', error);
    return null;
  }
};

export const getPriceHistory = async (coinId: string, days = 30) => {
  try {
    // Simulate price history data
    const prices = [];
    const basePrice = 100;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const variation = (Math.random() - 0.5) * 0.1; // ±5% daily variation
      const price = basePrice * (1 + variation * (days - i) / days);
      
      prices.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(price * 100) / 100
      });
    }
    
    return prices;
  } catch (error) {
    console.error('Error getting price history:', error);
    return [];
  }
};
