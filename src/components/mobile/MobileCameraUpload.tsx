
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, X, CheckCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { uploadImage } from '@/utils/imageUpload';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MobileCameraUploadProps {
  onImagesUploaded?: (imageUrls: string[]) => void;
  maxImages?: number;
  coinData?: any;
}

const MobileCameraUpload = ({ 
  onImagesUploaded, 
  maxImages = 5,
  coinData 
}: MobileCameraUploadProps) => {
  const [capturedImages, setCapturedImages] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleCameraCapture = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages = files.slice(0, maxImages - capturedImages.length);
    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    
    setCapturedImages(prev => [...prev, ...newImages]);
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadImages = async () => {
    if (capturedImages.length === 0 || !user) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = capturedImages.map(async (file, index) => {
        const uploadedUrl = await uploadImage(file, 'coin-images');
        setUploadProgress(((index + 1) / capturedImages.length) * 100);
        return uploadedUrl;
      });

      const imageUrls = await Promise.all(uploadPromises);

      // Store image metadata in database
      if (coinData) {
        const { error } = await supabase
          .from('coin_images')
          .insert(
            imageUrls.map((url, index) => ({
              coin_id: coinData.id,
              image_url: url,
              image_type: index === 0 ? 'front' : index === 1 ? 'back' : 'detail',
              uploaded_by: user.id,
              upload_metadata: {
                original_filename: capturedImages[index].name,
                file_size: capturedImages[index].size,
                upload_method: 'mobile_camera'
              }
            }))
          );

        if (error) throw error;
      }

      onImagesUploaded?.(imageUrls);
      
      toast({
        title: "Upload Successful",
        description: `${imageUrls.length} images uploaded successfully`,
      });

      // Clear captured images
      setCapturedImages([]);
      setPreviewUrls(prev => {
        prev.forEach(url => URL.revokeObjectURL(url));
        return [];
      });

    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetCapture = () => {
    setCapturedImages([]);
    setPreviewUrls(prev => {
      prev.forEach(url => URL.revokeObjectURL(url));
      return [];
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Camera Controls */}
      <div className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleCameraCapture}
            disabled={isUploading || capturedImages.length >= maxImages}
            className="flex-1 py-3"
          >
            <Camera className="w-5 h-5 mr-2" />
            Camera
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.removeAttribute('capture');
                fileInputRef.current.click();
              }
            }}
            disabled={isUploading || capturedImages.length >= maxImages}
            className="flex-1 py-3"
          >
            <Upload className="w-5 h-5 mr-2" />
            Gallery
          </Button>
        </div>

        {/* Image Previews */}
        {previewUrls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-center text-gray-600">
                  Uploading... {Math.round(uploadProgress)}%
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={uploadImages}
                disabled={isUploading || capturedImages.length === 0}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Upload ({capturedImages.length})
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={resetCapture}
                disabled={isUploading}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Status Text */}
        <p className="text-sm text-center text-gray-600">
          {capturedImages.length}/{maxImages} images captured
        </p>
      </div>
    </div>
  );
};

export default MobileCameraUpload;
