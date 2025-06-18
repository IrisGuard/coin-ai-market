
import { useState } from 'react';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Camera as CameraIcon, X, Image, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MobileCameraUploaderProps {
  onImagesSelected: (images: { file: File; preview: string }[]) => void;
  maxImages?: number;
}

const MobileCameraUploader = ({ onImagesSelected, maxImages = 5 }: MobileCameraUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImages, setCapturedImages] = useState<{ file: File; preview: string }[]>([]);

  const takePicture = async () => {
    try {
      setIsLoading(true);
      
      // Native Capacitor Camera API
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        width: 1024,
        height: 1024
      });
      
      if (!image.webPath) {
        throw new Error('Failed to capture image');
      }

      // Convert to File object
      const response = await fetch(image.webPath);
      const blob = await response.blob();
      const file = new File([blob], `coin-photo-${Date.now()}.jpeg`, { type: 'image/jpeg' });
      
      const preview = URL.createObjectURL(file);
      const newImage = { file, preview };
      
      const updatedImages = [...capturedImages, newImage];
      setCapturedImages(updatedImages);
      onImagesSelected(updatedImages);

      toast({
        title: "Photo captured!",
        description: "Image captured successfully from native camera",
      });
      
    } catch (error: any) {
      console.error('Camera capture failed:', error);
      toast({
        title: "Camera Error",
        description: error.message || "Failed to capture photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pickFromGallery = async () => {
    try {
      setIsLoading(true);
      
      // Native Capacitor Gallery picker
      const image = await Camera.getPhoto({
        quality: 90,
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
        title: "Image selected!",
        description: "Image selected from gallery successfully",
      });
      
    } catch (error: any) {
      console.error('Gallery selection failed:', error);
      toast({
        title: "Gallery Error",
        description: error.message || "Failed to select image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = capturedImages.filter((_, i) => i !== index);
    setCapturedImages(updatedImages);
    onImagesSelected(updatedImages);
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Native Camera Controls */}
      <div className="flex space-x-2">
        <button
          onClick={takePicture}
          disabled={isLoading || capturedImages.length >= maxImages}
          className="flex-1 flex items-center justify-center bg-coin-blue text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 size={20} className="mr-2 animate-spin" />
          ) : (
            <CameraIcon size={20} className="mr-2" />
          )}
          Take Photo
        </button>
        
        <button
          onClick={pickFromGallery}
          disabled={isLoading || capturedImages.length >= maxImages}
          className="flex-1 flex items-center justify-center border-2 border-coin-blue text-coin-blue py-3 rounded-lg hover:bg-coin-blue hover:bg-opacity-10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 size={20} className="mr-2 animate-spin" />
          ) : (
            <Image size={20} className="mr-2" />
          )}
          Gallery
        </button>
      </div>

      {/* Image Preview Grid */}
      {capturedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {capturedImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image.preview}
                alt={`Coin ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <p className="text-sm text-gray-500 text-center">
        Take {maxImages - capturedImages.length} more photos of your coin (front, back and other angles)
        {capturedImages.length > 0 && ` • ${capturedImages.length}/${maxImages} captured`}
      </p>
    </div>
  );
};

export default MobileCameraUploader;
