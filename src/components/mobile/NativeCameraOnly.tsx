
import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Camera as CameraIcon, X, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { uploadImage } from '@/utils/imageUpload';

interface NativeCameraOnlyProps {
  onImagesSelected: (images: { file: File; preview: string; url?: string }[]) => void;
  maxImages?: number;
}

const NativeCameraOnly = ({ onImagesSelected, maxImages = 5 }: NativeCameraOnlyProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImages, setCapturedImages] = useState<{ file: File; preview: string; url?: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const processAndUploadImage = async (blob: Blob, source: string): Promise<{ file: File; preview: string; url: string }> => {
    const file = new File([blob], `coin-${source}-${Date.now()}.jpeg`, { type: 'image/jpeg' });
    const preview = URL.createObjectURL(file);
    
    // Upload immediately to Supabase Storage and wait for permanent URL
    console.log('📸 Uploading image to Supabase Storage...');
    const uploadedUrl = await uploadImage(file, 'coin-images');
    console.log('✅ Image uploaded with permanent URL:', uploadedUrl);
    
    // Verify URL is permanent (not blob:)
    if (uploadedUrl.startsWith('blob:')) {
      throw new Error('Upload failed: temporary URL returned');
    }
    
    return { file, preview, url: uploadedUrl };
  };

  const captureFromCamera = async () => {
    try {
      setIsCapturing(true);
      setIsUploading(true);
      
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
      
      // Wait for complete upload with permanent URL
      const processedImage = await processAndUploadImage(blob, 'camera');
      const updatedImages = [...capturedImages, processedImage];
      
      setCapturedImages(updatedImages);
      onImagesSelected(updatedImages);

      toast({
        title: "📸 Image Captured & Uploaded!",
        description: "Image successfully saved to cloud storage with permanent URL",
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
      setIsUploading(false);
    }
  };

  const selectFromGallery = async () => {
    try {
      setIsCapturing(true);
      setIsUploading(true);
      
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
      
      // Wait for complete upload with permanent URL
      const processedImage = await processAndUploadImage(blob, 'gallery');
      const updatedImages = [...capturedImages, processedImage];
      
      setCapturedImages(updatedImages);
      onImagesSelected(updatedImages);

      toast({
        title: "🖼️ Image Selected & Uploaded!",
        description: "Image successfully saved to cloud storage with permanent URL",
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
      setIsUploading(false);
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
          disabled={isCapturing || capturedImages.length >= maxImages || isUploading}
          className="flex-1 flex items-center justify-center bg-coin-blue text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          style={{ touchAction: 'manipulation' }}
        >
          {isCapturing || isUploading ? (
            <Loader2 size={20} className="mr-2 animate-spin" />
          ) : (
            <CameraIcon size={20} className="mr-2" />
          )}
          {isUploading ? 'Uploading...' : 'Native Camera'}
        </button>
        
        <button
          onClick={selectFromGallery}
          disabled={isCapturing || capturedImages.length >= maxImages || isUploading}
          className="flex-1 flex items-center justify-center border-2 border-coin-blue text-coin-blue py-3 rounded-lg hover:bg-coin-blue hover:bg-opacity-10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          style={{ touchAction: 'manipulation' }}
        >
          {isCapturing || isUploading ? (
            <Loader2 size={20} className="mr-2 animate-spin" />
          ) : (
            <CameraIcon size={20} className="mr-2" />
          )}
          {isUploading ? 'Uploading...' : 'Gallery'}
        </button>
      </div>

      {capturedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {capturedImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image.url || image.preview}
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
              {image.url && !image.url.startsWith('blob:') && (
                <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                  ✓ Permanent URL
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <p className="text-sm text-green-600 text-center font-medium">
        Native Camera Ready • {maxImages - capturedImages.length} more photos available
        {capturedImages.length > 0 && ` • ${capturedImages.length}/${maxImages} uploaded with permanent URLs`}
      </p>
    </div>
  );
};

export default NativeCameraOnly;
