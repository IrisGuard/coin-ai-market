
import { useState, useRef, useCallback } from 'react';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Camera as CameraIcon, X, Image, Loader2, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ImageWithQuality {
  file: File;
  preview: string;
  quality: 'excellent' | 'good' | 'poor';
  blurScore: number;
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

  const requiredPhotos = coinType === 'error' ? 4 : 2; // Error coins need more photos
  const minRequiredPhotos = coinType === 'error' ? 2 : 2;

  const analyzeImageQuality = useCallback(async (imageFile: File): Promise<{ quality: 'excellent' | 'good' | 'poor', blurScore: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
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
        const sampleSize = Math.min(10000, pixels.length / 4); // Sample for performance
        
        for (let i = 0; i < sampleSize * 4; i += 4) {
          const intensity = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
          sum += intensity;
          sumSquares += intensity * intensity;
        }
        
        const mean = sum / sampleSize;
        const variance = (sumSquares / sampleSize) - (mean * mean);
        const blurScore = Math.min(variance / 1000, 1); // Normalize to 0-1
        
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
        height: 1024 // Square format
      });
      
      if (!image.webPath) {
        throw new Error('Failed to get image path');
      }

      const response = await fetch(image.webPath);
      const blob = await response.blob();
      const file = new File([blob], `coin-${step}-${Date.now()}.jpeg`, { type: 'image/jpeg' });
      
      // Analyze image quality
      const { quality, blurScore } = await analyzeImageQuality(file);
      
      if (quality === 'poor') {
        toast({
          title: "Photo Quality Too Low",
          description: "The image is too blurry. Please retake the photo with better lighting and keep the camera steady.",
          variant: "destructive",
        });
        setShowSquareGuide(false);
        return;
      }
      
      const preview = URL.createObjectURL(file);
      const newImage: ImageWithQuality = { file, preview, quality, blurScore };
      
      setCapturedImages(prev => [...prev, newImage]);
      
      // Move to next step
      if (step === 'front') {
        setCurrentStep('back');
      } else if (step === 'back' && coinType === 'error') {
        setCurrentStep('error');
      } else {
        setCurrentStep('complete');
      }
      
      toast({
        title: "Photo Captured",
        description: `${quality === 'excellent' ? 'Excellent' : 'Good'} quality photo captured!`,
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
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                Taking Photo...
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
                  <div className="absolute bottom-1 left-1 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                    {image.quality}
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
          <h4 className="font-medium text-blue-800 mb-2">📸 Quality Tips:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use good lighting (natural light is best)</li>
            <li>• Keep camera steady and focused</li>
            <li>• Fill the square frame with the coin</li>
            <li>• Avoid shadows and reflections</li>
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
