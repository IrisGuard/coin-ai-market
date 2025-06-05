
import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export const useImageHandling = () => {
  const compressImage = useCallback(async (file: File, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1024px width/height)
        const maxSize = 1024;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Image compression failed'));
          }
        }, 'image/jpeg', quality);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

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

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    try {
      // Compress image before upload
      const compressedFile = await compressImage(file);
      
      // Convert to base64 for now (can be replaced with actual upload service)
      const base64 = await convertToBase64(compressedFile);
      
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [compressImage, convertToBase64]);

  return {
    compressImage,
    convertToBase64,
    uploadImage,
  };
};
