
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DualAnalysisResult {
  name?: string;
  confidence?: number;
  grade?: string;
  estimatedValue?: number;
  errors?: string[];
  errorDetected?: boolean;
  category?: string;
  rarity?: string;
  featured?: boolean;
  country?: string;
  denomination?: string;
  year?: number;
  condition?: string;
  composition?: string;
  mint?: string;
  anthropic_analysis?: any;
  claude_analysis?: any;
  comparison?: any;
  processing_time?: number;
}

export const useDualImageAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const performDualAnalysis = useCallback(async (frontImage: File, backImage: File): Promise<DualAnalysisResult | null> => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentStep('Preparing images for analysis...');

    try {
      // Step 1: Convert images to base64
      setAnalysisProgress(20);
      setCurrentStep('Converting images...');
      
      const frontImageBase64 = await convertFileToBase64(frontImage);
      const backImageBase64 = await convertFileToBase64(backImage);

      // Step 2: Call Claude AI analysis
      setAnalysisProgress(40);
      setCurrentStep('Analyzing with Claude AI...');

      const { data, error } = await supabase.functions.invoke('claude-coin-analysis', {
        body: {
          frontImage: frontImageBase64,
          backImage: backImageBase64,
          analysisType: 'dual_analysis'
        }
      });

      if (error) {
        console.error('Claude analysis error:', error);
        throw new Error('AI analysis failed');
      }

      setAnalysisProgress(80);
      setCurrentStep('Processing results...');

      // Step 3: Process and enhance results
      const analysisResult: DualAnalysisResult = {
        name: data.coinName || 'Unknown Coin',
        confidence: data.confidence || 0.7,
        grade: data.grade || 'Ungraded',
        estimatedValue: data.estimatedValue || 0,
        errors: data.errors || [],
        errorDetected: data.errorDetected || false,
        category: data.category || 'modern',
        rarity: data.rarity || 'Common',
        featured: data.featured || false,
        country: data.country || 'Unknown',
        denomination: data.denomination || 'Unknown',
        year: data.year || new Date().getFullYear(),
        condition: data.condition || 'Good',
        composition: data.composition || 'Unknown',
        mint: data.mint || 'Unknown',
        anthropic_analysis: data.anthropic_analysis,
        claude_analysis: data.claude_analysis,
        comparison: data.comparison,
        processing_time: data.processing_time || 0
      };

      setAnalysisProgress(100);
      setCurrentStep('Analysis complete!');

      console.log('✅ Claude AI analysis completed:', analysisResult);
      
      return analysisResult;
    } catch (error) {
      console.error('❌ Dual analysis failed:', error);
      setCurrentStep('Analysis failed');
      return null;
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => {
        setAnalysisProgress(0);
        setCurrentStep('');
      }, 2000);
    }
  }, []);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data URL prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return {
    performDualAnalysis,
    isAnalyzing,
    analysisProgress,
    currentStep
  };
};
