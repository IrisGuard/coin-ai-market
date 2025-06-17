
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ItemType, ItemTypeProcessingOptions } from '@/types/upload';

export interface BackgroundProcessingOptions {
  backgroundColor: string;
  removeBackground: boolean;
  enhanceContrast: boolean;
  resizeToStandard: boolean;
}

export const useEnhancedImageProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState<any[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);

  const processImageWithItemType = useCallback(async (
    file: File, 
    itemType: ItemType = 'coin'
  ) => {
    setIsProcessing(true);
    
    try {
      console.log('🎨 Processing image with item type:', { fileName: file.name, itemType });
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Could not get canvas context');
      
      const img = new Image();
      const imageUrl = URL.createObjectURL(file);
      
      return new Promise<Blob>((resolve, reject) => {
        img.onload = () => {
          console.log('📷 Image loaded, processing with type:', itemType);
          
          // Standard background color for all items
          const backgroundColor = '#F5F5F5';
          
          if (itemType === 'coin') {
            // Circular crop for coins
            const size = Math.min(img.width, img.height);
            canvas.width = size;
            canvas.height = size;
            
            // Fill with background color
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, size, size);
            
            // Create circular clip
            ctx.save();
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.clip();
            
            // Center the image
            const offsetX = (img.width - size) / 2;
            const offsetY = (img.height - size) / 2;
            ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);
            ctx.restore();
          } else {
            // Rectangular crop for banknotes
            canvas.width = 800; // Standard width
            canvas.height = 400; // Standard height for banknotes
            
            // Fill with background color
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw banknote maintaining aspect ratio
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            const x = (canvas.width - scaledWidth) / 2;
            const y = (canvas.height - scaledHeight) / 2;
            
            ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
          }
          
          // Enhance contrast
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.2 + 128));     // Red
            data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.2 + 128)); // Green  
            data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.2 + 128)); // Blue
          }
          
          ctx.putImageData(imageData, 0, 0);
          
          canvas.toBlob((blob) => {
            if (blob) {
              console.log('✅ Image processing complete:', { 
                itemType,
                originalSize: file.size, 
                processedSize: blob.size
              });
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
      console.error('❌ Image processing failed:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Legacy method for backward compatibility
  const processImageWithBackground = useCallback(async (
    file: File, 
    options: BackgroundProcessingOptions
  ) => {
    // Default to coin processing for backward compatibility
    return await processImageWithItemType(file, 'coin');
  }, [processImageWithItemType]);

  const processImage = useCallback(async (file: File) => {
    // Default to coin processing
    return await processImageWithItemType(file, 'coin');
  }, [processImageWithItemType]);

  const processBatchImages = useCallback(async (files: File[], itemType: ItemType = 'coin') => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    console.log('🔄 Batch processing starting...', { fileCount: files.length, itemType });
    const processed = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const file = files[i];
        console.log(`📸 Processing ${itemType} ${i + 1}/${files.length}: ${file.name}`);
        
        const processedBlob = await processImageWithItemType(file, itemType);
        const processedUrl = URL.createObjectURL(processedBlob);
        
        processed.push({
          original: URL.createObjectURL(file),
          processedUrl,
          preview: processedUrl,
          filename: file.name,
          originalSize: file.size,
          processedSize: processedBlob.size,
          processed: true,
          itemType
        });
        
        const progress = ((i + 1) / files.length) * 100;
        setProcessingProgress(progress);
        console.log(`📊 Processing progress: ${progress.toFixed(1)}%`);
      } catch (error) {
        console.error('❌ Failed to process', files[i].name, error);
      }
    }
    
    console.log('✅ Batch processing complete:', { processedCount: processed.length });
    setProcessedImages(processed);
    setIsProcessing(false);
    setProcessingProgress(0);
    
    return processed;
  }, [processImageWithItemType]);

  const processMultipleImages = useCallback(async (
    files: File[],
    itemType: ItemType = 'coin'
  ) => {
    console.log('🎯 Multiple images processing...', { fileCount: files.length, itemType });
    const processed = [];
    
    for (const file of files) {
      try {
        const processedBlob = await processImageWithItemType(file, itemType);
        const processedUrl = URL.createObjectURL(processedBlob);
        
        processed.push({
          original: URL.createObjectURL(file),
          processed: processedUrl,
          filename: file.name,
          itemType,
          realProcessing: true
        });
      } catch (error) {
        console.error('❌ Failed to process', file.name, error);
      }
    }
    
    setProcessedImages(processed);
    return processed;
  }, [processImageWithItemType]);

  return {
    isProcessing,
    processedImages,
    processingProgress,
    processImageWithBackground,
    processImageWithItemType,
    processImage,
    processBatchImages,
    processMultipleImages,
    setProcessedImages
  };
};
