
import { useState } from 'react';
import { Camera, Photo } from '@capacitor/camera';
import { Camera as CameraIcon, X, Image, Loader2 } from 'lucide-react';

interface MobileCameraUploaderProps {
  onImagesSelected: (images: { file: File; preview: string }[]) => void;
  maxImages?: number;
}

const MobileCameraUploader = ({ onImagesSelected, maxImages = 5 }: MobileCameraUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const takePicture = async () => {
    try {
      setIsLoading(true);
      
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: 'uri',
        source: 'camera'
      });
      
      if (!image.webPath) {
        throw new Error('Failed to get image path');
      }

      // Convert the webPath to a File object
      const response = await fetch(image.webPath);
      const blob = await response.blob();
      const file = new File([blob], `coin-photo-${Date.now()}.jpeg`, { type: 'image/jpeg' });
      
      // Create a preview URL
      const preview = URL.createObjectURL(file);
      
      onImagesSelected([{ file, preview }]);
    } catch (error) {
      console.error('Error taking picture:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pickFromGallery = async () => {
    try {
      setIsLoading(true);
      
      const images = await Camera.pickImages({
        quality: 90,
        limit: maxImages
      });
      
      if (images.photos.length === 0) {
        return;
      }

      const results = await Promise.all(
        images.photos.map(async (photo: Photo) => {
          if (!photo.webPath) {
            return null;
          }
          
          // Convert the webPath to a File object
          const response = await fetch(photo.webPath);
          const blob = await response.blob();
          const file = new File([blob], `coin-photo-${Date.now()}-${Math.random().toString(36).substring(7)}.jpeg`, { type: 'image/jpeg' });
          
          // Create a preview URL
          const preview = URL.createObjectURL(file);
          
          return { file, preview };
        })
      );

      // Filter out any null values and pass the results
      onImagesSelected(results.filter(Boolean) as { file: File; preview: string }[]);
    } catch (error) {
      console.error('Error picking images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-2">
        <button
          onClick={takePicture}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center bg-coin-blue text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors"
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
          disabled={isLoading}
          className="flex-1 flex items-center justify-center border-2 border-coin-blue text-coin-blue py-3 rounded-lg hover:bg-coin-blue hover:bg-opacity-10 transition-colors"
        >
          {isLoading ? (
            <Loader2 size={20} className="mr-2 animate-spin" />
          ) : (
            <Image size={20} className="mr-2" />
          )}
          Gallery
        </button>
      </div>
      
      <p className="text-sm text-gray-500 text-center">
        Take 2-5 photos of your coin (front, back and other angles)
      </p>
    </div>
  );
};

export default MobileCameraUploader;
