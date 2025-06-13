
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BackgroundProcessingOptions {
  backgroundColor: string;
  removeBackground: boolean;
  enhanceContrast: boolean;
  resizeToStandard: boolean;
}

export const useEnhancedImageProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState<any[]>([]);

  const processImageWithBackground = useCallback(async (
    file: File, 
    options: BackgroundProcessingOptions
  ) => {
    setIsProcessing(true);
    
    try {
      // Create canvas for image processing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Could not get canvas context');
      
      // Load image
      const img = new Image();
      const imageUrl = URL.createObjectURL(file);
      
      return new Promise<Blob>((resolve, reject) => {
        img.onload = () => {
          // Set canvas size
          canvas.width = options.resizeToStandard ? 800 : img.width;
          canvas.height = options.resizeToStandard ? 600 : img.height;
          
          // Apply background color
          ctx.fillStyle = options.backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Enhance contrast if requested
          if (options.enhanceContrast) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            for (let i = 0; i < data.length; i += 4) {
              // Increase contrast
              data[i] = Math.min(255, data[i] * 1.2);     // Red
              data[i + 1] = Math.min(255, data[i + 1] * 1.2); // Green  
              data[i + 2] = Math.min(255, data[i + 2] * 1.2); // Blue
            }
            
            ctx.putImageData(imageData, 0, 0);
          }
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to process image'));
            }
          }, 'image/jpeg', 0.95);
          
          URL.revokeObjectURL(imageUrl);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageUrl;
      });
    } catch (error) {
      console.error('Image processing failed:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const processMultipleImages = useCallback(async (
    files: File[],
    options: BackgroundProcessingOptions
  ) => {
    const processed = [];
    
    for (const file of files) {
      try {
        const processedBlob = await processImageWithBackground(file, options);
        const processedUrl = URL.createObjectURL(processedBlob);
        
        processed.push({
          original: URL.createObjectURL(file),
          processed: processedUrl,
          filename: file.name,
          options
        });
      } catch (error) {
        console.error('Failed to process', file.name, error);
      }
    }
    
    setProcessedImages(processed);
    return processed;
  }, [processImageWithBackground]);

  return {
    isProcessing,
    processedImages,
    processImageWithBackground,
    processMultipleImages,
    setProcessedImages
  };
};
