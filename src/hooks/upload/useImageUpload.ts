
import { useState, useCallback } from 'react';
import type { UploadedImage } from '@/types/upload';

export const useImageUpload = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback((files: File[]) => {
    const newImages: UploadedImage[] = files.map(file => {
      const preview = URL.createObjectURL(file);
      return {
        file,
        url: preview, // Use preview URL as the initial url
        preview: preview,
        uploaded: false,
        uploading: false
      };
    });
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
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  return {
    images,
    dragActive,
    handleFiles,
    handleDrag,
    handleDrop,
    removeImage,
    setImages
  };
};
