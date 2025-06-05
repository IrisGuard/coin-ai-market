
import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { uploadImage, compressImage } from '@/utils/imageUpload';

export const useImageHandling = () => {
  const convertToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    try {
      // Compress image before upload
      const compressedFile = await compressImage(file);
      
      // Try to upload to Supabase Storage first
      try {
        return await uploadImage(compressedFile);
      } catch (storageError) {
        console.warn('Storage upload failed, falling back to base64:', storageError);
        
        // Fallback to base64 if storage fails
        const base64 = await convertToBase64(compressedFile);
        return `data:image/jpeg;base64,${base64}`;
      }
    } catch (error) {
      console.error('Failed to process image:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [convertToBase64]);

  return {
    compressImage,
    convertToBase64,
    uploadImage: handleImageUpload,
  };
};
