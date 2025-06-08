
import { useState } from 'react';
import { useRealAICoinRecognition } from '@/hooks/useRealAICoinRecognition';
import { toast } from 'sonner';

export interface AIAnalysisResult {
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
}

export const useAIAnalysis = () => {
  const { analyzeImage, isAnalyzing, result, error, clearResults } = useRealAICoinRecognition();
  const [analysisHistory, setAnalysisHistory] = useState<AIAnalysisResult[]>([]);

  const performAnalysis = async (imageFile: File): Promise<AIAnalysisResult | null> => {
    try {
      console.log('Starting AI analysis for:', imageFile.name);
      
      const result = await analyzeImage(imageFile);
      
      if (result) {
        // Add to history
        setAnalysisHistory(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 analyses
        
        // Show success message with confidence
        const confidencePercent = Math.round(result.confidence * 100);
        toast.success(
          `Analysis complete! Identified as ${result.name} with ${confidencePercent}% confidence`
        );
        
        return result;
      }
      
      return null;
    } catch (error: any) {
      console.error('AI analysis failed:', error);
      toast.error(`Analysis failed: ${error.message}`);
      return null;
    }
  };

  const clearAnalysis = () => {
    clearResults();
  };

  const retryAnalysis = async (imageFile: File): Promise<AIAnalysisResult | null> => {
    clearResults();
    return await performAnalysis(imageFile);
  };

  return {
    performAnalysis,
    retryAnalysis,
    clearAnalysis,
    isAnalyzing,
    result,
    error,
    analysisHistory
  };
};
