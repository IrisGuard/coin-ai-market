
import { useState } from 'react';
import { useRealAICoinRecognition } from '@/hooks/useRealAICoinRecognition';
import { toast } from 'sonner';

import { EnhancedAnalysisResult } from './enhanced-coin-recognition/types';
import { triggerWebDiscovery } from './enhanced-coin-recognition/webDiscovery';
import { mergeAnalysisData } from './enhanced-coin-recognition/dataMerger';
import { saveEnhancedResults } from './enhanced-coin-recognition/storageHelpers';
import { extractDataSources, calculateEnrichmentScore } from './enhanced-coin-recognition/analysisHelpers';

export { EnhancedAnalysisResult } from './enhanced-coin-recognition/types';

export const useEnhancedCoinRecognition = () => {
  const { analyzeImage, isAnalyzing, result, error, clearResults } = useRealAICoinRecognition();
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentProgress, setEnrichmentProgress] = useState(0);
  const [enhancedResult, setEnhancedResult] = useState<EnhancedAnalysisResult | null>(null);

  const performEnhancedAnalysis = async (imageFile: File): Promise<EnhancedAnalysisResult | null> => {
    try {
      console.log('🚀 Starting Enhanced Coin Analysis Pipeline...');
      
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
      
      // Step 3: Merge and Enrich Data
      const mergedData = await mergeAnalysisData(claudeResult, webDiscoveryResults);
      
      setEnrichmentProgress(90);
      
      // Step 4: Save Enhanced Results
      const analysisId = await saveEnhancedResults(mergedData, imageFile);
      
      const enhancedResult: EnhancedAnalysisResult = {
        claude_analysis: claudeResult,
        web_discovery_results: webDiscoveryResults,
        merged_data: mergedData,
        data_sources: extractDataSources(webDiscoveryResults),
        enrichment_score: calculateEnrichmentScore(claudeResult, webDiscoveryResults)
      };

      setEnhancedResult(enhancedResult);
      setEnrichmentProgress(100);
      
      toast.success(
        `🎯 Complete Analysis: ${mergedData.name} - ${Math.round(mergedData.confidence * 100)}% confidence with ${webDiscoveryResults.length} external sources`
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

  return {
    performEnhancedAnalysis,
    isAnalyzing: isAnalyzing || isEnriching,
    isEnriching,
    enrichmentProgress,
    enhancedResult,
    claudeResult: result,
    error,
    clearResults: () => {
      clearResults();
      setEnhancedResult(null);
      setEnrichmentProgress(0);
    }
  };
};
