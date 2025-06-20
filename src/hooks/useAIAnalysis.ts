
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
  description?: string;
  structured_description?: string;
  category?: string;
}

export const useAIAnalysis = () => {
  const { analyzeImage, isAnalyzing, result, error, clearResults } = useRealAICoinRecognition();
  const [analysisHistory, setAnalysisHistory] = useState<AIAnalysisResult[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const performAnalysis = async (imageFile: File): Promise<AIAnalysisResult | null> => {
    try {
      const result = await analyzeImage(imageFile);
      
      if (result) {
        const analysisResult: AIAnalysisResult = {
          name: result.name,
          year: result.year,
          country: result.country,
          denomination: result.denomination,
          composition: result.composition,
          grade: result.grade,
          estimatedValue: result.estimatedValue,
          rarity: result.rarity,
          mint: result.mint,
          diameter: result.diameter,
          weight: result.weight,
          errors: result.errors,
          confidence: result.confidence,
          aiProvider: result.aiProvider,
          processingTime: result.processingTime,
          description: result.description,
          structured_description: result.structured_description,
          category: result.category
        };

        setAnalysisHistory(prev => [analysisResult, ...prev.slice(0, 4)]);
        
        const confidencePercent = Math.round(result.confidence * 100);
        toast.success(
          `Complete AI Analysis! ${result.name} identified with ${confidencePercent}% confidence. All fields auto-filled.`
        );
        
        return analysisResult;
      }
      
      return null;
    } catch (error: any) {
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
      const firstImage = images[0];
      if (!firstImage.file) {
        throw new Error('No valid image file found');
      }

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const analysisResult = await performAnalysis(firstImage.file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (analysisResult) {
        updateCoinData({
          title: analysisResult.name,
          description: analysisResult.description || `${analysisResult.name} from ${analysisResult.year}. Grade: ${analysisResult.grade}. ${analysisResult.composition}.`,
          year: analysisResult.year.toString(),
          country: analysisResult.country,
          denomination: analysisResult.denomination,
          grade: analysisResult.grade,
          composition: analysisResult.composition,
          rarity: analysisResult.rarity,
          mint: analysisResult.mint || '',
          diameter: analysisResult.diameter?.toString() || '',
          weight: analysisResult.weight?.toString() || '',
          price: analysisResult.estimatedValue.toString(),
          condition: analysisResult.grade,
          category: analysisResult.category || 'WORLD COINS'
        });

        const updatedImages = images.map(img => ({
          ...img,
          uploaded: true,
          uploading: false
        }));
        setImages(updatedImages);
      }

      setTimeout(() => setUploadProgress(0), 2000);
    } catch (error: any) {
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
    analysisResults: result,
    uploadProgress,
    analyzeImages
  };
};
