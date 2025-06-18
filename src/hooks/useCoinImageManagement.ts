
import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { uploadImage, deleteImage } from '@/utils/imageUpload';
import { toast } from 'sonner';

interface CoinImageManagementProps {
  coinId: string;
  currentImages: string[];
}

export const useCoinImageManagement = ({ coinId, currentImages }: CoinImageManagementProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const updateCoinImages = useMutation({
    mutationFn: async (newImages: string[]) => {
      const { data, error } = await supabase
        .from('coins')
        .update({ 
          images: newImages,
          image: newImages[0] || null,
          obverse_image: newImages[1] || null,
          reverse_image: newImages[2] || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', coinId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coins'] });
      queryClient.invalidateQueries({ queryKey: ['dealer-coins'] });
      queryClient.invalidateQueries({ queryKey: ['store-filtered-coins'] });
      toast.success('Images updated successfully!');
    },
    onError: (error) => {
      console.error('❌ Failed to update coin images:', error);
      toast.error('Failed to update images. Please try again.');
    }
  });

  const deleteImageFromCoin = useCallback(async (imageUrl: string, imageIndex: number) => {
    setIsLoading(true);
    try {
      console.log(`🗑️ Deleting image ${imageIndex + 1} for coin ${coinId}`);
      
      // Delete from Supabase Storage
      await deleteImage(imageUrl, 'coin-images');
      
      // Update images array
      const updatedImages = currentImages.filter((_, index) => index !== imageIndex);
      
      // Update database
      await updateCoinImages.mutateAsync(updatedImages);
      
      console.log('✅ Image deleted successfully');
      
      return updatedImages;
    } catch (error) {
      console.error('❌ Delete image failed:', error);
      toast.error('Failed to delete image. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [coinId, currentImages, updateCoinImages]);

  const replaceImageInCoin = useCallback(async (file: File, imageIndex: number) => {
    setIsLoading(true);
    try {
      console.log(`🔄 Replacing image ${imageIndex + 1} for coin ${coinId}`);
      
      // Delete old image from storage first
      if (currentImages[imageIndex]) {
        await deleteImage(currentImages[imageIndex], 'coin-images');
      }
      
      // Upload new image
      const newImageUrl = await uploadImage(file, 'coin-images');
      
      if (newImageUrl.startsWith('blob:')) {
        throw new Error('Upload failed: temporary URL returned');
      }
      
      // Update images array
      const updatedImages = [...currentImages];
      updatedImages[imageIndex] = newImageUrl;
      
      // Update database
      await updateCoinImages.mutateAsync(updatedImages);
      
      console.log('✅ Image replaced successfully');
      
      return updatedImages;
    } catch (error) {
      console.error('❌ Replace image failed:', error);
      toast.error('Failed to replace image. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [coinId, currentImages, updateCoinImages]);

  const addNewImageToCoin = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      console.log(`➕ Adding new image to coin ${coinId}`);
      
      // Upload new image
      const newImageUrl = await uploadImage(file, 'coin-images');
      
      if (newImageUrl.startsWith('blob:')) {
        throw new Error('Upload failed: temporary URL returned');
      }
      
      // Add to images array
      const updatedImages = [...currentImages, newImageUrl];
      
      // Update database
      await updateCoinImages.mutateAsync(updatedImages);
      
      console.log('✅ Image added successfully');
      
      return updatedImages;
    } catch (error) {
      console.error('❌ Add image failed:', error);
      toast.error('Failed to add image. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [coinId, currentImages, updateCoinImages]);

  return {
    isLoading,
    deleteImageFromCoin,
    replaceImageInCoin,
    addNewImageToCoin,
    isUpdating: updateCoinImages.isPending
  };
};
