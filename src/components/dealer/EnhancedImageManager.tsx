
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Camera, Trash2, Plus, RotateCcw, CheckCircle } from 'lucide-react';
import { uploadImage, deleteImage } from '@/utils/imageUpload';
import { toast } from 'sonner';

interface EnhancedImageManagerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  coinId?: string;
}

const EnhancedImageManager: React.FC<EnhancedImageManagerProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
  coinId
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (files.length > remainingSlots) {
      toast.error(`Can only upload ${remainingSlots} more images (max ${maxImages})`);
      return;
    }

    setUploading(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = `${Date.now()}-${i}`;
        
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: Math.min((prev[fileId] || 0) + 10, 90)
          }));
        }, 100);

        try {
          const imageUrl = await uploadImage(file, 'coin-images');
          newImages.push(imageUrl);
          
          clearInterval(progressInterval);
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
          
          toast.success(`Image ${i + 1} uploaded successfully`);
        } catch (error) {
          clearInterval(progressInterval);
          setUploadProgress(prev => {
            const { [fileId]: _, ...rest } = prev;
            return rest;
          });
          throw error;
        }
      }

      onImagesChange([...images, ...newImages]);
      toast.success(`${newImages.length} images uploaded successfully!`);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index];
    
    try {
      await deleteImage(imageUrl, 'coin-images');
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
      toast.success('Image removed successfully');
    } catch (error) {
      console.error('Failed to remove image:', error);
      toast.error('Failed to remove image');
    }
  };

  const handleReplaceImage = async (index: number, file: File) => {
    setUploading(true);
    
    try {
      // Upload new image
      const newImageUrl = await uploadImage(file, 'coin-images');
      
      // Delete old image
      const oldImageUrl = images[index];
      try {
        await deleteImage(oldImageUrl, 'coin-images');
      } catch (error) {
        console.warn('Failed to delete old image:', error);
      }
      
      // Update images array
      const newImages = [...images];
      newImages[index] = newImageUrl;
      onImagesChange(newImages);
      
      toast.success('Image replaced successfully');
    } catch (error) {
      console.error('Failed to replace image:', error);
      toast.error('Failed to replace image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Enhanced Image Manager
          <Badge variant="outline">
            {images.length}/{maxImages} images
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            id="image-upload"
            disabled={uploading || images.length >= maxImages}
          />
          <label
            htmlFor="image-upload"
            className={`cursor-pointer flex flex-col items-center gap-2 ${
              uploading || images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-600">
              {uploading ? 'Uploading...' : 
               images.length >= maxImages ? 'Maximum images reached' :
               'Click to upload images or drag and drop'}
            </span>
            <span className="text-xs text-gray-500">
              PNG, JPG, JPEG up to 10MB each
            </span>
          </label>
        </div>

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="space-y-2">
            {Object.entries(uploadProgress).map(([fileId, progress]) => (
              <div key={fileId} className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm">{progress}%</span>
              </div>
            ))}
          </div>
        )}

        {/* Images Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Coin image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                
                {/* Image overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    {/* Replace button */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleReplaceImage(index, file);
                      }}
                      className="hidden"
                      id={`replace-${index}`}
                      disabled={uploading}
                    />
                    <label
                      htmlFor={`replace-${index}`}
                      className="cursor-pointer bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </label>
                    
                    {/* Delete button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="p-2 rounded-full"
                      onClick={() => handleRemoveImage(index)}
                      disabled={uploading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Image index badge */}
                <Badge className="absolute top-2 left-2 bg-black/70 text-white">
                  {index + 1}
                </Badge>
              </div>
            ))}
            
            {/* Add more images button */}
            {images.length < maxImages && (
              <label
                htmlFor="image-upload"
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                <div className="text-center">
                  <Plus className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-500">Add More</span>
                </div>
              </label>
            )}
          </div>
        )}

        {/* Status */}
        {images.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>{images.length} images ready</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedImageManager;
