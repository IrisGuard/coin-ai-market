import { useState } from 'react';
import { useGlobalAIBrainIntegration, AIBrainAnalysis } from '@/hooks/dealer/useGlobalAIBrainIntegration';
import { toast } from 'sonner';

export interface EnhancedAIResult {
  name: string;
  year: number;
  country: string;
  denomination: string;
  composition: string;
  grade: string;
  estimatedValue: number;
  rarity: string;
  mint?: string;
  diameter?: number;
  weight?: number;
  errors?: string[];
  confidence: number;
  aiProvider: string;
  processingTime: number;
  description?: string;
  structured_description?: string;
  category?: string;
  market_intelligence?: any;
  condition?: string;
  authentication_status?: string;
  ai_confidence?: number;
}

export const useRealAICoinRecognition = () => {
  const [result, setResult] = useState<EnhancedAIResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 🧠 NEW: Use Global AI Brain Integration with 171 sources
  const { analyzeImageWithGlobalBrain, isAnalyzing } = useGlobalAIBrainIntegration();

  const analyzeImage = async (imageFile: File): Promise<EnhancedAIResult | null> => {
    setError(null);
    const startTime = Date.now();
    
    try {
      console.log('🌍 Starting Global AI Brain Analysis (171 sources)...');
      
      // Use Global AI Brain Integration
      const brainResult = await analyzeImageWithGlobalBrain(imageFile);
      
      if (!brainResult) {
        throw new Error('Global AI Brain analysis failed');
      }

      console.log('✅ Global AI Brain Analysis Complete:', brainResult);
      
      // Convert AIBrainAnalysis to EnhancedAIResult format for backward compatibility
      const enhancedResult: EnhancedAIResult = {
        name: brainResult.name,
        year: brainResult.year,
        country: brainResult.country,
        denomination: brainResult.denomination,
        composition: brainResult.composition,
        grade: brainResult.grade,
        estimatedValue: brainResult.estimatedValue,
        rarity: brainResult.rarity,
        mint: brainResult.specificFields?.mint,
        diameter: brainResult.specificFields?.diameter,
        weight: brainResult.specificFields?.weight,
        errors: brainResult.errors,
        confidence: brainResult.confidence,
        aiProvider: 'global-ai-brain-171-sources',
        processingTime: Date.now() - startTime,
        description: brainResult.description,
        structured_description: generateStructuredDescription(brainResult),
        category: brainResult.category || determineCategoryFromResult(brainResult),
        market_intelligence: {
          priceIntelligence: {
            averagePrice: brainResult.estimatedValue,
            priceRange: { low: brainResult.estimatedValue * 0.8, high: brainResult.estimatedValue * 1.2 }
          },
          categoryValidation: {
            suggestedCategory: brainResult.category || 'WORLD COINS',
            confidence: brainResult.confidence
          },
          gradeAssessment: {
            suggestedGrade: brainResult.grade,
            confidence: brainResult.confidence
          },
          insights: [`Global AI Brain analysis with ${brainResult.market_intelligence.web_sources_count} sources`],
          overallConfidence: brainResult.confidence,
          web_sources_count: brainResult.market_intelligence.web_sources_count,
          discovery_sources: brainResult.market_intelligence.discovery_sources,
          market_price_sources: brainResult.source_analysis.sources_consulted.length
        },
        condition: brainResult.grade,
        authentication_status: brainResult.market_intelligence.authentication_status,
        ai_confidence: brainResult.confidence
      };

      setResult(enhancedResult);
      
      toast.success(
        `🌍 Global AI Analysis Complete! ${enhancedResult.name} identified with ${Math.round(enhancedResult.confidence * 100)}% confidence from ${brainResult.market_intelligence.web_sources_count} global sources.`
      );

      return enhancedResult;
      
    } catch (error: any) {
      console.error('❌ Global AI Brain analysis failed:', error);
      setError(error.message || 'Analysis failed');
      toast.error(`Global AI analysis failed: ${error.message}`);
      return null;
    }
  };

  const clearResults = () => {
    setResult(null);
    setError(null);
  };

  return {
    analyzeImage,
    clearResults,
    isAnalyzing,
    result,
    error
  };
};

// 🧠 NEW: Generate structured description from Global AI Brain result
const generateStructuredDescription = (brainResult: AIBrainAnalysis): string => {
  return `PROFESSIONAL ANALYSIS: ${brainResult.name} (${brainResult.year}) - ${brainResult.grade} grade ${brainResult.composition} ${brainResult.category || 'item'} from ${brainResult.country}. RARITY: ${brainResult.rarity}. VALUATION: $${brainResult.estimatedValue}. AUTHENTICATION: Global AI Brain verified with ${Math.round(brainResult.confidence * 100)}% confidence from ${brainResult.market_intelligence.web_sources_count} sources.`;
};

// 🧠 NEW: Determine category from Global AI Brain result
const determineCategoryFromResult = (brainResult: AIBrainAnalysis): string => {
  // Use the category from Global AI Brain, or determine from country/type
  if (brainResult.category) {
    return mapCategoryToDisplayName(brainResult.category);
  }
  
  // Fallback category determination based on country
  const country = brainResult.country.toLowerCase();
  if (country.includes('greece') || country.includes('greek')) {
    return 'WORLD COINS';
  }
  if (country.includes('united states') || country.includes('usa')) {
    return 'USA COINS';
  }
  if (country.includes('china') || country.includes('chinese')) {
    return 'CHINESE COINS';
  }
  if (country.includes('britain') || country.includes('england') || country.includes('uk')) {
    return 'BRITISH COINS';
  }
  if (country.includes('canada') || country.includes('canadian')) {
    return 'CANADIAN COINS';
  }
  if (country.includes('russia') || country.includes('soviet')) {
    return 'RUSSIA COINS';
  }
  
  return 'WORLD COINS';
};

// 🧠 NEW: Map Global AI Brain categories to display names
const mapCategoryToDisplayName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'banknotes': 'BANKNOTES',
    'error_banknotes': 'ERROR BANKNOTES',
    'gold_bullion': 'GOLD BULLION',
    'silver_bullion': 'SILVER BULLION',
    'modern': 'MODERN COINS',
    'ancient': 'ANCIENT COINS',
    'world': 'WORLD COINS',
    'usa': 'USA COINS',
    'canadian': 'CANADIAN COINS',
    'british': 'BRITISH COINS',
    'chinese': 'CHINESE COINS',
    'russian': 'RUSSIA COINS'
  };
  
  return categoryMap[category] || 'WORLD COINS';
};

// Legacy validation functions removed - Global AI Brain handles all validation internally
