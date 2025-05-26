
import { useState, ChangeEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { uploadCoinImage } from '@/integrations/supabase/client';

export const useCoinImages = (maxImages: number = 5) => {
  const { toast } = useToast();
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    
    if (images.length + newFiles.length > maxImages) {
      toast({
        title: "Error",
        description: `You can upload a maximum of ${maxImages} images.`,
        variant: "destructive",
      });
      return;
    }
    
    const newImages = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setImages([...images, ...newImages]);
  };

  const handleMobileImagesSelected = (newImages: { file: File; preview: string }[]) => {
    if (images.length + newImages.length > maxImages) {
      toast({
        title: "Error",
        description: `You can upload a maximum of ${maxImages} images. Only adding the first ${maxImages - images.length}.`,
        variant: "destructive",
      });
      
      const allowedImages = newImages.slice(0, maxImages - images.length);
      setImages([...images, ...allowedImages]);
      return;
    }
    
    setImages([...images, ...newImages]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const uploadImagesToStorage = async () => {
    if (images.length === 0) return [];
    
    const uploadPromises = images.map(img => uploadCoinImage(img.file));
    const results = await Promise.all(uploadPromises);
    
    const validUrls = results.filter((url): url is string => url !== null);
    
    if (validUrls.length !== images.length) {
      toast({
        title: "Upload Warning",
        description: "Some images failed to upload.",
        variant: "destructive",
      });
    }
    
    setUploadedImageUrls(validUrls);
    return validUrls;
  };

  const resetImages = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
    setUploadedImageUrls([]);
  };

  return {
    images,
    uploadedImageUrls,
    handleImageUpload,
    handleMobileImagesSelected,
    removeImage,
    uploadImagesToStorage,
    resetImages
  };
};
