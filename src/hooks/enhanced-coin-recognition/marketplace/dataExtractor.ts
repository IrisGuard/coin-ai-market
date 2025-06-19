
import { supabase } from '@/integrations/supabase/client';

export const extractUserStoreData = async () => {
  console.log('🏪 Extracting real marketplace intelligence from user stores...');
  
  try {
    // Get real marketplace data from Supabase
    const [
      { data: coins },
      { data: stores },
      { data: transactions },
      { data: priceHistory },
      { data: categoryData }
    ] = await Promise.all([
      supabase.from('coins').select('*').limit(1000),
      supabase.from('stores').select('*'),
      supabase.from('payment_transactions').select('*').eq('status', 'completed'),
      supabase.from('coin_price_history').select('*'),
      supabase.from('categories').select('*')
    ]);

    // Extract real marketplace intelligence
    const marketplaceInsights = {
      pricePatterns: new Map(),
      categoryDistribution: new Map(),
      gradeFrequency: new Map(),
      errorCoinPremiums: new Map(),
      successRates: new Map()
    };

    // Analyze price patterns from real data
    if (coins) {
      coins.forEach(coin => {
        const key = `${coin.name}_${coin.grade}`;
        if (!marketplaceInsights.pricePatterns.has(key)) {
          marketplaceInsights.pricePatterns.set(key, []);
        }
        marketplaceInsights.pricePatterns.get(key)?.push(coin.price);
      });
    }

    // Analyze category distribution
    if (categoryData) {
      categoryData.forEach(category => {
        const coinCount = coins?.filter(coin => coin.category === category.name).length || 0;
        marketplaceInsights.categoryDistribution.set(category.name, coinCount);
      });
    }

    // Analyze grade frequency from real coins
    if (coins) {
      coins.forEach(coin => {
        if (coin.grade) {
          const currentCount = marketplaceInsights.gradeFrequency.get(coin.grade) || 0;
          marketplaceInsights.gradeFrequency.set(coin.grade, currentCount + 1);
        }
      });
    }

    // Calculate error coin premiums from real transaction data
    if (transactions && coins) {
      const errorCoins = coins.filter(coin => 
        coin.name.toLowerCase().includes('error') || 
        coin.description?.toLowerCase().includes('error')
      );
      
      errorCoins.forEach(coin => {
        const relatedTransaction = transactions.find(t => t.metadata?.coin_id === coin.id);
        if (relatedTransaction) {
          const premium = (relatedTransaction.amount / coin.price) - 1;
          marketplaceInsights.errorCoinPremiums.set(coin.id, premium);
        }
      });
    }

    // Calculate seller success rates from real store data
    if (stores && transactions) {
      stores.forEach(store => {
        const storeTransactions = transactions.filter(t => t.metadata?.store_id === store.id);
        const storeCoins = coins?.filter(coin => coin.store_id === store.id) || [];
        const successRate = storeCoins.length > 0 ? storeTransactions.length / storeCoins.length : 0;
        marketplaceInsights.successRates.set(store.id, successRate);
      });
    }

    console.log('📊 Real marketplace intelligence extraction completed');
    console.log(`📈 Analyzed ${coins?.length || 0} coins from ${stores?.length || 0} stores`);
    
    return {
      totalListings: coins?.length || 0,
      averagePrices: marketplaceInsights.pricePatterns,
      categoryInsights: marketplaceInsights.categoryDistribution,
      gradeAnalysis: marketplaceInsights.gradeFrequency,
      errorPremiums: marketplaceInsights.errorCoinPremiums,
      sellerMetrics: marketplaceInsights.successRates,
      dataQuality: {
        completeness: calculateDataCompleteness(coins || []),
        accuracy: calculateDataAccuracy(coins || [], priceHistory || []),
        freshness: calculateDataFreshness(coins || [])
      }
    };
  } catch (error) {
    console.error('❌ Real marketplace intelligence extraction failed:', error);
    
    // Return empty structures on error, but log the issue
    return {
      totalListings: 0,
      averagePrices: new Map(),
      categoryInsights: new Map(),
      gradeAnalysis: new Map(),
      errorPremiums: new Map(),
      sellerMetrics: new Map(),
      dataQuality: {
        completeness: 0,
        accuracy: 0,
        freshness: 0
      }
    };
  }
};

// Helper functions for data quality analysis
const calculateDataCompleteness = (coins: any[]): number => {
  if (coins.length === 0) return 0;
  
  const requiredFields = ['name', 'price', 'grade', 'category', 'image'];
  let totalScore = 0;
  
  coins.forEach(coin => {
    const presentFields = requiredFields.filter(field => coin[field] != null).length;
    totalScore += presentFields / requiredFields.length;
  });
  
  return (totalScore / coins.length) * 100;
};

const calculateDataAccuracy = (coins: any[], priceHistory: any[]): number => {
  if (coins.length === 0) return 0;
  
  let accurateCount = 0;
  
  coins.forEach(coin => {
    const historicalPrices = priceHistory.filter(h => h.coin_identifier === coin.name);
    if (historicalPrices.length > 0) {
      const avgHistoricalPrice = historicalPrices.reduce((sum, h) => sum + h.price, 0) / historicalPrices.length;
      const priceDifference = Math.abs(coin.price - avgHistoricalPrice) / avgHistoricalPrice;
      
      // Consider accurate if within 20% of historical average
      if (priceDifference <= 0.2) {
        accurateCount++;
      }
    }
  });
  
  return historicalPrices.length > 0 ? (accurateCount / coins.length) * 100 : 50;
};

const calculateDataFreshness = (coins: any[]): number => {
  if (coins.length === 0) return 0;
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const recentCoins = coins.filter(coin => new Date(coin.updated_at || coin.created_at) > thirtyDaysAgo);
  
  return (recentCoins.length / coins.length) * 100;
};
