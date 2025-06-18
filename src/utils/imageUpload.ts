
import { supabase } from '@/integrations/supabase/client';

export const uploadImage = async (file: File, bucket: string = 'coin-images'): Promise<string> => {
  try {
    // Generate unique filename with dealer prefix
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const fileName = `${timestamp}-${random}.${fileExt}`;
    
    // Create dealer-specific path
    const { data: { user } } = await supabase.auth.getUser();
    const filePath = bucket === 'dealer-uploads' 
      ? `${user?.id}/${fileName}` 
      : fileName;

    console.log(`📁 Uploading to ${bucket}/${filePath}`);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log(`✅ Image uploaded successfully: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw new Error('Failed to upload image');
  }
};

export const deleteImage = async (url: string, bucket: string = 'coin-images'): Promise<void> => {
  try {
    const fileName = url.split('/').pop();
    if (!fileName) return;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) throw error;
  } catch (error) {
    console.error('Image deletion failed:', error);
  }
};

export const compressImage = async (file: File, quality: number = 0.8): Promise<File> => {
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
};
