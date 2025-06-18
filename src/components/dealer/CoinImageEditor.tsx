
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Camera, Plus, Trash2, Upload, RotateCcw, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useImageEditor } from '@/hooks/useImageEditor';

interface CoinImageEditorProps {
  coinId: string;
  coinName: string;
  currentImages: string[];
  onImagesUpdated?: (newImages: string[]) => void;
  maxImages?: number;
}

const CoinImageEditor: React.FC<CoinImageEditorProps> = ({
  coinId,
  coinName,
  currentImages,
  onImagesUpdated,
  maxImages = 10
}) => {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [images, setImages] = useState<string[]>(currentImages);

  const { 
    isLoading, 
    handleDeleteImage, 
    handleReplaceImage, 
    handleAddImage 
  } = useImageEditor({ 
    coinId, 
    coinName, 
    currentImages: images, 
    onImagesUpdated: (newImages) => {
      setImages(newImages);
      if (onImagesUpdated) {
        onImagesUpdated(newImages);
      }
    }
  });

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    try {
      if (typeof index === 'number') {
        await handleReplaceImage(file, index);
      } else {
        await handleAddImage(file);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  }, [handleReplaceImage, handleAddImage]);

  const handleAddImageFromUrl = useCallback(async () => {
    if (!newImageUrl.trim()) {
      toast.error('Please enter a valid image URL');
      return;
    }

    try {
      // Validate URL format
      new URL(newImageUrl);
      
      // Convert URL to File-like object for consistency
      const response = await fetch(newImageUrl);
      if (!response.ok) throw new Error('Failed to fetch image');
      
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: blob.type });
      
      await handleAddImage(file);
      setNewImageUrl('');
    } catch (error) {
      toast.error('Invalid image URL or failed to load image');
    }
  }, [newImageUrl, handleAddImage]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    
    setImages(newImages);
    setDraggedIndex(null);
    
    if (onImagesUpdated) {
      onImagesUpdated(newImages);
    }
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Camera className="h-5 w-5 text-blue-600" />
            Image Manager - {coinName}
          </h3>
          <p className="text-sm text-gray-600">
            {images.length} of {maxImages} images • Drag to reorder
          </p>
        </div>
        <Badge variant={images.length > 0 ? 'default' : 'secondary'}>
          {images.length === 0 ? 'No Images' : `${images.length} Image${images.length !== 1 ? 's' : ''}`}
        </Badge>
      </div>

      {/* Current Images Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((imageUrl, index) => (
          <Card 
            key={`${imageUrl}-${index}`}
            className="relative group cursor-move transition-transform hover:scale-105"
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <CardContent className="p-2">
              <div className="aspect-square relative rounded-md overflow-hidden bg-white border-2 border-gray-200">
                <img
                  src={imageUrl}
                  alt={`${coinName} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                
                {/* Primary Badge */}
                {index === 0 && (
                  <Badge 
                    className="absolute top-2 left-2 bg-blue-600 text-white text-xs"
                  >
                    Primary
                  </Badge>
                )}

                {/* Always visible action buttons */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-6 w-6 p-0 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => handleFileUpload(e as any, index);
                      input.click();
                    }}
                    disabled={isLoading}
                    title="Replace image"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-6 w-6 p-0 rounded-full bg-gray-600 hover:bg-gray-700 text-white shadow-lg"
                    onClick={() => window.open(imageUrl, '_blank')}
                    title="View full size"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-6 w-6 p-0 rounded-full shadow-lg"
                    onClick={() => handleDeleteImage(imageUrl, index)}
                    disabled={isLoading}
                    title="Delete image"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-500 truncate">
                  Image {index + 1}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Image Card */}
        {canAddMore && (
          <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
            <CardContent className="p-2">
              <div className="aspect-square flex flex-col items-center justify-center gap-2 text-gray-500 bg-gray-50 rounded-md">
                <Plus className="h-8 w-8" />
                <p className="text-xs text-center">Add Image</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => handleFileUpload(e as any);
                    input.click();
                  }}
                  disabled={isLoading}
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Upload
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Image from URL */}
      {canAddMore && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Add Image from URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                disabled={isLoading}
              />
              <Button 
                onClick={handleAddImageFromUrl}
                disabled={isLoading || !newImageUrl.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Supports JPG, PNG, WebP formats. Maximum 10MB per image.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-2">Image Management Tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Drag images to reorder them</li>
            <li>• First image becomes the primary display image</li>
            <li>• Use high-quality images for better coin identification</li>
            <li>• Include both obverse and reverse views when possible</li>
            <li>• Maximum {maxImages} images per coin</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoinImageEditor;
