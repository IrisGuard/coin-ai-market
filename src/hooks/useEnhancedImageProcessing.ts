
import { useState } from 'react';
import type { ItemType } from '@/types/upload';

interface ProcessedImageData {
  original: string;
  processed: string;
  filename: string;
}

export const useEnhancedImageProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState<ProcessedImageData[]>([]);

  // Helper function to convert File to data URL
  const convertFileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Helper function to convert Blob to data URL
  const convertBlobToDataURL = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const processImageWithItemType = async (file: File, itemType: ItemType): Promise<Blob> => {
    setIsProcessing(true);
    
    try {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          // Set canvas size based on item type
          if (itemType === 'coin') {
            canvas.width = 400;
            canvas.height = 400;
          } else {
            canvas.width = 600;
            canvas.height = 300;
          }
          
          // Fill with neutral background
          if (ctx) {
            ctx.fillStyle = '#F5F5F5';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Calculate aspect ratio and draw image
            const aspectRatio = img.width / img.height;
            let drawWidth, drawHeight, x, y;
            
            if (itemType === 'coin') {
              // For coins, fit in circle
              const size = Math.min(canvas.width, canvas.height) * 0.9;
              drawWidth = drawHeight = size;
              x = (canvas.width - size) / 2;
              y = (canvas.height - size) / 2;
            } else {
              // For banknotes, maintain aspect ratio
              if (aspectRatio > canvas.width / canvas.height) {
                drawWidth = canvas.width * 0.9;
                drawHeight = drawWidth / aspectRatio;
              } else {
                drawHeight = canvas.height * 0.9;
                drawWidth = drawHeight * aspectRatio;
              }
              x = (canvas.width - drawWidth) / 2;
              y = (canvas.height - drawHeight) / 2;
            }
            
            ctx.drawImage(img, x, y, drawWidth, drawHeight);
          }
          
          canvas.toBlob((blob) => {
            resolve(blob || file);
          }, 'image/jpeg', 0.9);
        };
        
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      console.error('Image processing failed:', error);
      return file;
    } finally {
      setIsProcessing(false);
    }
  };

  const processMultipleImages = async (files: File[], itemType: ItemType) => {
    setIsProcessing(true);
    const newProcessedImages: ProcessedImageData[] = [];

    try {
      console.log('🔧 DEBUG useEnhancedImageProcessing - Starting processMultipleImages:', files.length);
      
      for (const file of files) {
        console.log('🔧 DEBUG Processing file:', file.name);
        
        // Convert original file to data URL (instead of blob URL)
        const originalDataURL = await convertFileToDataURL(file);
        console.log('🔧 DEBUG Original data URL generated:', originalDataURL.substring(0, 50) + '...');
        
        // Process the image
        const processedBlob = await processImageWithItemType(file, itemType);
        console.log('🔧 DEBUG Processed blob created:', processedBlob.type, processedBlob.size);
        
        // Convert processed blob to data URL (instead of blob URL)
        const processedDataURL = await convertBlobToDataURL(processedBlob);
        console.log('🔧 DEBUG Processed data URL generated:', processedDataURL.substring(0, 50) + '...');

        newProcessedImages.push({
          original: originalDataURL,
          processed: processedDataURL,
          filename: file.name
        });
      }

      console.log('🔧 DEBUG Setting processed images:', newProcessedImages.length);
      setProcessedImages(prev => [...prev, ...newProcessedImages]);
    } catch (error) {
      console.error('🚨 Multiple image processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processImageWithItemType,
    processMultipleImages,
    processedImages,
    setProcessedImages,
    isProcessing
  };
};
