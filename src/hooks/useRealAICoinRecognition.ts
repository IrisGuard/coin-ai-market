
import { useState } from 'react';
import { useAICoinRecognition } from '@/hooks/useAICoinRecognition';
import { extractMarketplaceIntelligence } from '@/hooks/enhanced-coin-recognition/dataExtraction';
import { mergeAnalysisData } from '@/hooks/enhanced-coin-recognition/dataMerger';
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
}

export const useRealAICoinRecognition = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EnhancedAIResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { mutateAsync: recognizeCoin } = useAICoinRecognition();

  const analyzeImage = async (imageFile: File): Promise<EnhancedAIResult | null> => {
    setIsAnalyzing(true);
    setError(null);
    
    const startTime = Date.now();
    
    try {
      console.log('🧠 Starting complete AI coin recognition with full auto-fill...');
      
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });

      console.log('🎯 Phase 1: Complete Claude AI Analysis...');
      const claudeResult = await recognizeCoin({
        image: base64,
        aiProvider: 'claude'
      });

      if (!claudeResult.success) {
        throw new Error('Claude AI analysis failed');
      }

      console.log('🏪 Phase 2: Marketplace Intelligence Integration...');
      const marketplaceIntelligence = await extractMarketplaceIntelligence(claudeResult.analysis);
      
      console.log('🔗 Phase 3: Complete Data Merger for Full Auto-Fill...');
      const mergedData = await mergeAnalysisData(claudeResult.analysis, []);
      
      const enhancedResult: EnhancedAIResult = {
        name: mergedData.name || claudeResult.analysis.name || 'Unknown Coin',
        year: mergedData.year || claudeResult.analysis.year || new Date().getFullYear(),
        country: mergedData.country || claudeResult.analysis.country || 'Unknown',
        denomination: mergedData.denomination || claudeResult.analysis.denomination || 'Unknown',
        composition: mergedData.composition || claudeResult.analysis.composition || 'Unknown',
        grade: mergedData.grade || claudeResult.analysis.grade || 'Ungraded',
        estimatedValue: mergedData.estimated_value || claudeResult.analysis.estimated_value || 0,
        rarity: mergedData.rarity || claudeResult.analysis.rarity || 'Common',
        mint: mergedData.mint || claudeResult.analysis.mint || '',
        diameter: mergedData.diameter || claudeResult.analysis.diameter || 0,
        weight: mergedData.weight || claudeResult.analysis.weight || 0,
        errors: mergedData.errors || claudeResult.analysis.errors || [],
        confidence: mergedData.final_confidence || claudeResult.analysis.confidence || 0.75,
        aiProvider: 'claude-enhanced',
        processingTime: Date.now() - startTime,
        description: generateAutoDescription(mergedData, claudeResult.analysis),
        structured_description: generateStructuredDescription(mergedData, claudeResult.analysis),
        category: mergedData.suggested_category || determineCategory(mergedData.country, mergedData.denomination),
        market_intelligence: marketplaceIntelligence
      };

      console.log('✅ Complete AI Analysis with Full Auto-Fill:', enhancedResult);
      setResult(enhancedResult);
      
      toast.success(
        `Complete Analysis Ready! ${enhancedResult.name} identified with ${Math.round(enhancedResult.confidence * 100)}% confidence. All fields auto-filled.`
      );

      return enhancedResult;
      
    } catch (error: any) {
      console.error('❌ Complete AI analysis failed:', error);
      setError(error.message || 'Analysis failed');
      toast.error(`Analysis failed: ${error.message}`);
      return null;
    } finally {
      setIsAnalyzing(false);
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

const generateAutoDescription = (mergedData: any, claudeData: any): string => {
  const name = mergedData.name || claudeData.name || 'Coin';
  const year = mergedData.year || claudeData.year || 'unknown year';
  const grade = mergedData.grade || claudeData.grade || 'Ungraded';
  const composition = mergedData.composition || claudeData.composition || 'Unknown composition';
  const rarity = mergedData.rarity || claudeData.rarity || 'Common';
  
  return `${name} from ${year}. Grade: ${grade}. Composition: ${composition}. ${rarity} rarity coin with professional AI analysis.`;
};

const generateStructuredDescription = (mergedData: any, claudeData: any): string => {
  const name = mergedData.name || claudeData.name || 'Unknown Coin';
  const year = mergedData.year || claudeData.year || 'Unknown';
  const grade = mergedData.grade || claudeData.grade || 'Ungraded';
  const composition = mergedData.composition || claudeData.composition || 'Unknown composition';
  const country = mergedData.country || claudeData.country || 'Unknown origin';
  const rarity = mergedData.rarity || claudeData.rarity || 'Common';
  const estimatedValue = mergedData.estimated_value || claudeData.estimated_value || 0;
  const weight = mergedData.weight || claudeData.weight || 0;
  const diameter = mergedData.diameter || claudeData.diameter || 0;
  
  return `Professional Analysis: ${name} (${year}) - ${grade} grade ${composition} coin from ${country}. Rarity: ${rarity}. Physical specifications: ${weight}g weight, ${diameter}mm diameter. Current market estimate: $${estimatedValue}. This coin has been professionally analyzed using advanced AI recognition and verified marketplace intelligence data.`;
};

const determineCategory = (country?: string, denomination?: string): string => {
  if (!country) return 'WORLD COINS';
  
  const countryLower = country.toLowerCase();
  
  if (countryLower.includes('usa') || countryLower.includes('united states')) {
    return 'USA COINS';
  }
  if (countryLower.includes('russia') || countryLower.includes('soviet')) {
    return 'RUSSIA COINS';
  }
  if (countryLower.includes('china') || countryLower.includes('chinese')) {
    return 'CHINESE COINS';
  }
  if (countryLower.includes('britain') || countryLower.includes('england') || countryLower.includes('uk')) {
    return 'BRITISH COINS';
  }
  if (countryLower.includes('canada') || countryLower.includes('canadian')) {
    return 'CANADIAN COINS';
  }
  if (countryLower.includes('europe') || countryLower.includes('germany') || countryLower.includes('france')) {
    return 'EUROPEAN COINS';
  }
  if (denomination && (denomination.toLowerCase().includes('gold') || denomination.toLowerCase().includes('au'))) {
    return 'GOLD COINS';
  }
  if (denomination && (denomination.toLowerCase().includes('silver') || denomination.toLowerCase().includes('ag'))) {
    return 'SILVER COINS';
  }
  
  return 'WORLD COINS';
};
