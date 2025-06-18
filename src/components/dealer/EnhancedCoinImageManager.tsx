
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Camera, Trash2, Plus, RotateCcw, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { useCoinImageManagement } from '@/hooks/useCoinImageManagement';
import { toast } from 'sonner';

interface EnhancedCoinImageManagerProps {
  coinId: string;
  coinName: string;
  currentImages: string[];
  onImagesUpdated: () => void;
  maxImages?: number;
}

interface UploadProgress {
  total: number;
  completed: number;
  failed: number;
  currentFile?: string;
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
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ total: 0, completed: 0, failed: 0 });
  
  const {
    isLoading,
    isUpdating,
    deleteImageFromCoin,
    replaceImageInCoin,
    addNewImageToCoin
  } = useCoinImageManagement({ coinId, currentImages: images });

  const handleBulkFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (files.length > remainingSlots) {
      toast.error(`You can only upload ${remainingSlots} more images (maximum ${maxImages})`);
      return;
    }

    setUploading(true);
    const fileArray = Array.from(files);
    
    // Initialize progress tracking
    setUploadProgress({
      total: fileArray.length,
      completed: 0,
      failed: 0
    });

    try {
      console.log(`🚀 Starting bulk upload of ${fileArray.length} images for coin: ${coinName}`);
      
      // Process all files in parallel using Promise.allSettled
      const uploadPromises = fileArray.map(async (file, index) => {
        try {
          setUploadProgress(prev => ({ ...prev, currentFile: file.name }));
          console.log(`📸 Uploading image ${index + 1}/${fileArray.length}: ${file.name}`);
          
          const newImages = await addNewImageToCoin(file);
          
          // Update progress
          setUploadProgress(prev => ({
            ...prev,
            completed: prev.completed + 1,
            currentFile: undefined
          }));
          
          return { success: true, newImages, fileName: file.name };
        } catch (error) {
          console.error(`❌ Failed to upload ${file.name}:`, error);
          
          setUploadProgress(prev => ({
            ...prev,
            failed: prev.failed + 1,
            currentFile: undefined
          }));
          
          return { success: false, error, fileName: file.name };
        }
      });

      // Wait for all uploads to complete
      const results = await Promise.allSettled(uploadPromises);
      
      // Process results
      let successCount = 0;
      let failCount = 0;
      let latestImages = images;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
          successCount++;
          latestImages = result.value.newImages;
        } else {
          failCount++;
        }
      });

      // Update final state
      setImages(latestImages);
      onImagesUpdated();

      // Show final results
      if (successCount > 0 && failCount === 0) {
        toast.success(`🎉 All ${successCount} images uploaded successfully!`);
      } else if (successCount > 0 && failCount > 0) {
        toast.success(`✅ ${successCount} images uploaded successfully, ${failCount} failed`);
      } else {
        toast.error(`❌ All ${failCount} uploads failed`);
      }

      console.log(`✅ Bulk upload complete: ${successCount} success, ${failCount} failed`);
      
    } catch (error) {
      console.error('❌ Bulk upload error:', error);
      toast.error('Failed to complete bulk upload');
    } finally {
      setUploading(false);
      setUploadProgress({ total: 0, completed: 0, failed: 0 });
    }
  };

  const handleRemoveImage = async (index: number) => {
    try {
      const newImages = await deleteImageFromCoin(images[index], index);
      setImages(newImages);
      onImagesUpdated();
    } catch (error) {
      console.error('Failed to remove image:', error);
    }
  };

  const handleReplaceImage = async (index: number, file: File) => {
    try {
      console.log(`🔄 Replacing image ${index + 1} for coin: ${coinName}`);
      const newImages = await replaceImageInCoin(file, index);
      setImages(newImages);
      onImagesUpdated();
    } catch (error) {
      console.error('Failed to replace image:', error);
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
    handleBulkFileUpload(files);
  };

  return (
    <div className="bg-white">
      <Card className="bg-white border-gray-200">
        <CardHeader className="bg-white">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Camera className="h-5 w-5" />
            Bulk Image Management - {coinName}
            <Badge variant="outline" className="border-gray-300 text-gray-700">
              {images.length}/{maxImages} images
            </Badge>
            {(isUpdating || uploading) && (
              <Badge variant="secondary" className="animate-pulse bg-blue-100 text-blue-800">
                <Clock className="h-3 w-3 mr-1" />
                Processing...
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 bg-white">
          {/* Bulk Upload Area */}
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors bg-white ${
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
              onChange={(e) => handleBulkFileUpload(e.target.files)}
              className="hidden"
              id="bulk-image-upload"
              disabled={uploading || images.length >= maxImages || isLoading}
            />
            <label
              htmlFor="bulk-image-upload"
              className={`cursor-pointer flex flex-col items-center gap-3 ${
                uploading || images.length >= maxImages || isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <div className="space-y-1">
                <span className="text-lg font-medium text-gray-600">
                  {uploading ? 'Uploading...' : 
                   images.length >= maxImages ? 'Maximum number of images reached' :
                   'Bulk Upload Images'}
                </span>
                <span className="text-sm text-gray-500 block">
                  Drop multiple images here or click to select up to {maxImages - images.length} files
                </span>
                <span className="text-xs text-gray-400 block">
                  PNG, JPG, JPEG up to 10MB each • Parallel processing for faster uploads
                </span>
              </div>
            </label>
          </div>

          {/* Upload Progress */}
          {uploading && uploadProgress.total > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-900">
                      Bulk Upload Progress
                    </span>
                    <span className="text-blue-700">
                      {uploadProgress.completed + uploadProgress.failed}/{uploadProgress.total}
                    </span>
                  </div>
                  
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${((uploadProgress.completed + uploadProgress.failed) / uploadProgress.total) * 100}%` 
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm text-blue-700">
                    <span>✅ Success: {uploadProgress.completed}</span>
                    {uploadProgress.failed > 0 && (
                      <span>❌ Failed: {uploadProgress.failed}</span>
                    )}
                  </div>
                  
                  {uploadProgress.currentFile && (
                    <div className="text-sm text-blue-600">
                      📸 Uploading: {uploadProgress.currentFile}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Images Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-white border-2 border-gray-200">
                    <img
                      src={imageUrl}
                      alt={`${coinName} image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    
                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex gap-1">
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
                        disabled={isLoading || isUpdating || uploading}
                      />
                      <label
                        htmlFor={`replace-${index}`}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full shadow-lg transition-colors flex items-center justify-center"
                        title="Replace image"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </label>
                      
                      {/* Delete button */}
                      <Button
                        variant="destructive"
                        size="sm"
                        className="p-1.5 h-auto rounded-full shadow-lg"
                        onClick={() => handleRemoveImage(index)}
                        disabled={isLoading || isUpdating || uploading}
                        title="Delete image"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {/* Image index badge */}
                    <Badge className="absolute top-2 left-2 bg-white/90 text-gray-800 text-xs">
                      {index + 1}
                    </Badge>

                    {/* Primary image indicator */}
                    {index === 0 && (
                      <Badge className="absolute bottom-2 left-2 bg-green-600 text-white text-xs">
                        Primary
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Add more images button */}
              {images.length < maxImages && (
                <label
                  htmlFor="bulk-image-upload"
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50 hover:bg-gray-100"
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
            
            {(isUpdating || uploading) && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="animate-spin h-4 w-4 border-b-2 border-blue-600 rounded-full"></div>
                <span>{uploading ? 'Bulk uploading...' : 'Updating...'}</span>
              </div>
            )}
          </div>

          {/* Enhanced Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 mb-2">Bulk Image Management Guidelines:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Upload multiple images simultaneously for faster processing</li>
                <li>• The first image becomes the primary display image</li>
                <li>• Drag & drop multiple files or click to select up to {maxImages} images</li>
                <li>• Each image can be replaced or deleted individually</li>
                <li>• Modal stays open after operations - click "Done" when finished</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedCoinImageManager;
