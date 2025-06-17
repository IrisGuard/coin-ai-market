
import { useState } from 'react';
import { useRealAICoinRecognition } from '@/hooks/useRealAICoinRecognition';
import { toast } from 'sonner';

import { EnhancedAnalysisResult } from './enhanced-coin-recognition/types';
import { triggerWebDiscovery } from './enhanced-coin-recognition/webDiscovery';
import { mergeAnalysisData } from './enhanced-coin-recognition/dataMerger';
import { saveEnhancedResults } from './enhanced-coin-recognition/storageHelpers';
import { extractDataSources, calculateEnrichmentScore } from './enhanced-coin-recognition/dataExtraction';
import { generateAutoFillData } from './enhanced-coin-recognition/autoDescriptionGenerator';

export type { EnhancedAnalysisResult } from './enhanced-coin-recognition/types';

export const useEnhancedCoinRecognition = () => {
  const { analyzeImage, isAnalyzing, result, error, clearResults } = useRealAICoinRecognition();
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentProgress, setEnrichmentProgress] = useState(0);
  const [enhancedResult, setEnhancedResult] = useState<EnhancedAnalysisResult | null>(null);
  const [autoFillData, setAutoFillData] = useState<any>(null);

  const performEnhancedAnalysis = async (imageFile: File): Promise<EnhancedAnalysisResult | null> => {
    try {
      console.log('🚀 Starting Enhanced Coin Analysis Pipeline with Auto-Fill...');
      
      // Step 1: Claude AI Recognition
      setEnrichmentProgress(20);
      const claudeResult = await analyzeImage(imageFile);
      
      if (!claudeResult) {
        throw new Error('Claude AI analysis failed');
      }

      console.log('✅ Claude analysis completed:', claudeResult.name);
      
      // Step 2: Auto-trigger Web Discovery
      setIsEnriching(true);
      setEnrichmentProgress(40);
      
      const webDiscoveryResults = await triggerWebDiscovery(claudeResult);
      
      setEnrichmentProgress(70);
      
      // Step 3: Merge and Enrich Data with Auto-Fill Preparation
      const mergedData = await mergeAnalysisData(claudeResult, webDiscoveryResults);
      
      setEnrichmentProgress(85);
      
      // Step 4: Generate Auto-Fill Data for Dealer Panel
      const enhancedResult: EnhancedAnalysisResult = {
        claude_analysis: claudeResult,
        web_discovery_results: webDiscoveryResults,
        merged_data: mergedData,
        data_sources: extractDataSources(webDiscoveryResults),
        enrichment_score: calculateEnrichmentScore(claudeResult, webDiscoveryResults)
      };
      
      // Step 5: Generate complete auto-fill data
      const autoFill = generateAutoFillData(enhancedResult);
      setAutoFillData(autoFill);
      
      setEnrichmentProgress(95);
      
      // Step 6: Save Enhanced Results
      const analysisId = await saveEnhancedResults(mergedData, imageFile);
      
      setEnhancedResult(enhancedResult);
      setEnrichmentProgress(100);
      
      toast.success(
        `🎯 Complete Auto-Fill Ready: ${mergedData.name} - ${Math.round(mergedData.confidence * 100)}% confidence with ${webDiscoveryResults.length} external sources`
      );
      
      console.log('🔥 Auto-fill data generated:', autoFill);
      
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
    console.log(`🔄 Starting bulk analysis for ${imageFiles.length} images...`);
    
    if (imageFiles.length < 2) {
      toast.error('Please upload at least 2 images (front and back)');
      return [];
    }

    try {
      setIsEnriching(true);
      setEnrichmentProgress(10);

      // Analyze primary image (usually the first one)
      const primaryResult = await performEnhancedAnalysis(imageFiles[0]);
      
      if (!primaryResult) {
        throw new Error('Primary image analysis failed');
      }

      setEnrichmentProgress(80);

      // For additional images, we can enhance the analysis with more detail
      const additionalAnalyses = [];
      for (let i = 1; i < Math.min(imageFiles.length, 10); i++) {
        try {
          const additionalResult = await analyzeImage(imageFiles[i]);
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

      // Combine all analyses for comprehensive auto-fill
      const combinedAutoFill = {
        ...autoFillData,
        additional_images_analyzed: additionalAnalyses.length,
        total_images: imageFiles.length,
        analysis_completeness: (additionalAnalyses.length + 1) / imageFiles.length
      };

      setAutoFillData(combinedAutoFill);

      toast.success(
        `🎯 Bulk Analysis Complete: ${imageFiles.length} images analyzed, auto-fill data ready!`
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
    autoFillData, // ← New: Ready-to-use auto-fill data
    claudeResult: result,
    error,
    clearResults: () => {
      clearResults();
      setEnhancedResult(null);
      setAutoFillData(null);
      setEnrichmentProgress(0);
    }
  };
};
