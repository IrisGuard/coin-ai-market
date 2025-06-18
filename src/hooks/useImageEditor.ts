
import { useState, useCallback } from 'react';
import { useCoinImageManagement } from '@/hooks/useCoinImageManagement';

interface UseImageEditorProps {
  coinId: string;
  coinName: string;
  currentImages: string[];
  onImagesUpdated?: (newImages: string[]) => void;
}

export const useImageEditor = ({ coinId, coinName, currentImages, onImagesUpdated }: UseImageEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  const { 
    isLoading, 
    deleteImageFromCoin, 
    replaceImageInCoin, 
    addNewImageToCoin 
  } = useCoinImageManagement({ coinId, currentImages });

  const handleDeleteImage = useCallback(async (imageUrl: string, index: number) => {
    try {
      const updatedImages = await deleteImageFromCoin(imageUrl, index);
      onImagesUpdated?.(updatedImages);
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  }, [deleteImageFromCoin, onImagesUpdated]);

  const handleReplaceImage = useCallback(async (file: File, index: number) => {
    try {
      const updatedImages = await replaceImageInCoin(file, index);
      onImagesUpdated?.(updatedImages);
      setSelectedImageIndex(null);
    } catch (error) {
      console.error('Failed to replace image:', error);
    }
  }, [replaceImageInCoin, onImagesUpdated]);

  const handleAddImage = useCallback(async (file: File) => {
    try {
      const updatedImages = await addNewImageToCoin(file);
      onImagesUpdated?.(updatedImages);
    } catch (error) {
      console.error('Failed to add image:', error);
    }
  }, [addNewImageToCoin, onImagesUpdated]);

  const openEditor = useCallback(() => {
    setIsEditing(true);
  }, []);

  const closeEditor = useCallback(() => {
    setIsEditing(false);
    setSelectedImageIndex(null);
  }, []);

  return {
    isEditing,
    isLoading,
    selectedImageIndex,
    setSelectedImageIndex,
    handleDeleteImage,
    handleReplaceImage,
    handleAddImage,
    openEditor,
    closeEditor
  };
};
