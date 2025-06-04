
import { useCallback } from 'react';

export interface ImageQualityResult {
  quality: 'excellent' | 'good' | 'poor';
  blurScore: number;
}

export const useImageQuality = () => {
  const analyzeImageQuality = useCallback(async (imageFile: File): Promise<ImageQualityResult> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Simple blur detection using edge detection
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) {
          resolve({ quality: 'good', blurScore: 0.7 });
          return;
        }
        
        // Calculate variance of pixel intensities (higher = sharper)
        const pixels = imageData.data;
        let sum = 0;
        let sumSquares = 0;
        const sampleSize = Math.min(10000, pixels.length / 4);
        
        for (let i = 0; i < sampleSize * 4; i += 4) {
          const intensity = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
          sum += intensity;
          sumSquares += intensity * intensity;
        }
        
        const mean = sum / sampleSize;
        const variance = (sumSquares / sampleSize) - (mean * mean);
        const blurScore = Math.min(variance / 1000, 1);
        
        let quality: 'excellent' | 'good' | 'poor';
        if (blurScore > 0.8) quality = 'excellent';
        else if (blurScore > 0.5) quality = 'good';
        else quality = 'poor';
        
        resolve({ quality, blurScore });
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  }, []);

  return { analyzeImageQuality };
};
