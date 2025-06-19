
import { supabase } from '@/integrations/supabase/client';
import { generateSecureRandomNumber, generateSecureRandomId } from './secureProductionUtils';

export const generateImageHash = (file: File): string => {
  const timestamp = Date.now().toString(36);
  const randomSuffix = generateSecureRandomId().substring(0, 8);
  const fileNameHash = btoa(file.name).replace(/[^a-zA-Z0-9]/g, '').substring(0, 6);
  return `img_${timestamp}_${fileNameHash}_${randomSuffix}`;
};

export const generateUploadProgress = (baseProgress: number): number => {
  const variation = generateSecureRandomNumber(-2, 5);
  return Math.min(100, Math.max(0, baseProgress + variation));
};

export const generateProcessingDelay = (): number => {
  return generateSecureRandomNumber(500, 2000);
};

export const generateCompressionRatio = (): number => {
  const ratio = generateSecureRandomNumber(70, 95) / 100;
  return Math.round(ratio * 100) / 100;
};

export const validateImageDimensions = (width: number, height: number): boolean => {
  const minDimension = 100;
  const maxDimension = 4096;
  return width >= minDimension && height >= minDimension && 
         width <= maxDimension && height <= maxDimension;
};

export const calculateOptimalDimensions = (width: number, height: number, maxSize: number = 1920): { width: number; height: number } => {
  if (width <= maxSize && height <= maxSize) {
    return { width, height };
  }
  
  const aspectRatio = width / height;
  
  if (width > height) {
    return {
      width: maxSize,
      height: Math.round(maxSize / aspectRatio)
    };
  } else {
    return {
      width: Math.round(maxSize * aspectRatio),
      height: maxSize
    };
  }
};

export const uploadImage = async (file: File, bucket: string = 'coin-images'): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${generateImageHash(file)}.${fileExt}`;
    const filePath = `${Date.now()}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw new Error('Failed to upload image');
  }
};
