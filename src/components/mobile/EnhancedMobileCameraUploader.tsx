
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, CheckCircle, X, Zap } from 'lucide-react';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { toast } from '@/hooks/use-toast';
import { useEnhancedImageProcessing } from '@/hooks/useEnhancedImageProcessing';
import { ItemTypeSelector } from '@/components/ui/item-type-selector';
import type { ItemType } from '@/types/upload';

interface EnhancedMobileCameraUploaderProps {
  onImagesSelected: (images: { file: File; preview: string; itemType: ItemType }[]) => void;
  maxImages?: number;
  onComplete: () => void;
}

const EnhancedMobileCameraUploader = ({ 
  onImagesSelected, 
  maxImages = 5,
  onComplete 
}: EnhancedMobileCameraUploaderProps) => {
  const [selectedImages, setSelectedImages] = useState<{ file: File; preview: string; itemType: ItemType }[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedItemType, setSelectedItemType] = useState<ItemType>('coin');
  const { processImageWithItemType } = useEnhancedImageProcessing();

  const handleNativeCamera = async () => {
    try {
      setIsCapturing(true);
      
      const image = await CapacitorCamera.getPhoto({
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

      const response = await fetch(image.webPath);
      const blob = await response.blob();
      
      const processedBlob = await processImageWithItemType(new File([blob], 'camera-image.jpg'), selectedItemType);
      const processedFile = new File([processedBlob], `${selectedItemType}-${Date.now()}.jpeg`, { type: 'image/jpeg' });
      const preview = URL.createObjectURL(processedBlob);
      
      const newImage = { 
        file: processedFile, 
        preview, 
        itemType: selectedItemType 
      };
      
      const updatedImages = [...selectedImages, newImage];
      setSelectedImages(updatedImages);
      onImagesSelected(updatedImages);

      toast({
        title: "Photo captured!",
        description: "Image captured and processed successfully",
      });
      
    } catch (error: any) {
      console.error('Native camera failed:', error);
      toast({
        title: "Camera Error",
        description: error.message || "Failed to capture photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const handleNativeGallery = async () => {
    try {
      setIsCapturing(true);
      
      const image = await CapacitorCamera.getPhoto({
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
      
      const processedBlob = await processImageWithItemType(new File([blob], 'gallery-image.jpg'), selectedItemType);
      const processedFile = new File([processedBlob], `${selectedItemType}-${Date.now()}.jpeg`, { type: 'image/jpeg' });
      const preview = URL.createObjectURL(processedBlob);
      
      const newImage = { 
        file: processedFile, 
        preview, 
        itemType: selectedItemType 
      };
      
      const updatedImages = [...selectedImages, newImage];
      setSelectedImages(updatedImages);
      onImagesSelected(updatedImages);

      toast({
        title: "Image selected!",
        description: "Image selected and processed successfully",
      });
      
    } catch (error: any) {
      console.error('Native gallery failed:', error);
      toast({
        title: "Gallery Error",
        description: error.message || "Failed to select image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    onImagesSelected(updatedImages);
  };

  const handleComplete = () => {
    if (selectedImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please capture at least one image",
        variant: "destructive",
      });
      return;
    }

    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete();
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const getQualityBadge = (file: File) => {
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > 2) return { label: "High Quality", color: "bg-green-50 text-green-700 border-green-300" };
    if (sizeMB > 0.5) return { label: "Good Quality", color: "bg-blue-50 text-blue-700 border-blue-300" };
    return { label: "Basic Quality", color: "bg-yellow-50 text-yellow-700 border-yellow-300" };
  };

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600" />
          Enhanced Mobile Camera
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ItemTypeSelector 
          value={selectedItemType}
          onValueChange={setSelectedItemType}
        />

        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <Camera className="w-10 h-10 text-blue-600" />
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">
              Capture {selectedItemType === 'coin' ? 'Coin' : 'Banknote'} Images
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Take clear photos from multiple angles for best AI analysis
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleNativeCamera}
              disabled={isCapturing || selectedImages.length >= maxImages}
              className="bg-blue-600 hover:bg-blue-700 touch-manipulation"
              style={{ touchAction: 'manipulation' }}
            >
              <Camera className="w-4 h-4 mr-2" />
              Camera
            </Button>
            <Button 
              variant="outline"
              onClick={handleNativeGallery}
              disabled={isCapturing || selectedImages.length >= maxImages}
              className="touch-manipulation"
              style={{ touchAction: 'manipulation' }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Gallery
            </Button>
          </div>
        </div>

        {selectedImages.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Captured Images ({selectedImages.length}/{maxImages})</h4>
              <Badge variant="outline" className="text-xs">
                Ready for Analysis
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {selectedImages.map((image, index) => {
                const quality = getQualityBadge(image.file);
                return (
                  <div key={index} className="relative group">
                    <div className={`w-full border-2 border-gray-200 overflow-hidden ${
                      image.itemType === 'coin' ? 'aspect-square rounded-full' : 'aspect-[2/1] rounded-lg'
                    }`}>
                      <img
                        src={image.preview}
                        alt={`${image.itemType} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 touch-manipulation"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <Badge 
                      variant="outline" 
                      className={`absolute bottom-1 left-1 text-xs ${quality.color}`}
                    >
                      {quality.label}
                    </Badge>
                    <Badge variant="outline" className="absolute top-1 left-1 text-xs">
                      {image.itemType === 'coin' ? '🪙' : '💵'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Processing images...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {selectedImages.length > 0 && (
          <div className="flex gap-3">
            <Button 
              onClick={handleComplete}
              disabled={uploadProgress > 0 && uploadProgress < 100}
              className="flex-1 bg-green-600 hover:bg-green-700 touch-manipulation"
              style={{ touchAction: 'manipulation' }}
            >
              <Zap className="w-4 h-4 mr-2" />
              Start Analysis
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setSelectedImages([]);
                onImagesSelected([]);
              }}
              className="flex-1 touch-manipulation"
              style={{ touchAction: 'manipulation' }}
            >
              Clear All
            </Button>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="text-sm font-medium mb-2">Photography Tips</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Use good lighting - natural light is best</li>
            <li>• Keep the {selectedItemType} flat and centered</li>
            <li>• Capture both sides for complete analysis</li>
            <li>• Avoid shadows and reflections</li>
            <li>• Higher resolution images give better results</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedMobileCameraUploader;
