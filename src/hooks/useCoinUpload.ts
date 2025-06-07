
import { useCallback } from 'react';
import { useImageUpload } from './upload/useImageUpload';
import { useAIAnalysis } from './upload/useAIAnalysis';
import { useCoinData } from './upload/useCoinData';
import { useCoinSubmission } from './upload/useCoinSubmission';

export const useCoinUpload = () => {
  const imageUpload = useImageUpload();
  const aiAnalysis = useAIAnalysis();
  const coinDataHook = useCoinData();
  const submission = useCoinSubmission();

  const handleUploadAndAnalyze = useCallback(async () => {
    const uploadedImages = await imageUpload.uploadImages();
    if (uploadedImages.length > 0) {
      await aiAnalysis.analyzeImages();
    }
  }, [imageUpload.uploadImages, aiAnalysis.analyzeImages]);

  const handleSubmitListing = useCallback(async () => {
    await submission.submitListing(
      coinDataHook.coinData, 
      imageUpload.images,
      () => {
        // Reset form on success
        coinDataHook.resetCoinData();
        imageUpload.resetImages();
        aiAnalysis.resetAnalysis();
      }
    );
  }, [submission.submitListing, coinDataHook.coinData, imageUpload.images, coinDataHook.resetCoinData, imageUpload.resetImages, aiAnalysis.resetAnalysis]);

  const handleCoinDataChange = useCallback((data: typeof coinDataHook.coinData) => {
    coinDataHook.setCoinData(data);
  }, [coinDataHook.setCoinData]);

  return {
    // Image upload
    images: imageUpload.images,
    uploadProgress: imageUpload.uploadProgress,
    dragActive: imageUpload.dragActive,
    handleDrag: imageUpload.handleDrag,
    handleDrop: imageUpload.handleDrop,
    removeImage: imageUpload.removeImage,
    handleFiles: imageUpload.handleFiles,

    // AI Analysis
    isAnalyzing: aiAnalysis.isAnalyzing,
    analysisResults: aiAnalysis.analysisResults,

    // Coin Data
    coinData: coinDataHook.coinData,
    setCoinData: coinDataHook.setCoinData,
    handleCoinDataChange,

    // Submission
    isSubmitting: submission.isSubmitting,

    // Combined actions
    handleUploadAndAnalyze,
    handleSubmitListing
  };
};
