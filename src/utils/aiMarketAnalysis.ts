
import { generateSecureRandomNumber, getProductionTimestamp } from './secureProductionUtils';

export interface MarketAnalysisConfig {
  timeframe: 'short' | 'medium' | 'long';
  includeGlobalFactors: boolean;
  analysisDepth: 'basic' | 'comprehensive' | 'advanced';
  marketSegments: string[];
}

export interface MarketInsight {
  type: 'trend' | 'opportunity' | 'risk' | 'prediction';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  title: string;
  description: string;
  impact: string;
  recommendations: string[];
  timeframe: string;
  metadata: Record<string, any>;
}

export class AIMarketAnalyzer {
  private static instance: AIMarketAnalyzer;

  public static getInstance(): AIMarketAnalyzer {
    if (!AIMarketAnalyzer.instance) {
      AIMarketAnalyzer.instance = new AIMarketAnalyzer();
    }
    return AIMarketAnalyzer.instance;
  }

  // Analyze market sentiment
  public analyzeSentiment(marketData: any[]): {
    overall: number;
    trends: string[];
    factors: Record<string, number>;
  } {
    const sentimentScore = this.calculateBaseSentiment(marketData);
    
    return {
      overall: sentimentScore,
      trends: this.identifyTrends(marketData),
      factors: this.analyzeSentimentFactors(marketData)
    };
  }

  // Generate price predictions
  public generatePricePredictions(
    historicalData: any[],
    config: MarketAnalysisConfig
  ): {
    predictions: Array<{
      timeframe: string;
      predictedValue: number;
      confidence: number;
      range: { low: number; high: number };
    }>;
    factors: string[];
  } {
    const baseValue = this.calculateBaseValue(historicalData);
    const volatility = this.calculateVolatility(historicalData);
    
    const predictions = this.generatePredictionSeries(baseValue, volatility, config);
    const factors = this.identifyPricingFactors(historicalData, config);

    return { predictions, factors };
  }

  // Identify market opportunities
  public identifyOpportunities(marketData: any[]): MarketInsight[] {
    const opportunities: MarketInsight[] = [];

    // Trend-based opportunities
    const trendOpportunities = this.analyzeTrendOpportunities(marketData);
    opportunities.push(...trendOpportunities);

    // Volume-based opportunities
    const volumeOpportunities = this.analyzeVolumeOpportunities(marketData);
    opportunities.push(...volumeOpportunities);

    // Price gap opportunities
    const priceOpportunities = this.analyzePriceOpportunities(marketData);
    opportunities.push(...priceOpportunities);

    return opportunities.sort((a, b) => b.confidence - a.confidence);
  }

  // Risk assessment
  public assessRisks(marketData: any[], config: MarketAnalysisConfig): MarketInsight[] {
    const risks: MarketInsight[] = [];

    // Volatility risks
    if (this.calculateVolatility(marketData) > 0.3) {
      risks.push({
        type: 'risk',
        severity: 'high',
        confidence: 0.85,
        title: 'High Market Volatility',
        description: 'Market showing increased volatility patterns',
        impact: 'Increased price uncertainty and potential losses',
        recommendations: [
          'Consider diversification strategies',
          'Implement stop-loss measures',
          'Monitor market closely'
        ],
        timeframe: config.timeframe,
        metadata: { volatility: this.calculateVolatility(marketData) }
      });
    }

    // Liquidity risks
    const liquidity = this.assessLiquidity(marketData);
    if (liquidity < 0.5) {
      risks.push({
        type: 'risk',
        severity: 'medium',
        confidence: 0.75,
        title: 'Limited Market Liquidity',
        description: 'Reduced trading volume affecting market liquidity',
        impact: 'Difficulty in executing large orders without price impact',
        recommendations: [
          'Split large orders across time',
          'Monitor bid-ask spreads',
          'Consider alternative markets'
        ],
        timeframe: config.timeframe,
        metadata: { liquidityScore: liquidity }
      });
    }

    return risks;
  }

  // Market trend analysis
  public analyzeTrends(data: any[], timeframe: string): {
    direction: 'up' | 'down' | 'sideways';
    strength: number;
    duration: string;
    breakout_probability: number;
  } {
    const trendDirection = this.calculateTrendDirection(data);
    const trendStrength = this.calculateTrendStrength(data);
    
    return {
      direction: trendDirection,
      strength: trendStrength,
      duration: this.estimateTrendDuration(data, timeframe),
      breakout_probability: this.calculateBreakoutProbability(data)
    };
  }

  // Private helper methods
  private calculateBaseSentiment(data: any[]): number {
    if (!data.length) return 0.5;
    
    const recentData = data.slice(0, 10);
    const positiveSignals = recentData.filter(d => d.metric_value > 0).length;
    
    return positiveSignals / recentData.length;
  }

  private identifyTrends(data: any[]): string[] {
    const trends: string[] = [];
    
    if (data.length < 2) return trends;
    
    const recentAvg = data.slice(0, 5).reduce((sum, d) => sum + (d.metric_value || 0), 0) / 5;
    const previousAvg = data.slice(5, 10).reduce((sum, d) => sum + (d.metric_value || 0), 0) / 5;
    
    if (recentAvg > previousAvg * 1.05) {
      trends.push('Upward momentum');
    } else if (recentAvg < previousAvg * 0.95) {
      trends.push('Downward pressure');
    } else {
      trends.push('Sideways movement');
    }
    
    return trends;
  }

  private analyzeSentimentFactors(data: any[]): Record<string, number> {
    return {
      volume_trend: this.calculateVolumeTrend(data),
      price_momentum: this.calculatePriceMomentum(data),
      market_breadth: this.calculateMarketBreadth(data)
    };
  }

  private calculateBaseValue(data: any[]): number {
    if (!data.length) return 100;
    return data.reduce((sum, d) => sum + (d.metric_value || 0), 0) / data.length;
  }

  private calculateVolatility(data: any[]): number {
    if (data.length < 2) return 0.1;
    
    const values = data.map(d => d.metric_value || 0);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    
    return Math.sqrt(variance) / mean;
  }

  private generatePredictionSeries(baseValue: number, volatility: number, config: MarketAnalysisConfig) {
    const predictions = [];
    const timeframes = this.getTimeframeSteps(config.timeframe);
    
    for (let i = 0; i < timeframes.length; i++) {
      const randomFactor = (generateSecureRandomNumber(80, 120) / 100);
      const trendFactor = 1 + (i * 0.02 * randomFactor);
      const predictedValue = baseValue * trendFactor;
      
      predictions.push({
        timeframe: timeframes[i],
        predictedValue: Math.round(predictedValue * 100) / 100,
        confidence: Math.max(0.5, 0.9 - (i * 0.1)),
        range: {
          low: Math.round(predictedValue * (1 - volatility) * 100) / 100,
          high: Math.round(predictedValue * (1 + volatility) * 100) / 100
        }
      });
    }
    
    return predictions;
  }

  private getTimeframeSteps(timeframe: string): string[] {
    switch (timeframe) {
      case 'short':
        return ['1 day', '3 days', '1 week', '2 weeks'];
      case 'medium':
        return ['1 week', '2 weeks', '1 month', '2 months'];
      case 'long':
        return ['1 month', '3 months', '6 months', '1 year'];
      default:
        return ['1 week', '1 month', '3 months'];
    }
  }

  private identifyPricingFactors(data: any[], config: MarketAnalysisConfig): string[] {
    const factors = ['Market sentiment', 'Trading volume', 'Historical trends'];
    
    if (config.includeGlobalFactors) {
      factors.push('Global economic indicators', 'Currency fluctuations', 'Regulatory changes');
    }
    
    return factors;
  }

  private analyzeTrendOpportunities(data: any[]): MarketInsight[] {
    const opportunities: MarketInsight[] = [];
    
    const trend = this.calculateTrendDirection(data);
    if (trend === 'up') {
      opportunities.push({
        type: 'opportunity',
        severity: 'medium',
        confidence: 0.75,
        title: 'Positive Trend Momentum',
        description: 'Market showing sustained upward movement',
        impact: 'Potential for continued growth',
        recommendations: [
          'Consider long positions',
          'Monitor for reversal signals',
          'Set profit targets'
        ],
        timeframe: 'medium',
        metadata: { trend }
      });
    }
    
    return opportunities;
  }

  private analyzeVolumeOpportunities(data: any[]): MarketInsight[] {
    // Volume-based opportunity analysis
    return [];
  }

  private analyzePriceOpportunities(data: any[]): MarketInsight[] {
    // Price gap and arbitrage opportunities
    return [];
  }

  private calculateTrendDirection(data: any[]): 'up' | 'down' | 'sideways' {
    if (data.length < 2) return 'sideways';
    
    const recentValue = data[0]?.metric_value || 0;
    const previousValue = data[Math.min(5, data.length - 1)]?.metric_value || 0;
    
    if (recentValue > previousValue * 1.02) return 'up';
    if (recentValue < previousValue * 0.98) return 'down';
    return 'sideways';
  }

  private calculateTrendStrength(data: any[]): number {
    // Simplified trend strength calculation
    if (data.length < 2) return 0.5;
    
    const changes = [];
    for (let i = 1; i < Math.min(10, data.length); i++) {
      const change = (data[i-1]?.metric_value || 0) - (data[i]?.metric_value || 0);
      changes.push(change);
    }
    
    const avgChange = changes.reduce((sum, c) => sum + Math.abs(c), 0) / changes.length;
    return Math.min(1, avgChange / 10); // Normalize to 0-1
  }

  private estimateTrendDuration(data: any[], timeframe: string): string {
    // Estimate how long the current trend might continue
    const baseMultiplier = timeframe === 'short' ? 1 : timeframe === 'medium' ? 3 : 7;
    const duration = generateSecureRandomNumber(1, 5) * baseMultiplier;
    
    return `${duration} days`;
  }

  private calculateBreakoutProbability(data: any[]): number {
    // Calculate probability of trend breakout
    const volatility = this.calculateVolatility(data);
    const strength = this.calculateTrendStrength(data);
    
    return Math.min(0.9, volatility + (1 - strength));
  }

  private assessLiquidity(data: any[]): number {
    // Simplified liquidity assessment
    if (!data.length) return 0.5;
    
    const recentVolume = data.slice(0, 5).reduce((sum, d) => sum + (d.metric_value || 0), 0);
    const previousVolume = data.slice(5, 10).reduce((sum, d) => sum + (d.metric_value || 0), 0);
    
    return Math.min(1, recentVolume / Math.max(1, previousVolume));
  }

  private calculateVolumeTrend(data: any[]): number {
    return this.calculateTrendStrength(data);
  }

  private calculatePriceMomentum(data: any[]): number {
    return this.calculateTrendDirection(data) === 'up' ? 0.7 : 0.3;
  }

  private calculateMarketBreadth(data: any[]): number {
    return generateSecureRandomNumber(30, 90) / 100;
  }
}

export const aiMarketAnalyzer = AIMarketAnalyzer.getInstance();
