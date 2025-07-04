import React, { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { uploadImage } from '@/utils/imageUpload';

interface EnhancedMobileCameraUploaderProps {
  onImagesSelected: (images: { file: File; preview: string; url?: string }[]) => void;
  maxImages?: number;
  onComplete?: () => void;
}

const EnhancedMobileCameraUploader: React.FC<EnhancedMobileCameraUploaderProps> = ({
  onImagesSelected,
  maxImages = 5
}) => {
  const [capturedImages, setCapturedImages] = useState<{ file: File; preview: string; url?: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    
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
        title: "Images Uploaded!",
        description: `${files.length} image(s) processed successfully.`,
      });
      
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = capturedImages.filter((_, i) => i !== index);
    setCapturedImages(updatedImages);
    onImagesSelected(updatedImages);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex gap-2">
            <label className="flex-1">
              <Button
                variant="outline"
                className="w-full"
                disabled={isUploading || capturedImages.length >= maxImages}
                asChild
              >
                <span>
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </span>
              </Button>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
            
            <label className="flex-1">
              <Button
                variant="outline"
                className="w-full"
                disabled={isUploading || capturedImages.length >= maxImages}
                asChild
              >
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </span>
              </Button>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>

          {capturedImages.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {capturedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.preview}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <p className="text-xs text-muted-foreground text-center">
            {capturedImages.length}/{maxImages} images selected
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedMobileCameraUploader;