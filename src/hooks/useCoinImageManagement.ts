
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
    const fileExt = file.name.split('.').pop();
    const fileName = `${coinId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('coin-images')
      .upload(fileName, file);

    if (error) {
      console.error('Storage upload error:', error);
      throw new Error('Failed to upload image to storage');
    }

    const { data: urlData } = supabase.storage
      .from('coin-images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  }, [coinId]);

  const updateCoinImages = useCallback(async (newImages: string[]) => {
    const { error } = await supabase
      .from('coins')
      .update({ 
        images: newImages,
        image: newImages[0] || null // Update primary image
      })
      .eq('id', coinId);

    if (error) {
      console.error('Database update error:', error);
      throw new Error('Failed to update coin images in database');
    }
  }, [coinId]);

  const deleteImageFromCoin = useCallback(async (imageUrl: string, index: number): Promise<string[]> => {
    try {
      setIsLoading(true);
      setIsUpdating(true);
      
      // Remove image from array
      const newImages = currentImages.filter((_, i) => i !== index);
      
      // Update database
      await updateCoinImages(newImages);
      
      // Try to delete from storage if it's a Supabase URL
      if (imageUrl.includes('supabase.co/storage/v1/object/public/coin-images/')) {
        const urlParts = imageUrl.split('/coin-images/');
        if (urlParts[1]) {
          await supabase.storage
            .from('coin-images')
            .remove([urlParts[1]]);
        }
      }
      
      return newImages;
    } catch (error) {
      console.error('Delete image error:', error);
      throw error;
    } finally {
      setIsLoading(false);
      setIsUpdating(false);
    }
  }, [currentImages, updateCoinImages]);

  const replaceImageInCoin = useCallback(async (file: File, index: number): Promise<string[]> => {
    try {
      setIsLoading(true);
      setIsUpdating(true);
      
      // Upload new image
      const newImageUrl = await uploadImageToStorage(file);
      
      // Replace image in array
      const newImages = [...currentImages];
      const oldImageUrl = newImages[index];
      newImages[index] = newImageUrl;
      
      // Update database
      await updateCoinImages(newImages);
      
      // Try to delete old image from storage if it's a Supabase URL
      if (oldImageUrl && oldImageUrl.includes('supabase.co/storage/v1/object/public/coin-images/')) {
        const urlParts = oldImageUrl.split('/coin-images/');
        if (urlParts[1]) {
          await supabase.storage
            .from('coin-images')
            .remove([urlParts[1]]);
        }
      }
      
      return newImages;
    } catch (error) {
      console.error('Replace image error:', error);
      throw error;
    } finally {
      setIsLoading(false);
      setIsUpdating(false);
    }
  }, [currentImages, uploadImageToStorage, updateCoinImages]);

  const addNewImageToCoin = useCallback(async (file: File): Promise<string[]> => {
    try {
      setIsLoading(true);
      setIsUpdating(true);
      
      // Upload new image
      const newImageUrl = await uploadImageToStorage(file);
      
      // Add image to array
      const newImages = [...currentImages, newImageUrl];
      
      // Update database
      await updateCoinImages(newImages);
      
      return newImages;
    } catch (error) {
      console.error('Add image error:', error);
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
