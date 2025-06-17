
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DualImageAnalysisResult {
  id: string;
  frontImage: string;
  backImage: string;
  analysisResults: {
    coinName: string;
    year: number | null;
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
      
      setAnalysisProgress(20);
      setCurrentStep('Analyzing front side with Claude AI...');

      // Call anthropic-coin-recognition for front image
      const { data: frontAnalysis, error: frontError } = await supabase.functions.invoke('anthropic-coin-recognition', {
        body: {
          image: frontImageBase64,
          analysis_type: 'comprehensive',
          include_valuation: true,
          include_errors: true
        }
      });

      if (frontError) {
        console.error('Front image analysis failed:', frontError);
        throw new Error(`Front analysis failed: ${frontError.message}`);
      }

      if (!frontAnalysis || !frontAnalysis.success) {
        console.error('Front analysis unsuccessful:', frontAnalysis);
        throw new Error(frontAnalysis?.error || 'Front analysis was unsuccessful');
      }

      setAnalysisProgress(50);
      setCurrentStep('Analyzing back side with Claude AI...');

      // Call anthropic-coin-recognition for back image
      const { data: backAnalysis, error: backError } = await supabase.functions.invoke('anthropic-coin-recognition', {
        body: {
          image: backImageBase64,
          analysis_type: 'comprehensive',
          include_valuation: true,
          include_errors: true
        }
      });

      if (backError) {
        console.error('Back image analysis failed:', backError);
        throw new Error(`Back analysis failed: ${backError.message}`);
      }

      if (!backAnalysis || !backAnalysis.success) {
        console.error('Back analysis unsuccessful:', backAnalysis);
        throw new Error(backAnalysis?.error || 'Back analysis was unsuccessful');
      }

      setAnalysisProgress(80);
      setCurrentStep('Combining analysis results...');

      // Combine both analyses - use front as primary, back as additional confirmation
      const primaryAnalysis = frontAnalysis.analysis;
      const secondaryAnalysis = backAnalysis.analysis;

      // Calculate combined confidence (average of both sides)
      const combinedConfidence = (primaryAnalysis.confidence + secondaryAnalysis.confidence) / 2;

      // Combine errors from both sides
      const combinedErrors = [
        ...(primaryAnalysis.errors || []),
        ...(secondaryAnalysis.errors || [])
      ];

      setAnalysisProgress(90);
      setCurrentStep('Saving analysis results...');

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.warn('User authentication failed:', userError);
      }

      // Create analysis record ID
      const analysisId = `dual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Try to save to database, but don't fail if it doesn't work
      try {
        const { error: dbError } = await supabase
          .from('dual_image_analysis')
          .insert({
            id: analysisId,
            front_image_url: frontImageBase64,
            back_image_url: backImageBase64,
            user_id: user?.id,
            analysis_results: primaryAnalysis,
            confidence_score: combinedConfidence,
            detected_errors: combinedErrors,
            grade_assessment: primaryAnalysis.grade,
            rarity_score: getRarityScore(primaryAnalysis.rarity),
            estimated_value_range: {
              min: primaryAnalysis.estimated_value * 0.8,
              max: primaryAnalysis.estimated_value * 1.2,
              average: primaryAnalysis.estimated_value
            }
          });

        if (dbError) {
          console.warn('Database save failed, continuing with analysis:', dbError);
        }
      } catch (dbError) {
        console.warn('Database operation failed:', dbError);
      }

      setAnalysisProgress(100);
      setCurrentStep('Analysis complete!');

      // Return real Claude analysis results only
      const completeResults: DualImageAnalysisResult = {
        id: analysisId,
        frontImage: frontImageBase64,
        backImage: backImageBase64,
        analysisResults: {
          coinName: primaryAnalysis.name || 'Unidentified Coin',
          year: primaryAnalysis.year || null,
          country: primaryAnalysis.country || 'Unknown',
          denomination: primaryAnalysis.denomination || 'Unknown',
          composition: primaryAnalysis.composition || 'Unknown',
          grade: primaryAnalysis.grade || 'Unknown',
          estimatedValue: {
            min: (primaryAnalysis.estimated_value || 0) * 0.8,
            max: (primaryAnalysis.estimated_value || 0) * 1.2,
            average: primaryAnalysis.estimated_value || 0
          },
          rarity: primaryAnalysis.rarity || 'Unknown',
          errors: combinedErrors,
          mint: primaryAnalysis.mint,
          diameter: primaryAnalysis.diameter,
          weight: primaryAnalysis.weight,
          confidence: combinedConfidence
        },
        webDiscoveryResults: [],
        visualMatches: [],
        errorPatterns: [],
        marketAnalysis: {
          currentMarketValue: null,
          priceTrends: null,
          recentSales: null,
          populationData: null,
          investmentRecommendation: '',
          marketOutlook: ''
        }
      };
      
      toast.success(`Dual-side analysis complete! Confidence: ${Math.round(combinedConfidence * 100)}%`);
      
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
    'Extremely Rare': 6,
    'Unknown': 1
  };
  return rarityMap[rarity] || 1;
};
