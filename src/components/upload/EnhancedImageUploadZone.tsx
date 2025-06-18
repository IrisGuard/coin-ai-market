
import React, { useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, X, CheckCircle, Camera } from 'lucide-react';
import { useEnhancedImageUpload } from '@/hooks/upload/useEnhancedImageUpload';
import { toast } from '@/hooks/use-toast';
import type { UploadedImage } from '@/types/upload';

interface EnhancedImageUploadZoneProps {
  onImagesUploaded: (images: UploadedImage[]) => void;
  maxImages?: number;
  title?: string;
}

const EnhancedImageUploadZone = ({ 
  onImagesUploaded, 
  maxImages = 10,
  title = "Upload Coin Images"
}: EnhancedImageUploadZoneProps) => {
  const { 
    images, 
    isUploading, 
    uploadProgress, 
    handleMultipleFiles, 
    removeImage, 
    clearImages 
  } = useEnhancedImageUpload();

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    if (files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Please select up to ${maxImages} images`,
        variant: "destructive",
      });
      return;
    }

    try {
      const uploadedImages = await handleMultipleFiles(files);
      onImagesUploaded(uploadedImages);
      
      toast({
        title: "Images uploaded successfully!",
        description: `${files.length} images uploaded with permanent URLs`,
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    }
  }, [handleMultipleFiles, maxImages, onImagesUploaded]);

  const handleRemoveImage = useCallback((index: number) => {
    removeImage(index);
    onImagesUploaded(images.filter((_, i) => i !== index));
  }, [removeImage, images, onImagesUploaded]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 text-sm mb-4">
              Select 1-{maxImages} high-quality images (JPEG, PNG, WebP)
            </p>
          </div>

          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-600">
                  Click to select images
                </p>
                <p className="text-sm text-gray-500">
                  Or drag and drop up to {maxImages} images
                </p>
              </div>
            </label>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading to Supabase Storage...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Image Preview Grid */}
          {images.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">
                  Uploaded Images ({images.length}/{maxImages})
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearImages();
                    onImagesUploaded([]);
                  }}
                >
                  Clear All
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square border-2 border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={image.url || image.preview} // Use permanent URL
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Image failed to load:', image.url);
                          const img = e.target as HTMLImageElement;
                          img.src = 'https://wdgnllgbfvjgurbqhfqb.supabase.co/storage/v1/object/public/coin-images/placeholder-coin.png';
                        }}
                      />
                    </div>
                    
                    {/* Remove button */}
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    
                    {/* Status badge */}
                    <div className="absolute bottom-1 left-1">
                      {image.uploaded && image.url && !image.url.startsWith('blob:') ? (
                        <Badge className="bg-green-500 text-white text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Permanent
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-500 text-white text-xs">
                          <Camera className="w-3 h-3 mr-1" />
                          Processing
                        </Badge>
                      )}
                    </div>
                    
                    {/* Image index */}
                    <Badge variant="outline" className="absolute top-1 left-1 text-xs">
                      {index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedImageUploadZone;
