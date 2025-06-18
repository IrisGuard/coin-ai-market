
import { useState, useCallback } from 'react';
import { useCoinImageManagement } from './useCoinImageManagement';
import { toast } from 'sonner';

interface UseImageEditorProps {
  coinId: string;
  coinName: string;
  currentImages: string[];
  onImagesUpdated?: (newImages: string[]) => void;
}

export const useImageEditor = ({ coinId, coinName, currentImages, onImagesUpdated }: UseImageEditorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    deleteImageFromCoin, 
    replaceImageInCoin, 
    addNewImageToCoin 
  } = useCoinImageManagement({ coinId, currentImages });

  const handleDeleteImage = useCallback(async (imageUrl: string, index: number) => {
    try {
      setIsLoading(true);
      const updatedImages = await deleteImageFromCoin(imageUrl, index);
      if (onImagesUpdated) {
        onImagesUpdated(updatedImages);
      }
      toast.success('Image deleted successfully');
    } catch (error) {
      toast.error('Failed to delete image');
    } finally {
      setIsLoading(false);
    }
  }, [deleteImageFromCoin, onImagesUpdated]);

  const handleReplaceImage = useCallback(async (file: File, index: number) => {
    try {
      setIsLoading(true);
      const updatedImages = await replaceImageInCoin(file, index);
      if (onImagesUpdated) {
        onImagesUpdated(updatedImages);
      }
      toast.success('Image replaced successfully');
    } catch (error) {
      toast.error('Failed to replace image');
    } finally {
      setIsLoading(false);
    }
  }, [replaceImageInCoin, onImagesUpdated]);

  const handleAddImage = useCallback(async (file: File) => {
    try {
      setIsLoading(true);
      const updatedImages = await addNewImageToCoin(file);
      if (onImagesUpdated) {
        onImagesUpdated(updatedImages);
      }
      toast.success('Image added successfully');
    } catch (error) {
      toast.error('Failed to add image');
    } finally {
      setIsLoading(false);
    }
  }, [addNewImageToCoin, onImagesUpdated]);

  return {
    isLoading,
    handleDeleteImage,
    handleReplaceImage,
    handleAddImage
  };
};
