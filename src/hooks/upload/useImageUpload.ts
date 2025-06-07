
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { uploadImage } from '@/utils/imageUpload';
import type { UploadedImage } from '@/types/upload';

export const useImageUpload = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback((files: File[]) => {
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploaded: false,
      uploading: false
    }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeImage = useCallback((index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      if (newImages[index]?.preview) {
        URL.revokeObjectURL(newImages[index].preview);
      }
      newImages.splice(index, 1);
      return newImages;
    });
  }, []);

  const uploadImages = useCallback(async () => {
    if (images.length === 0) {
      toast.error('Please select at least one image');
      return [];
    }

    const uploadedImages = [];
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (!image.uploaded) {
        setUploadProgress((i / images.length) * 100);
        
        const url = await uploadImage(image.file, 'coin-images');
        
        setImages(prev => prev.map((img, idx) => 
          idx === i ? { ...img, uploaded: true, url } : img
        ));
        
        uploadedImages.push(url);
      }
    }
    
    setUploadProgress(100);
    return uploadedImages;
  }, [images]);

  const resetImages = useCallback(() => {
    setImages([]);
    setUploadProgress(0);
  }, []);

  return {
    images,
    uploadProgress,
    dragActive,
    handleFiles,
    handleDrag,
    handleDrop,
    removeImage,
    uploadImages,
    resetImages,
    setImages
  };
};
