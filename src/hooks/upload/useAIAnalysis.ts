
import { useState } from 'react';
import { useRealAICoinRecognition } from '@/hooks/useRealAICoinRecognition';
import { toast } from 'sonner';
import type { UploadedImage } from '@/types/upload';

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
  const [uploadProgress, setUploadProgress] = useState<number>(0);

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

  const analyzeImages = async (
    images: UploadedImage[], 
    updateCoinData: (data: any) => void,
    setImages: (images: UploadedImage[]) => void
  ) => {
    if (images.length === 0) {
      toast.error('Please select at least one image to analyze');
      return;
    }

    setUploadProgress(0);

    try {
      // Process first image for AI analysis
      const firstImage = images[0];
      if (!firstImage.file) {
        throw new Error('No valid image file found');
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const analysisResult = await performAnalysis(firstImage.file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (analysisResult) {
        // Update coin data with AI results
        updateCoinData({
          title: analysisResult.name,
          year: analysisResult.year.toString(),
          country: analysisResult.country,
          denomination: analysisResult.denomination,
          grade: analysisResult.grade,
          composition: analysisResult.composition,
          rarity: analysisResult.rarity,
          mint: analysisResult.mint || '',
          diameter: analysisResult.diameter?.toString() || '',
          weight: analysisResult.weight?.toString() || '',
          price: analysisResult.estimatedValue.toString()
        });

        // Mark images as uploaded
        const updatedImages = images.map(img => ({
          ...img,
          uploaded: true,
          uploading: false
        }));
        setImages(updatedImages);
      }

      setTimeout(() => setUploadProgress(0), 2000);
    } catch (error: any) {
      console.error('Analysis failed:', error);
      toast.error(`Analysis failed: ${error.message}`);
      setUploadProgress(0);
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
    analysisHistory,
    analysisResults: result, // Alias for backward compatibility
    uploadProgress,
    analyzeImages
  };
};
