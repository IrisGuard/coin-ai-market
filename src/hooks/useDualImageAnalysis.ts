
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DualAnalysisResult {
  anthropic_analysis: any;
  claude_analysis: any; // Renamed from openai_analysis
  comparison: {
    consensus_name: string;
    consensus_year: number | null;
    consensus_country: string;
    consensus_value: number;
    confidence_score: number;
    discrepancies: string[];
  };
  processing_time: number;
  timestamp: string;
}

export const useDualImageAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const performDualAnalysis = useCallback(async (frontImage: File, backImage: File): Promise<DualAnalysisResult | null> => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentStep('Preparing images for analysis...');

    try {
      // Convert images to base64
      setAnalysisProgress(10);
      const frontImageData = await convertFileToBase64(frontImage);
      const backImageData = await convertFileToBase64(backImage);

      console.log('🔄 Starting dual Claude AI analysis...');

      // Step 1: First Claude Analysis (Front image)
      setCurrentStep('Analyzing front image with Claude AI...');
      setAnalysisProgress(30);

      console.log('📞 Calling Anthropic API for front image...');
      const { data: anthropicData, error: anthropicError } = await supabase.functions.invoke('anthropic-coin-recognition', {
        body: {
          image: frontImageData.split(',')[1], // Remove data:image/jpeg;base64, prefix
          analysis_type: 'comprehensive',
          include_valuation: true,
          include_errors: true
        }
      });

      if (anthropicError) {
        console.error('❌ Anthropic analysis failed:', anthropicError);
        throw new Error(`Claude AI analysis failed: ${anthropicError.message}`);
      }

      console.log('✅ Claude front analysis completed:', anthropicData);

      // Step 2: Second Claude Analysis (Back image)
      setCurrentStep('Analyzing back image with Claude AI...');
      setAnalysisProgress(60);

      console.log('📞 Calling Anthropic API for back image...');
      const { data: claudeData, error: claudeError } = await supabase.functions.invoke('anthropic-coin-recognition', {
        body: {
          image: backImageData.split(',')[1], // Remove data:image/jpeg;base64, prefix
          analysis_type: 'comprehensive',
          include_valuation: true,
          include_errors: true
        }
      });

      if (claudeError) {
        console.error('❌ Second Claude analysis failed:', claudeError);
        throw new Error(`Claude AI back analysis failed: ${claudeError.message}`);
      }

      console.log('✅ Claude back analysis completed:', claudeData);

      // Step 3: Compare and create consensus
      setCurrentStep('Comparing results and creating consensus...');
      setAnalysisProgress(80);

      const consensus = createConsensus(anthropicData.analysis, claudeData.analysis);
      
      const dualResult: DualAnalysisResult = {
        anthropic_analysis: anthropicData.analysis,
        claude_analysis: claudeData.analysis,
        comparison: consensus,
        processing_time: (anthropicData.processing_time || 0) + (claudeData.processing_time || 0),
        timestamp: new Date().toISOString()
      };

      // Step 4: Analysis complete
      setCurrentStep('Analysis complete!');
      setAnalysisProgress(100);

      console.log('🎯 Dual Claude analysis completed successfully:', dualResult);
      
      return dualResult;

    } catch (error) {
      console.error('💥 Dual analysis failed:', error);
      toast.error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      setCurrentStep('');
    }
  }, []);

  const createConsensus = (anthropicResult: any, claudeResult: any) => {
    const discrepancies: string[] = [];
    
    // Compare names
    const anthropicName = anthropicResult?.name || 'Unknown';
    const claudeName = claudeResult?.name || 'Unknown';
    
    let consensusName = anthropicName;
    if (anthropicName !== claudeName && claudeName !== 'Unknown') {
      discrepancies.push(`Name mismatch: Front analysis says "${anthropicName}", Back analysis says "${claudeName}"`);
      // Use the one with higher confidence
      if ((claudeResult?.confidence || 0) > (anthropicResult?.confidence || 0)) {
        consensusName = claudeName;
      }
    }

    // Compare years
    const anthropicYear = anthropicResult?.year;
    const claudeYear = claudeResult?.year;
    
    let consensusYear = anthropicYear;
    if (anthropicYear !== claudeYear && claudeYear) {
      discrepancies.push(`Year mismatch: Front analysis says ${anthropicYear}, Back analysis says ${claudeYear}`);
      if ((claudeResult?.confidence || 0) > (anthropicResult?.confidence || 0)) {
        consensusYear = claudeYear;
      }
    }

    // Compare countries
    const anthropicCountry = anthropicResult?.country || 'Unknown';
    const claudeCountry = claudeResult?.country || 'Unknown';
    
    let consensusCountry = anthropicCountry;
    if (anthropicCountry !== claudeCountry && claudeCountry !== 'Unknown') {
      discrepancies.push(`Country mismatch: Front analysis says "${anthropicCountry}", Back analysis says "${claudeCountry}"`);
      if ((claudeResult?.confidence || 0) > (anthropicResult?.confidence || 0)) {
        consensusCountry = claudeCountry;
      }
    }

    // Average values
    const anthropicValue = anthropicResult?.estimated_value || 0;
    const claudeValue = claudeResult?.estimated_value || 0;
    const consensusValue = (anthropicValue + claudeValue) / 2;

    if (Math.abs(anthropicValue - claudeValue) > anthropicValue * 0.2) {
      discrepancies.push(`Value mismatch: Front analysis says $${anthropicValue}, Back analysis says $${claudeValue}`);
    }

    // Calculate confidence (average of both, reduced if discrepancies exist)
    const avgConfidence = ((anthropicResult?.confidence || 0.5) + (claudeResult?.confidence || 0.5)) / 2;
    const confidenceReduction = discrepancies.length * 0.1;
    const consensusConfidence = Math.max(0.1, avgConfidence - confidenceReduction);

    return {
      consensus_name: consensusName,
      consensus_year: consensusYear,
      consensus_country: consensusCountry,
      consensus_value: consensusValue,
      confidence_score: consensusConfidence,
      discrepancies
    };
  };

  return {
    performDualAnalysis,
    isAnalyzing,
    analysisProgress,
    currentStep
  };
};
