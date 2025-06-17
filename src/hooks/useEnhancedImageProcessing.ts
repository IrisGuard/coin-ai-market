
import { useState } from 'react';
import type { ItemType } from '@/types/upload';

export const useEnhancedImageProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);

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

  return {
    processImageWithItemType,
    isProcessing
  };
};
