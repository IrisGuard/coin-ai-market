import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DualAnalysisResult {
  anthropic_analysis: any;
  openai_analysis: any;
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

      console.log('🔄 Starting dual AI analysis with real API connections...');

      // Step 1: Claude Analysis (Anthropic)
      setCurrentStep('Analyzing with Claude AI...');
      setAnalysisProgress(30);

      console.log('📞 Calling Anthropic API...');
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

      console.log('✅ Claude analysis completed:', anthropicData);

      // Step 2: OpenAI Analysis
      setCurrentStep('Analyzing with OpenAI Vision...');
      setAnalysisProgress(60);

      console.log('📞 Calling OpenAI API...');
      const { data: openaiData, error: openaiError } = await supabase.functions.invoke('ai-coin-recognition', {
        body: {
          image: frontImageData,
          additionalImages: [backImageData]
        }
      });

      if (openaiError) {
        console.error('❌ OpenAI analysis failed:', openaiError);
        throw new Error(`OpenAI analysis failed: ${openaiError.message}`);
      }

      console.log('✅ OpenAI analysis completed:', openaiData);

      // Step 3: Compare and create consensus
      setCurrentStep('Comparing results and creating consensus...');
      setAnalysisProgress(80);

      const consensus = createConsensus(anthropicData.analysis, openaiData);
      
      const dualResult: DualAnalysisResult = {
        anthropic_analysis: anthropicData.analysis,
        openai_analysis: openaiData,
        comparison: consensus,
        processing_time: (anthropicData.processing_time || 0) + (openaiData.processing_time || 0),
        timestamp: new Date().toISOString()
      };

      // Step 4: Log results (removed database storage due to missing table)
      setCurrentStep('Analysis complete!');
      setAnalysisProgress(100);

      console.log('🎯 Dual analysis completed successfully:', dualResult);
      
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

  const createConsensus = (anthropicResult: any, openaiResult: any) => {
    const discrepancies: string[] = [];
    
    // Compare names
    const anthropicName = anthropicResult?.name || 'Unknown';
    const openaiName = openaiResult?.name || 'Unknown';
    
    let consensusName = anthropicName;
    if (anthropicName !== openaiName && openaiName !== 'Unknown') {
      discrepancies.push(`Name mismatch: Claude says "${anthropicName}", OpenAI says "${openaiName}"`);
      // Use the one with higher confidence
      if ((openaiResult?.confidence || 0) > (anthropicResult?.confidence || 0)) {
        consensusName = openaiName;
      }
    }

    // Compare years
    const anthropicYear = anthropicResult?.year;
    const openaiYear = openaiResult?.year;
    
    let consensusYear = anthropicYear;
    if (anthropicYear !== openaiYear && openaiYear) {
      discrepancies.push(`Year mismatch: Claude says ${anthropicYear}, OpenAI says ${openaiYear}`);
      if ((openaiResult?.confidence || 0) > (anthropicResult?.confidence || 0)) {
        consensusYear = openaiYear;
      }
    }

    // Compare countries
    const anthropicCountry = anthropicResult?.country || 'Unknown';
    const openaiCountry = openaiResult?.country || 'Unknown';
    
    let consensusCountry = anthropicCountry;
    if (anthropicCountry !== openaiCountry && openaiCountry !== 'Unknown') {
      discrepancies.push(`Country mismatch: Claude says "${anthropicCountry}", OpenAI says "${openaiCountry}"`);
      if ((openaiResult?.confidence || 0) > (anthropicResult?.confidence || 0)) {
        consensusCountry = openaiCountry;
      }
    }

    // Average values
    const anthropicValue = anthropicResult?.estimated_value || 0;
    const openaiValue = openaiResult?.estimated_value || 0;
    const consensusValue = (anthropicValue + openaiValue) / 2;

    if (Math.abs(anthropicValue - openaiValue) > anthropicValue * 0.2) {
      discrepancies.push(`Value mismatch: Claude says $${anthropicValue}, OpenAI says $${openaiValue}`);
    }

    // Calculate confidence (average of both, reduced if discrepancies exist)
    const avgConfidence = ((anthropicResult?.confidence || 0.5) + (openaiResult?.confidence || 0.5)) / 2;
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
