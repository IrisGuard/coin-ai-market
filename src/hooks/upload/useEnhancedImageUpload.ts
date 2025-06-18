
import { useState, useCallback } from 'react';
import { uploadImage } from '@/utils/imageUpload';
import type { UploadedImage } from '@/types/upload';

export const useEnhancedImageUpload = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleMultipleFiles = useCallback(async (files: File[]) => {
    if (files.length === 0 || files.length > 10) {
      throw new Error('Please select 1-10 images');
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedImages: UploadedImage[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Update progress
        setUploadProgress(((i + 1) / files.length) * 100);
        
        // Upload to Supabase Storage immediately for permanent URL
        console.log(`📸 Uploading image ${i + 1}/${files.length} to Supabase Storage...`);
        const permanentUrl = await uploadImage(file, 'coin-images');
        
        // Verify URL is permanent (not blob:)
        if (permanentUrl.startsWith('blob:')) {
          throw new Error('Upload failed: temporary URL returned instead of permanent');
        }
        
        console.log(`✅ Image ${i + 1} uploaded with permanent URL:`, permanentUrl);
        
        uploadedImages.push({
          file,
          preview: permanentUrl, // Use permanent URL for preview
          url: permanentUrl,
          uploaded: true,
          uploading: false
        });
      }

      setImages(uploadedImages);
      console.log(`🎉 All ${files.length} images uploaded successfully with permanent URLs`);
      
      return uploadedImages;
    } catch (error) {
      console.error('❌ Multi-upload failed:', error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
  }, []);

  return {
    images,
    isUploading,
    uploadProgress,
    handleMultipleFiles,
    removeImage,
    clearImages,
    setImages
  };
};
