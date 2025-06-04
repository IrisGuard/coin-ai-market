
import { useState, ChangeEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockApi } from '@/lib/mockApi';

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
    
    try {
      // Mock image upload - in production this would upload to real storage
      const uploadPromises = images.map(async (img) => {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Return mock URL
        return `https://mock-storage.com/images/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      });
      
      const urls = await Promise.all(uploadPromises);
      setUploadedImageUrls(urls);
      return urls;
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Some images failed to upload.",
        variant: "destructive",
      });
      return [];
    }
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
