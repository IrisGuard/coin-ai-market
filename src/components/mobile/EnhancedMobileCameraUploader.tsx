
import { useState, useRef, useCallback } from 'react';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Camera as CameraIcon, X, Image, Loader2, CheckCircle, AlertCircle, RotateCcw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { compressImage, getBandwidthQuality } from '@/utils/imageCompression';
import { useOfflineSync } from '@/hooks/useOfflineSync';

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

  const requiredPhotos = coinType === 'error' ? 4 : 2;
  const minRequiredPhotos = coinType === 'error' ? 2 : 2;

  const analyzeImageQuality = useCallback(async (imageFile: File): Promise<{ quality: 'excellent' | 'good' | 'poor', blurScore: number }> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Simple blur detection using edge detection
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) {
          resolve({ quality: 'good', blurScore: 0.7 });
          return;
        }
        
        // Calculate variance of pixel intensities (higher = sharper)
        const pixels = imageData.data;
        let sum = 0;
        let sumSquares = 0;
        const sampleSize = Math.min(10000, pixels.length / 4);
        
        for (let i = 0; i < sampleSize * 4; i += 4) {
          const intensity = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
          sum += intensity;
          sumSquares += intensity * intensity;
        }
        
        const mean = sum / sampleSize;
        const variance = (sumSquares / sampleSize) - (mean * mean);
        const blurScore = Math.min(variance / 1000, 1);
        
        let quality: 'excellent' | 'good' | 'poor';
        if (blurScore > 0.8) quality = 'excellent';
        else if (blurScore > 0.5) quality = 'good';
        else quality = 'poor';
        
        resolve({ quality, blurScore });
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  }, []);

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

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatFileSize = (bytes: number) => {
    return bytes < 1024 * 1024 
      ? `${Math.round(bytes / 1024)}KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-2">
        {['front', 'back', ...(coinType === 'error' ? ['error'] : [])].map((step, index) => (
          <div
            key={step}
            className={`w-3 h-3 rounded-full ${
              capturedImages.length > index ? 'bg-green-500' : 
              currentStep === step ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Offline Status */}
      {!isOnline && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-orange-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Offline Mode</span>
          </div>
          <p className="text-xs text-orange-600 mt-1">
            Photos will sync automatically when connection returns
          </p>
        </div>
      )}

      {/* Square Guide Overlay */}
      {showSquareGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <div className="w-80 h-80 border-4 border-white border-dashed rounded-lg">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-center">
                <p className="text-sm">Keep coin within the square</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
        {currentStep !== 'complete' && (
          <Button
            onClick={() => takePicture(currentStep)}
            disabled={isLoading || isCompressing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg"
          >
            {isLoading || isCompressing ? (
              <>
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                {isCompressing ? 'Compressing...' : 'Taking Photo...'}
              </>
            ) : (
              <>
                <CameraIcon className="w-6 h-6 mr-2" />
                Take {currentStep.charAt(0).toUpperCase() + currentStep.slice(1)} Photo
              </>
            )}
          </Button>
        )}

        {/* Captured Images Preview */}
        {capturedImages.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">Captured Photos ({capturedImages.length})</h4>
            <div className="grid grid-cols-2 gap-3">
              {capturedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.preview}
                    alt={`Captured ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <div className={`px-1 py-0.5 text-xs rounded ${getQualityColor(image.quality)} bg-white bg-opacity-90`}>
                      {image.quality === 'excellent' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                    </div>
                    <button
                      onClick={() => removeImage(index)}
                      className="bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="absolute bottom-1 left-1 flex gap-1">
                    <Badge className="text-xs bg-black bg-opacity-70 text-white">
                      {image.quality}
                    </Badge>
                    <Badge className="text-xs bg-green-600 text-white">
                      <Zap className="w-2 h-2 mr-1" />
                      {formatFileSize(image.compressedSize)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {capturedImages.length >= minRequiredPhotos && (
            <Button
              onClick={handleComplete}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete ({capturedImages.length} photos)
            </Button>
          )}
          
          {capturedImages.length > 0 && (
            <Button
              onClick={resetCapture}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Start Over
            </Button>
          )}
        </div>

        {/* Quality Tips */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">📸 Optimization Tips:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Images are automatically compressed for faster upload</li>
            <li>• Works offline - uploads sync when connection returns</li>
            <li>• Use good lighting (natural light is best)</li>
            <li>• Keep camera steady and focused</li>
            <li>• Fill the square frame with the coin</li>
            {coinType === 'error' && (
              <li>• Capture error details from multiple angles</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMobileCameraUploader;
