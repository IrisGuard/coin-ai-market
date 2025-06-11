
import { useState } from 'react';
import { uploadImage } from '@/utils/imageUpload';
import { toast } from 'sonner';

interface ProcessedImageResult {
  originalFile: File;
  processedFile: File;
  processedUrl: string;
  preview: string;
  metadata: {
    originalSize: { width: number; height: number };
    processedSize: { width: number; height: number };
    hasWhiteBackground: boolean;
    isCircleCropped: boolean;
  };
}

export const useEnhancedImageProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const processImage = async (file: File): Promise<ProcessedImageResult> => {
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      console.log('🎨 Starting image processing:', file.name);
      
      // Step 1: Load image
      const img = await loadImageFromFile(file);
      setProcessingProgress(25);

      // Step 2: Add white background and make square
      const processedCanvas = await addWhiteBackgroundAndMakeSquare(img);
      setProcessingProgress(50);

      // Step 3: Apply circle crop
      const circleCanvas = await applyCircleCrop(processedCanvas);
      setProcessingProgress(75);

      // Step 4: Convert to file and upload
      const processedFile = await canvasToFile(circleCanvas, file.name);
      const processedUrl = await uploadImage(processedFile, 'dealer-uploads');
      setProcessingProgress(100);

      console.log('✅ Image processing completed');

      return {
        originalFile: file,
        processedFile,
        processedUrl,
        preview: URL.createObjectURL(processedFile),
        metadata: {
          originalSize: { width: img.naturalWidth, height: img.naturalHeight },
          processedSize: { width: circleCanvas.width, height: circleCanvas.height },
          hasWhiteBackground: true,
          isCircleCropped: true,
        }
      };
    } catch (error) {
      console.error('❌ Image processing failed:', error);
      toast.error('Image processing failed. Please try again.');
      throw error;
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const processBatchImages = async (files: File[]): Promise<ProcessedImageResult[]> => {
    const results: ProcessedImageResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await processImage(files[i]);
        results.push(result);
        toast.success(`Image ${i + 1}/${files.length} processed successfully`);
      } catch (error) {
        console.error(`Failed to process image ${i + 1}:`, error);
        toast.error(`Failed to process image ${i + 1}`);
      }
    }

    return results;
  };

  return {
    processImage,
    processBatchImages,
    isProcessing,
    processingProgress
  };
};

// Helper functions
const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

const addWhiteBackgroundAndMakeSquare = async (img: HTMLImageElement): Promise<HTMLCanvasElement> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get canvas context');

  // Determine square size (use the larger dimension)
  const size = Math.max(img.naturalWidth, img.naturalHeight);
  canvas.width = size;
  canvas.height = size;

  // Fill with white background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  // Center the image
  const x = (size - img.naturalWidth) / 2;
  const y = (size - img.naturalHeight) / 2;
  
  ctx.drawImage(img, x, y);

  return canvas;
};

const applyCircleCrop = async (canvas: HTMLCanvasElement): Promise<HTMLCanvasElement> => {
  const circleCanvas = document.createElement('canvas');
  const ctx = circleCanvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get canvas context');

  const size = Math.min(canvas.width, canvas.height);
  circleCanvas.width = size;
  circleCanvas.height = size;

  // Create circular clipping path
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.clip();

  // Draw the image within the circle
  ctx.drawImage(canvas, 0, 0, size, size);

  return circleCanvas;
};

const canvasToFile = (canvas: HTMLCanvasElement, originalName: string): Promise<File> => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const fileName = `processed_${originalName.split('.')[0]}.png`;
        const file = new File([blob], fileName, { type: 'image/png' });
        resolve(file);
      }
    }, 'image/png');
  });
};
