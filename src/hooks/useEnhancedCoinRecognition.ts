
import { useState } from 'react';
import { useRealAICoinRecognition } from '@/hooks/useRealAICoinRecognition';
import { toast } from 'sonner';

import { EnhancedAnalysisResult } from './enhanced-coin-recognition/types';
import { triggerWebDiscovery } from './enhanced-coin-recognition/webDiscovery';
import { mergeAnalysisData } from './enhanced-coin-recognition/dataMerger';
import { saveEnhancedResults } from './enhanced-coin-recognition/storageHelpers';
import { generateAutoFillData } from './enhanced-coin-recognition/autoDescriptionGenerator';

export type { EnhancedAnalysisResult } from './enhanced-coin-recognition/types';

const extractDataSources = (webResults: any[]) => {
  return webResults.map(result => result.source || 'unknown');
};

const calculateEnrichmentScore = (claudeResult: any, webResults: any[]) => {
  let score = claudeResult.confidence || 0.5;
  if (webResults.length > 0) score += 0.2;
  if (webResults.length > 3) score += 0.1;
  return Math.min(score, 1.0);
};

export const useEnhancedCoinRecognition = () => {
  const { analyzeImage, isAnalyzing, result, error, clearResults } = useRealAICoinRecognition();
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentProgress, setEnrichmentProgress] = useState(0);
  const [enhancedResult, setEnhancedResult] = useState<EnhancedAnalysisResult | null>(null);
  const [autoFillData, setAutoFillData] = useState<any>(null);

  const performEnhancedAnalysis = async (imageFile: File): Promise<EnhancedAnalysisResult | null> => {
    try {
      setEnrichmentProgress(20);
      const claudeResult = await analyzeImage(imageFile);
      
      if (!claudeResult) {
        throw new Error('Claude AI analysis failed');
      }
      
      setIsEnriching(true);
      setEnrichmentProgress(40);
      
      const webDiscoveryResults = await triggerWebDiscovery(claudeResult);
      
      setEnrichmentProgress(70);
      
      const mergedData = await mergeAnalysisData(claudeResult, webDiscoveryResults);
      
      setEnrichmentProgress(85);
      
      const enhancedResult: EnhancedAnalysisResult = {
        claude_analysis: claudeResult,
        web_discovery_results: webDiscoveryResults,
        merged_data: mergedData,
        data_sources: extractDataSources(webDiscoveryResults),
        enrichment_score: calculateEnrichmentScore(claudeResult, webDiscoveryResults)
      };
      
      const autoFill = generateAutoFillData(enhancedResult);
      setAutoFillData(autoFill);
      
      setEnrichmentProgress(95);
      
      const analysisId = await saveEnhancedResults(mergedData, imageFile);
      
      setEnhancedResult(enhancedResult);
      setEnrichmentProgress(100);
      
      toast.success(
        `Analysis Complete: ${mergedData.name} - ${Math.round(mergedData.confidence * 100)}% confidence`
      );
      
      return enhancedResult;
      
    } catch (error: any) {
      toast.error(`Enhanced analysis failed: ${error.message}`);
      return null;
    } finally {
      setIsEnriching(false);
      setEnrichmentProgress(0);
    }
  };

  const performBulkAnalysis = async (imageFiles: File[]): Promise<any[]> => {
    if (imageFiles.length < 2) {
      toast.error('Please upload at least 2 images (front and back)');
      return [];
    }

    try {
      setIsEnriching(true);
      setEnrichmentProgress(10);

      const primaryResult = await performEnhancedAnalysis(imageFiles[0]);
      
      if (!primaryResult) {
        throw new Error('Primary image analysis failed');
      }

      setEnrichmentProgress(80);

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
          // Silent fail for additional images
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
        `Bulk Analysis Complete: ${imageFiles.length} images analyzed!`
      );

      return [primaryResult, ...additionalAnalyses];

    } catch (error: any) {
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
