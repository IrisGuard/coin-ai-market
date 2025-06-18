
import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Camera as CameraIcon, X, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface NativeCameraOnlyProps {
  onImagesSelected: (images: { file: File; preview: string }[]) => void;
  maxImages?: number;
}

const NativeCameraOnly = ({ onImagesSelected, maxImages = 5 }: NativeCameraOnlyProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImages, setCapturedImages] = useState<{ file: File; preview: string }[]>([]);

  const captureFromCamera = async () => {
    try {
      setIsCapturing(true);
      
      const image = await Camera.getPhoto({
        quality: 95,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        width: 1200,
        height: 1200,
        saveToGallery: false
      });
      
      if (!image.webPath) {
        throw new Error('Failed to capture image');
      }

      const response = await fetch(image.webPath);
      const blob = await response.blob();
      const file = new File([blob], `coin-camera-${Date.now()}.jpeg`, { type: 'image/jpeg' });
      
      const preview = URL.createObjectURL(file);
      const newImage = { file, preview };
      
      const updatedImages = [...capturedImages, newImage];
      setCapturedImages(updatedImages);
      onImagesSelected(updatedImages);

      toast({
        title: "Native Camera Success!",
        description: "Image captured successfully from device camera",
      });
      
    } catch (error: any) {
      console.error('Native camera capture failed:', error);
      toast({
        title: "Camera Error",
        description: error.message || "Failed to access camera. Please ensure camera permissions are granted.",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const selectFromGallery = async () => {
    try {
      setIsCapturing(true);
      
      const image = await Camera.getPhoto({
        quality: 95,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
      });
      
      if (!image.webPath) {
        throw new Error('Failed to select image');
      }

      const response = await fetch(image.webPath);
      const blob = await response.blob();
      const file = new File([blob], `coin-gallery-${Date.now()}.jpeg`, { type: 'image/jpeg' });
      
      const preview = URL.createObjectURL(file);
      const newImage = { file, preview };
      
      const updatedImages = [...capturedImages, newImage];
      setCapturedImages(updatedImages);
      onImagesSelected(updatedImages);

      toast({
        title: "Gallery Selection Success!",
        description: "Image selected from gallery successfully",
      });
      
    } catch (error: any) {
      console.error('Gallery selection failed:', error);
      toast({
        title: "Gallery Error",
        description: error.message || "Failed to access gallery. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = capturedImages.filter((_, i) => i !== index);
    setCapturedImages(updatedImages);
    onImagesSelected(updatedImages);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-2">
        <button
          onClick={captureFromCamera}
          disabled={isCapturing || capturedImages.length >= maxImages}
          className="flex-1 flex items-center justify-center bg-coin-blue text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          style={{ touchAction: 'manipulation' }}
        >
          {isCapturing ? (
            <Loader2 size={20} className="mr-2 animate-spin" />
          ) : (
            <CameraIcon size={20} className="mr-2" />
          )}
          Native Camera
        </button>
        
        <button
          onClick={selectFromGallery}
          disabled={isCapturing || capturedImages.length >= maxImages}
          className="flex-1 flex items-center justify-center border-2 border-coin-blue text-coin-blue py-3 rounded-lg hover:bg-coin-blue hover:bg-opacity-10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          style={{ touchAction: 'manipulation' }}
        >
          {isCapturing ? (
            <Loader2 size={20} className="mr-2 animate-spin" />
          ) : (
            <CameraIcon size={20} className="mr-2" />
          )}
          Gallery
        </button>
      </div>

      {capturedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {capturedImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image.preview}
                alt={`Coin ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border-2 border-green-300"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <p className="text-sm text-green-600 text-center font-medium">
        Native Camera Ready • {maxImages - capturedImages.length} more photos available
        {capturedImages.length > 0 && ` • ${capturedImages.length}/${maxImages} captured`}
      </p>
    </div>
  );
};

export default NativeCameraOnly;
