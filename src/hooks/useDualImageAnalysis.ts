
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DualImageAnalysisResult {
  id: string;
  frontImage: string;
  backImage: string;
  analysisResults: {
    coinName: string;
    year: number;
    country: string;
    denomination: string;
    composition: string;
    grade: string;
    estimatedValue: {
      min: number;
      max: number;
      average: number;
    };
    rarity: string;
    errors: string[];
    mint?: string;
    diameter?: number;
    weight?: number;
    confidence: number;
  };
  webDiscoveryResults: WebDiscoveryResult[];
  visualMatches: VisualMatch[];
  errorPatterns: ErrorPattern[];
  marketAnalysis: MarketAnalysis;
}

export interface WebDiscoveryResult {
  sourceUrl: string;
  sourceType: string;
  coinMatchConfidence: number;
  priceData: any;
  auctionData: any;
  imageUrls: string[];
  extractedData: any;
}

export interface VisualMatch {
  matchedImageUrl: string;
  similarityScore: number;
  sourceUrl: string;
  coinDetails: any;
  priceInfo: any;
}

export interface ErrorPattern {
  errorType: string;
  errorDescription: string;
  confidenceScore: number;
  referenceImages: string[];
  rarityMultiplier: number;
  estimatedPremium: number;
}

export interface MarketAnalysis {
  currentMarketValue: any;
  priceTrends: any;
  recentSales: any;
  populationData: any;
  investmentRecommendation: string;
  marketOutlook: string;
}

export const useDualImageAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const performDualAnalysis = async (
    frontImageFile: File,
    backImageFile: File
  ): Promise<DualImageAnalysisResult | null> => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentStep('Preparing images...');

    try {
      // Convert images to base64
      const frontImageBase64 = await fileToBase64(frontImageFile);
      const backImageBase64 = await fileToBase64(backImageFile);
      
      setAnalysisProgress(10);
      setCurrentStep('Analyzing both sides with AI...');

      // Call enhanced AI recognition with both images
      const { data: aiAnalysis, error: aiError } = await supabase.functions.invoke('enhanced-dual-recognition', {
        body: {
          frontImage: frontImageBase64,
          backImage: backImageBase64,
          analysisType: 'comprehensive',
          includeErrorDetection: true,
          includeVisualComparison: true
        }
      });

      if (aiError) throw aiError;
      
      setAnalysisProgress(30);
      setCurrentStep('Saving analysis results...');

      // Save dual analysis to database
      const { data: analysisRecord, error: dbError } = await supabase
        .from('dual_image_analysis')
        .insert({
          front_image_url: frontImageBase64,
          back_image_url: backImageBase64,
          analysis_results: aiAnalysis.analysis,
          confidence_score: aiAnalysis.confidence,
          detected_errors: aiAnalysis.errors || [],
          grade_assessment: aiAnalysis.analysis.grade,
          rarity_score: getRarityScore(aiAnalysis.analysis.rarity),
          estimated_value_range: {
            min: aiAnalysis.analysis.estimatedValue * 0.8,
            max: aiAnalysis.analysis.estimatedValue * 1.2,
            average: aiAnalysis.analysis.estimatedValue
          }
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setAnalysisProgress(50);
      setCurrentStep('Discovering similar coins online...');

      // Trigger web discovery
      await triggerWebDiscovery(analysisRecord.id, aiAnalysis.analysis);

      setAnalysisProgress(70);
      setCurrentStep('Performing visual matching...');

      // Trigger visual matching
      await triggerVisualMatching(analysisRecord.id, frontImageBase64, backImageBase64);

      setAnalysisProgress(85);
      setCurrentStep('Analyzing market data...');

      // Trigger market analysis
      await triggerMarketAnalysis(analysisRecord.id, aiAnalysis.analysis);

      setAnalysisProgress(100);
      setCurrentStep('Analysis complete!');

      // Fetch complete results
      const completeResults = await fetchCompleteAnalysis(analysisRecord.id);
      
      toast.success(`Complete analysis finished! Found ${completeResults.webDiscoveryResults.length} online matches`);
      
      return completeResults;

    } catch (error: any) {
      console.error('Dual analysis failed:', error);
      toast.error(`Analysis failed: ${error.message}`);
      return null;
    } finally {
      setIsAnalyzing(false);
      setCurrentStep('');
    }
  };

  const triggerWebDiscovery = async (analysisId: string, analysisResults: any) => {
    // Call web discovery function
    const { data, error } = await supabase.functions.invoke('web-discovery-engine', {
      body: {
        analysisId,
        coinData: analysisResults,
        sources: ['ebay_global', 'heritage', 'numista', 'pcgs', 'ngc', 'coinworld'],
        maxResults: 50
      }
    });

    if (error) {
      console.warn('Web discovery failed:', error);
    }
  };

  const triggerVisualMatching = async (analysisId: string, frontImage: string, backImage: string) => {
    // Call visual matching function
    const { data, error } = await supabase.functions.invoke('visual-matching-engine', {
      body: {
        analysisId,
        frontImage,
        backImage,
        similarityThreshold: 0.7
      }
    });

    if (error) {
      console.warn('Visual matching failed:', error);
    }
  };

  const triggerMarketAnalysis = async (analysisId: string, coinData: any) => {
    // Call market analysis function
    const { data, error } = await supabase.functions.invoke('market-analysis-engine', {
      body: {
        analysisId,
        coinData,
        includeInvestmentAdvice: true
      }
    });

    if (error) {
      console.warn('Market analysis failed:', error);
    }
  };

  const fetchCompleteAnalysis = async (analysisId: string): Promise<DualImageAnalysisResult> => {
    // Fetch main analysis
    const { data: analysis } = await supabase
      .from('dual_image_analysis')
      .select('*')
      .eq('id', analysisId)
      .single();

    // Fetch web discovery results
    const { data: webResults } = await supabase
      .from('web_discovery_results')
      .select('*')
      .eq('analysis_id', analysisId)
      .order('coin_match_confidence', { ascending: false });

    // Fetch visual matches
    const { data: visualMatches } = await supabase
      .from('visual_coin_matches')
      .select('*')
      .eq('analysis_id', analysisId)
      .order('similarity_score', { ascending: false });

    // Fetch error patterns
    const { data: errorPatterns } = await supabase
      .from('error_pattern_matches')
      .select('*')
      .eq('analysis_id', analysisId)
      .order('confidence_score', { ascending: false });

    // Fetch market analysis
    const { data: marketAnalysis } = await supabase
      .from('market_analysis_results')
      .select('*')
      .eq('analysis_id', analysisId)
      .single();

    return {
      id: analysis.id,
      frontImage: analysis.front_image_url,
      backImage: analysis.back_image_url,
      analysisResults: {
        coinName: analysis.analysis_results.name,
        year: analysis.analysis_results.year,
        country: analysis.analysis_results.country,
        denomination: analysis.analysis_results.denomination,
        composition: analysis.analysis_results.composition,
        grade: analysis.grade_assessment,
        estimatedValue: analysis.estimated_value_range,
        rarity: analysis.analysis_results.rarity,
        errors: analysis.detected_errors,
        mint: analysis.analysis_results.mint,
        diameter: analysis.analysis_results.diameter,
        weight: analysis.analysis_results.weight,
        confidence: analysis.confidence_score
      },
      webDiscoveryResults: webResults || [],
      visualMatches: visualMatches || [],
      errorPatterns: errorPatterns || [],
      marketAnalysis: marketAnalysis || {}
    };
  };

  return {
    performDualAnalysis,
    isAnalyzing,
    analysisProgress,
    currentStep
  };
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const getRarityScore = (rarity: string): number => {
  const rarityMap: Record<string, number> = {
    'Common': 1,
    'Uncommon': 2,
    'Rare': 3,
    'Very Rare': 4,
    'Ultra Rare': 5,
    'Extremely Rare': 6
  };
  return rarityMap[rarity] || 1;
};
