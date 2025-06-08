
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, DollarSign } from 'lucide-react';
import CoinUploadHeader from '@/components/upload/CoinUploadHeader';
import CoinUploadFeatures from '@/components/upload/CoinUploadFeatures';
import ImageUploadCard from '@/components/upload/ImageUploadCard';
import AnalysisResultsCard from '@/components/upload/AnalysisResultsCard';
import CoinListingDetailsForm from '@/components/upload/CoinListingDetailsForm';
import CoinUploadTips from '@/components/upload/CoinUploadTips';
import { useCoinUpload } from '@/hooks/useCoinUpload';

const CoinUpload = () => {
  const { isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    images,
    uploadProgress,
    isAnalyzing,
    analysisResults,
    isSubmitting,
    dragActive,
    coinData,
    handleDrag,
    handleDrop,
    removeImage,
    handleUploadAndAnalyze,
    handleSubmitListing,
    handleFiles,
    handleCoinDataChange
  } = useCoinUpload();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="relative overflow-hidden pt-20">
        <div className="mesh-bg"></div>
        
        <div className="max-w-7xl mx-auto container-padding section-spacing relative z-10">
          <CoinUploadHeader />
          <CoinUploadFeatures />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <ImageUploadCard
              images={images}
              dragActive={dragActive}
              uploadProgress={uploadProgress}
              isAnalyzing={isAnalyzing}
              onDrag={handleDrag}
              onDrop={handleDrop}
              onImageSelect={handleImageSelect}
              onRemoveImage={removeImage}
              onUploadAndAnalyze={handleUploadAndAnalyze}
              fileInputRef={fileInputRef}
            />

            <AnalysisResultsCard analysisResults={analysisResults ? [analysisResults] : []} />

            <CoinListingDetailsForm
              coinData={coinData}
              onCoinDataChange={handleCoinDataChange}
            />

            <Button
              onClick={handleSubmitListing}
              disabled={
                !coinData.title || 
                (!coinData.price && !coinData.isAuction) || 
                (!coinData.startingBid && coinData.isAuction) ||
                images.length === 0 || 
                !images.every(img => img.uploaded) ||
                isSubmitting
              }
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Listing...
                </>
              ) : (
                <>
                  <DollarSign className="w-5 h-5 mr-2" />
                  {coinData.isAuction ? 'Start Auction' : 'Create Listing'}
                </>
              )}
            </Button>

            <CoinUploadTips />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CoinUpload;
