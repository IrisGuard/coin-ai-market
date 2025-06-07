
import { useState, useCallback } from 'react';
import { useImageHandling } from '@/hooks/useImageHandling';
import { toast } from '@/hooks/use-toast';
import type { UploadedImage, CoinData } from '@/types/upload';

export const useAIAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { uploadImage, compressImage } = useImageHandling();

  const analyzeImages = useCallback(async (
    images: UploadedImage[], 
    updateCoinData: (data: CoinData) => void,
    setImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>
  ) => {
    if (images.length === 0) {
      toast({
        title: "No Images",
        description: "Please upload at least one image to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setUploadProgress(0);

    try {
      // Upload images first
      const uploadedImages = await Promise.all(
        images.map(async (image, index) => {
          if (!image.uploaded) {
            const compressedFile = await compressImage(image.file);
            const url = await uploadImage(compressedFile);
            setUploadProgress(((index + 1) / images.length) * 50);
            return { ...image, uploaded: true, url };
          }
          return image;
        })
      );

      setImages(uploadedImages);

      // Mock AI analysis results
      const mockResults = {
        coinName: "Morgan Silver Dollar",
        year: "1921",
        grade: "MS-63",
        estimatedValue: "$85.00",
        confidence: 0.92
      };

      setAnalysisResults(mockResults);
      setUploadProgress(100);

      toast({
        title: "Analysis Complete",
        description: `Identified as ${mockResults.coinName} with ${Math.round(mockResults.confidence * 100)}% confidence`,
      });

    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [compressImage, uploadImage]);

  return {
    isAnalyzing,
    analysisResults,
    uploadProgress,
    analyzeImages
  };
};
