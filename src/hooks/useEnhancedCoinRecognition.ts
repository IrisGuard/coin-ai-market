import { useState } from 'react';
import { useGlobalAIBrainIntegration } from '@/hooks/dealer/useGlobalAIBrainIntegration';
import { toast } from 'sonner';

import { EnhancedAnalysisResult } from './enhanced-coin-recognition/types';

export type { EnhancedAnalysisResult } from './enhanced-coin-recognition/types';

export const useEnhancedCoinRecognition = () => {
  const { analyzeImageWithGlobalBrain, isAnalyzing } = useGlobalAIBrainIntegration();
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentProgress, setEnrichmentProgress] = useState(0);
  const [enhancedResult, setEnhancedResult] = useState<EnhancedAnalysisResult | null>(null);
  const [autoFillData, setAutoFillData] = useState<any>(null);

  const performEnhancedAnalysis = async (imageFile: File): Promise<EnhancedAnalysisResult | null> => {
    try {
      console.log('🚀 Starting Enhanced Coin Analysis Pipeline with Global AI Brain...');
      
      setIsEnriching(true);
      setEnrichmentProgress(20);

      // Step 1: Global AI Brain Analysis (replaces Claude + Web Discovery)
      const brainResult = await analyzeImageWithGlobalBrain(imageFile);
      
      if (!brainResult) {
        throw new Error('Global AI Brain analysis failed');
      }

      console.log('✅ Global AI Brain analysis completed:', brainResult.name);
      
      setEnrichmentProgress(85);
      
      // Step 2: Generate Enhanced Result with Global AI Brain data
      const enhancedResult: EnhancedAnalysisResult = {
        claude_analysis: {
          name: brainResult.name,
          year: brainResult.year,
          country: brainResult.country,
          estimated_value: brainResult.estimatedValue,
          market_value: brainResult.estimatedValue,
          confidence: brainResult.confidence,
          grade: brainResult.grade,
          composition: brainResult.composition,
          rarity: brainResult.rarity,
          denomination: brainResult.denomination,
          weight: brainResult.specificFields?.weight,
          diameter: brainResult.specificFields?.diameter,
          mint: brainResult.specificFields?.mint,
          errors: brainResult.errors,
          market_trend: brainResult.market_trend
        },
        web_discovery_results: brainResult.source_analysis.sources_consulted.map(source => ({
          source: source,
          data: { verified: true }
        })),
        merged_data: {
          name: brainResult.name,
          year: brainResult.year,
          country: brainResult.country,
          denomination: brainResult.denomination,
          estimated_value: brainResult.estimatedValue,
          market_value: brainResult.estimatedValue,
          confidence: brainResult.confidence,
          grade: brainResult.grade,
          composition: brainResult.composition,
          rarity: brainResult.rarity
        },
        data_sources: brainResult.source_analysis.sources_consulted,
        enrichment_score: brainResult.confidence
      };
      
      // Step 3: Generate auto-fill data
      const autoFill = {
        name: brainResult.name,
        year: brainResult.year,
        country: brainResult.country,
        denomination: brainResult.denomination,
        grade: brainResult.grade,
        composition: brainResult.composition,
        rarity: brainResult.rarity,
        estimated_value: brainResult.estimatedValue,
        description: brainResult.description,
        category: brainResult.category,
        confidence: brainResult.confidence,
        sources_count: brainResult.market_intelligence.web_sources_count
      };
      setAutoFillData(autoFill);
      
      setEnrichmentProgress(100);
      
      setEnhancedResult(enhancedResult);
      
      toast.success(
        `🎯 Global AI Analysis Complete: ${brainResult.name} - ${Math.round(brainResult.confidence * 100)}% confidence from ${brainResult.market_intelligence.web_sources_count} sources`
      );
      
      return enhancedResult;
      
    } catch (error: any) {
      console.error('❌ Enhanced analysis failed:', error);
      toast.error(`Enhanced analysis failed: ${error.message}`);
      return null;
    } finally {
      setIsEnriching(false);
      setEnrichmentProgress(0);
    }
  };

  const performBulkAnalysis = async (imageFiles: File[]): Promise<any[]> => {
    console.log(`🔄 Starting bulk analysis for ${imageFiles.length} images with Global AI Brain...`);
    
    if (imageFiles.length < 2) {
      toast.error('Please upload at least 2 images (front and back)');
      return [];
    }

    try {
      setIsEnriching(true);
      setEnrichmentProgress(10);

      // Analyze primary image with Global AI Brain
      const primaryResult = await performEnhancedAnalysis(imageFiles[0]);
      
      if (!primaryResult) {
        throw new Error('Primary image analysis failed');
      }

      setEnrichmentProgress(80);

      // Analyze additional images
      const additionalAnalyses = [];
      for (let i = 1; i < Math.min(imageFiles.length, 10); i++) {
        try {
          const additionalResult = await analyzeImageWithGlobalBrain(imageFiles[i]);
          if (additionalResult) {
            additionalAnalyses.push({
              imageIndex: i,
              analysis: additionalResult,
              imageType: i === 1 ? 'back' : `detail_${i-1}`
            });
          }
        } catch (error) {
          console.warn(`Analysis failed for image ${i+1}:`, error);
        }
      }

      setEnrichmentProgress(100);

      const combinedAutoFill = {
        ...autoFillData,
        additional_images_analyzed: additionalAnalyses.length,
        total_images: imageFiles.length,
        analysis_completeness: (additionalAnalyses.length + 1) / imageFiles.length
      };

      setAutoFillData(combinedAutoFill);

      toast.success(
        `🎯 Bulk Analysis Complete: ${imageFiles.length} images analyzed with Global AI Brain!`
      );

      return [primaryResult, ...additionalAnalyses];
      
    } catch (error: any) {
      console.error('❌ Bulk analysis failed:', error);
      toast.error(`Bulk analysis failed: ${error.message}`);
      return [];
    } finally {
      setIsEnriching(false);
      setEnrichmentProgress(0);
    }
  };

  return {
    performEnhancedAnalysis,
    performBulkAnalysis,
    isAnalyzing: isAnalyzing || isEnriching,
    isEnriching,
    enrichmentProgress,
    enhancedResult,
    autoFillData,
    clearResults: () => {
      setEnhancedResult(null);
      setAutoFillData(null);
    }
  };
};