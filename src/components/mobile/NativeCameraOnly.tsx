import { useState } from 'react';
import { Camera as CameraIcon, X, Loader2, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { uploadImage } from '@/utils/imageUpload';

interface NativeCameraOnlyProps {
  onImagesSelected: (images: { file: File; preview: string; url?: string }[]) => void;
  maxImages?: number;
}

const NativeCameraOnly = ({ onImagesSelected, maxImages = 5 }: NativeCameraOnlyProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImages, setCapturedImages] = useState<{ file: File; preview: string; url?: string }[]>([]);

  const handleFileSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;
    
    setIsCapturing(true);
    
    try {
      const processedImages = [];
      
      for (const file of files) {
        const preview = URL.createObjectURL(file);
        const uploadedUrl = await uploadImage(file, 'coin-images');
        
        processedImages.push({
          file,
          preview,
          url: uploadedUrl
        });
      }
      
      const updatedImages = [...capturedImages, ...processedImages];
      setCapturedImages(updatedImages);
      onImagesSelected(updatedImages);
      
      toast({
        title: "Images Selected!",
        description: `${files.length} image(s) processed and uploaded successfully.`,
      });
      
    } catch (error: any) {
      console.error('File processing failed:', error);
      toast({
        title: "Upload Error",
        description: error.message || "Failed to process images. Please try again.",
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
        <label className="flex-1 flex items-center justify-center bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors cursor-pointer">
          {isCapturing ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <CameraIcon className="h-5 w-5 mr-2" />
          )}
          {isCapturing ? 'Processing...' : 'Select Images'}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelection}
            className="hidden"
            disabled={isCapturing || capturedImages.length >= maxImages}
          />
        </label>
      </div>

      {capturedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {capturedImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image.preview}
                alt={`Captured ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
              {image.url && (
                <div className="absolute bottom-1 right-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NativeCameraOnly;