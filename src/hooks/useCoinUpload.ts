
import { useCallback } from 'react';
import { useCoinData } from '@/hooks/upload/useCoinData';
import { useImageUpload } from '@/hooks/upload/useImageUpload';
import { useAIAnalysis } from '@/hooks/upload/useAIAnalysis';
import { useCoinSubmission } from '@/hooks/upload/useCoinSubmission';
import type { CoinData } from '@/types/upload';

export const useCoinUpload = () => {
  const { coinData, updateCoinData } = useCoinData();
  const { 
    images, 
    dragActive, 
    handleFiles, 
    handleDrag, 
    handleDrop, 
    removeImage,
    setImages
  } = useImageUpload();
  const { 
    isAnalyzing, 
    result: analysisResults, 
    uploadProgress, 
    analyzeImages 
  } = useAIAnalysis();
  const { isSubmitting, submitListing } = useCoinSubmission();

  const handleUploadAndAnalyze = useCallback(async () => {
    await analyzeImages(images, updateCoinData, setImages);
  }, [images, analyzeImages, updateCoinData, setImages]);

  const handleSubmitListing = useCallback(async () => {
    await submitListing(coinData, images);
  }, [coinData, images, submitListing]);

  const handleCoinDataChange = useCallback((data: CoinData) => {
    updateCoinData(data);
  }, [updateCoinData]);

  return {
    images,
    isAnalyzing,
    analysisResults,
    isSubmitting,
    coinData,
    uploadProgress,
    dragActive,
    handleFiles,
    handleDrag,
    handleDrop,
    handleUploadAndAnalyze,
    handleSubmitListing,
    removeImage,
    handleCoinDataChange
  };
};
