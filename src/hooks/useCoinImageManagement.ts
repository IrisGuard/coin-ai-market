
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseCoinImageManagementProps {
  coinId: string;
  currentImages: string[];
}

export const useCoinImageManagement = ({ coinId, currentImages }: UseCoinImageManagementProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const uploadImageToStorage = useCallback(async (file: File): Promise<string> => {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }
      
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Image must be smaller than 10MB');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${coinId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      
      console.log('📁 Uploading to storage:', fileName);
      
      const { data, error } = await supabase.storage
        .from('coin-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('coin-images')
        .getPublicUrl(data.path);

      console.log('✅ Image uploaded successfully:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }, [coinId]);

  const updateCoinImages = useCallback(async (newImages: string[]) => {
    try {
      console.log('🔄 Updating coin images in database:', { coinId, newImages });
      
      const { error } = await supabase
        .from('coins')
        .update({ 
          images: newImages,
          image: newImages[0] || null // Update primary image
        })
        .eq('id', coinId);

      if (error) {
        console.error('Database update error:', error);
        throw new Error(`Database update failed: ${error.message}`);
      }

      console.log('✅ Coin images updated in database');
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }, [coinId]);

  const deleteImageFromStorage = useCallback(async (imageUrl: string) => {
    try {
      if (imageUrl.includes('supabase.co/storage/v1/object/public/coin-images/')) {
        const urlParts = imageUrl.split('/coin-images/');
        if (urlParts[1]) {
          const { error } = await supabase.storage
            .from('coin-images')
            .remove([urlParts[1]]);
          
          if (error) {
            console.warn('Storage deletion warning:', error);
          } else {
            console.log('✅ Image deleted from storage');
          }
        }
      }
    } catch (error) {
      console.warn('Storage deletion failed (non-critical):', error);
    }
  }, []);

  const deleteImageFromCoin = useCallback(async (imageUrl: string, index: number): Promise<string[]> => {
    try {
      setIsLoading(true);
      setIsUpdating(true);
      
      console.log('🗑️ Deleting image:', { imageUrl, index });
      
      // Remove image from array
      const newImages = currentImages.filter((_, i) => i !== index);
      
      // Update database first
      await updateCoinImages(newImages);
      
      // Try to delete from storage (non-critical)
      await deleteImageFromStorage(imageUrl);
      
      console.log('✅ Image deleted successfully');
      return newImages;
    } catch (error) {
      console.error('Delete image error:', error);
      toast.error('Failed to delete image');
      throw error;
    } finally {
      setIsLoading(false);
      setIsUpdating(false);
    }
  }, [currentImages, updateCoinImages, deleteImageFromStorage]);

  const replaceImageInCoin = useCallback(async (file: File, index: number): Promise<string[]> => {
    try {
      setIsLoading(true);
      setIsUpdating(true);
      
      console.log('🔄 Replacing image at index:', index);
      
      // Upload new image
      const newImageUrl = await uploadImageToStorage(file);
      
      // Replace image in array
      const newImages = [...currentImages];
      const oldImageUrl = newImages[index];
      newImages[index] = newImageUrl;
      
      // Update database
      await updateCoinImages(newImages);
      
      // Try to delete old image from storage (non-critical)
      await deleteImageFromStorage(oldImageUrl);
      
      console.log('✅ Image replaced successfully');
      return newImages;
    } catch (error) {
      console.error('Replace image error:', error);
      toast.error('Failed to replace image');
      throw error;
    } finally {
      setIsLoading(false);
      setIsUpdating(false);
    }
  }, [currentImages, uploadImageToStorage, updateCoinImages, deleteImageFromStorage]);

  const addNewImageToCoin = useCallback(async (file: File): Promise<string[]> => {
    try {
      setIsLoading(true);
      setIsUpdating(true);
      
      console.log('➕ Adding new image');
      
      // Upload new image
      const newImageUrl = await uploadImageToStorage(file);
      
      // Add image to array
      const newImages = [...currentImages, newImageUrl];
      
      // Update database
      await updateCoinImages(newImages);
      
      console.log('✅ Image added successfully');
      return newImages;
    } catch (error) {
      console.error('Add image error:', error);
      toast.error('Failed to add image');
      throw error;
    } finally {
      setIsLoading(false);
      setIsUpdating(false);
    }
  }, [currentImages, uploadImageToStorage, updateCoinImages]);

  return {
    isLoading,
    isUpdating,
    deleteImageFromCoin,
    replaceImageInCoin,
    addNewImageToCoin
  };
};
