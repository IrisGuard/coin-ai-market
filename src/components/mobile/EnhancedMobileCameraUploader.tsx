
import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { toast } from '@/hooks/use-toast';
import { compressImage, getBandwidthQuality } from '@/utils/imageCompression';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { useImageQuality } from '@/hooks/useImageQuality';
import CameraProgressIndicator from './CameraProgressIndicator';
import CameraControls from './CameraControls';
import CapturedImagesGrid from './CapturedImagesGrid';
import CameraQualityTips from './CameraQualityTips';
import CameraSquareGuide from './CameraSquareGuide';
import CameraOfflineStatus from './CameraOfflineStatus';

interface ImageWithQuality {
  file: File;
  preview: string;
  quality: 'excellent' | 'good' | 'poor';
  blurScore: number;
  originalSize: number;
  compressedSize: number;
}

interface EnhancedMobileCameraUploaderProps {
  onImagesSelected: (images: ImageWithQuality[]) => void;
  maxImages?: number;
  coinType?: 'normal' | 'error';
}

const EnhancedMobileCameraUploader = ({ 
  onImagesSelected, 
  maxImages = 6,
  coinType = 'normal'
}: EnhancedMobileCameraUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImages, setCapturedImages] = useState<ImageWithQuality[]>([]);
  const [currentStep, setCurrentStep] = useState<'front' | 'back' | 'error' | 'complete'>('front');
  const [showSquareGuide, setShowSquareGuide] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  
  const { isOnline, addPendingItem } = useOfflineSync();
  const { analyzeImageQuality } = useImageQuality();

  const requiredPhotos = coinType === 'error' ? 4 : 2;
  const minRequiredPhotos = coinType === 'error' ? 2 : 2;

  const takePicture = async (step: typeof currentStep) => {
    try {
      setIsLoading(true);
      setShowSquareGuide(true);
      
      const image = await Camera.getPhoto({
        quality: 95,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        width: 1024,
        height: 1024
      });
      
      if (!image.webPath) {
        throw new Error('Failed to get image path');
      }

      const response = await fetch(image.webPath);
      const blob = await response.blob();
      const originalFile = new File([blob], `coin-${step}-${Date.now()}.jpeg`, { type: 'image/jpeg' });
      const originalSize = originalFile.size;
      
      // Compress the image based on network conditions
      setIsCompressing(true);
      const compressionOptions = getBandwidthQuality();
      const compressedFile = await compressImage(originalFile, compressionOptions);
      const compressedSize = compressedFile.size;
      
      const { quality, blurScore } = await analyzeImageQuality(compressedFile);
      
      if (quality === 'poor') {
        toast({
          title: "Photo Quality Too Low",
          description: "The image is too blurry. Please retake the photo with better lighting and keep the camera steady.",
          variant: "destructive",
        });
        setShowSquareGuide(false);
        setIsCompressing(false);
        return;
      }
      
      const preview = URL.createObjectURL(compressedFile);
      const newImage: ImageWithQuality = { 
        file: compressedFile, 
        preview, 
        quality, 
        blurScore,
        originalSize,
        compressedSize
      };
      
      setCapturedImages(prev => [...prev, newImage]);
      
      // Handle offline storage
      if (!isOnline) {
        addPendingItem('coin_upload', {
          image: newImage,
          timestamp: Date.now(),
          step: step
        });
      }
      
      if (step === 'front') {
        setCurrentStep('back');
      } else if (step === 'back' && coinType === 'error') {
        setCurrentStep('error');
      } else {
        setCurrentStep('complete');
      }
      
      const compressionRatio = Math.round((1 - compressedSize / originalSize) * 100);
      
      toast({
        title: isOnline ? "Photo Captured & Compressed" : "Photo Saved Offline",
        description: `${quality === 'excellent' ? 'Excellent' : 'Good'} quality photo ${isOnline ? 'uploaded' : 'saved'} (${compressionRatio}% smaller)`,
      });
      
    } catch (error) {
      console.error('Error taking picture:', error);
      toast({
        title: "Camera Error",
        description: "Failed to take photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowSquareGuide(false);
      setIsCompressing(false);
    }
  };

  const removeImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
    if (capturedImages.length <= minRequiredPhotos) {
      setCurrentStep('front');
    }
  };

  const handleComplete = () => {
    if (capturedImages.length >= minRequiredPhotos) {
      onImagesSelected(capturedImages);
      setCurrentStep('complete');
    }
  };

  const resetCapture = () => {
    setCapturedImages([]);
    setCurrentStep('front');
  };

  const getStepInstruction = () => {
    switch (currentStep) {
      case 'front':
        return 'Take a photo of the front (heads) side';
      case 'back':
        return 'Take a photo of the back (tails) side';
      case 'error':
        return 'Take additional photos of the error details';
      case 'complete':
        return 'All photos captured successfully!';
    }
  };

  return (
    <div className="space-y-6">
      <CameraProgressIndicator 
        currentStep={currentStep}
        coinType={coinType}
        capturedImagesCount={capturedImages.length}
      />

      <CameraOfflineStatus isOnline={isOnline} />

      <CameraSquareGuide showSquareGuide={showSquareGuide} />

      {/* Current Step Instruction */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {getStepInstruction()}
        </h3>
        <p className="text-sm text-gray-600">
          {coinType === 'error' 
            ? `Capture ${requiredPhotos} clear photos for error coin analysis`
            : 'Capture both sides of your coin clearly'
          }
        </p>
      </div>

      {/* Camera Controls */}
      <div className="space-y-4">
        <CameraControls
          currentStep={currentStep}
          isLoading={isLoading}
          isCompressing={isCompressing}
          capturedImagesCount={capturedImages.length}
          minRequiredPhotos={minRequiredPhotos}
          onTakePicture={takePicture}
          onComplete={handleComplete}
          onReset={resetCapture}
        />

        <CapturedImagesGrid 
          images={capturedImages}
          onRemoveImage={removeImage}
        />

        <CameraQualityTips coinType={coinType} />
      </div>
    </div>
  );
};

export default EnhancedMobileCameraUploader;
