
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Camera, Trash2, Plus, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';
import { useCoinImageManagement } from '@/hooks/useCoinImageManagement';
import { toast } from 'sonner';

interface EnhancedCoinImageManagerProps {
  coinId: string;
  coinName: string;
  currentImages: string[];
  onImagesUpdated: () => void;
  maxImages?: number;
}

const EnhancedCoinImageManager: React.FC<EnhancedCoinImageManagerProps> = ({
  coinId,
  coinName,
  currentImages,
  onImagesUpdated,
  maxImages = 10
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [images, setImages] = useState(currentImages);
  
  const {
    isLoading,
    isUpdating,
    deleteImageFromCoin,
    replaceImageInCoin,
    addNewImageToCoin
  } = useCoinImageManagement({ coinId, currentImages: images });

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (files.length > remainingSlots) {
      toast.error(`Can only upload ${remainingSlots} more images (max ${maxImages})`);
      return;
    }

    setUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`📸 Uploading image ${i + 1} for coin: ${coinName}`);
        
        const newImages = await addNewImageToCoin(file);
        setImages(newImages);
        
        toast.success(`Image ${i + 1} uploaded successfully`);
      }
      
      onImagesUpdated();
      toast.success(`${files.length} images uploaded successfully!`);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    try {
      const newImages = await deleteImageFromCoin(images[index], index);
      setImages(newImages);
      onImagesUpdated();
      toast.success('Image removed successfully');
    } catch (error) {
      console.error('Failed to remove image:', error);
      toast.error('Failed to remove image');
    }
  };

  const handleReplaceImage = async (index: number, file: File) => {
    try {
      console.log(`🔄 Replacing image ${index + 1} for coin: ${coinName}`);
      const newImages = await replaceImageInCoin(file, index);
      setImages(newImages);
      onImagesUpdated();
      toast.success('Image replaced successfully');
    } catch (error) {
      console.error('Failed to replace image:', error);
      toast.error('Failed to replace image');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Enhanced Image Manager - {coinName}
          <Badge variant="outline">
            {images.length}/{maxImages} images
          </Badge>
          {isUpdating && (
            <Badge variant="secondary" className="animate-pulse">
              Updating...
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            id="image-upload"
            disabled={uploading || images.length >= maxImages || isLoading}
          />
          <label
            htmlFor="image-upload"
            className={`cursor-pointer flex flex-col items-center gap-2 ${
              uploading || images.length >= maxImages || isLoading ? 'opacity-50 cursor-not-allowed' : ''
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

        {/* Images Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`${coinName} image ${index + 1}`}
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
                      disabled={isLoading || isUpdating}
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
                      disabled={isLoading || isUpdating}
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
        <div className="flex items-center justify-between">
          {images.length > 0 ? (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>{images.length} images ready</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <AlertTriangle className="h-4 w-4" />
              <span>No images uploaded yet</span>
            </div>
          )}
          
          {isUpdating && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="animate-spin h-4 w-4 border-b-2 border-blue-600 rounded-full"></div>
              <span>Updating...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedCoinImageManager;
