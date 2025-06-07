
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useImageHandling = () => {
  const [isUploading, setIsUploading] = useState(false);

  const compressImage = async (file: File, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const maxWidth = 1024;
        const maxHeight = 1024;
        
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          } else {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    
    try {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const filePath = `coin-images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('coin-images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('coin-images')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
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
  };

  return {
    compressImage,
    uploadImage,
    convertToBase64,
    isUploading
  };
};
