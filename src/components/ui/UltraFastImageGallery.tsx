
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UltraFastImageGalleryProps {
  images: string[];
  coinName: string;
  className?: string;
}

const UltraFastImageGallery = ({ images, coinName, className = '' }: UltraFastImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  
  // Ultra-fast image validation and filtering
  const validImages = useMemo(() => {
    return images.filter(img => 
      img && 
      typeof img === 'string' && 
      img.length > 10 && 
      !img.startsWith('blob:') &&
      (img.startsWith('http') || img.startsWith('/'))
    );
  }, [images]);

  // Ultra-fast preloading system
  const preloadImages = useCallback(async () => {
    if (validImages.length === 0) {
      setIsLoading(false);
      return;
    }

    const loadPromises = validImages.map((src, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          setPreloadedImages(prev => new Set([...prev, src]));
          resolve();
        };
        img.onerror = () => resolve(); // Don't block on errors
        img.src = src;
        
        // Priority loading for first image
        if (index === 0) {
          img.loading = 'eager';
        }
      });
    });

    // Load first image immediately, others in background
    if (loadPromises[0]) {
      await loadPromises[0];
      setIsLoading(false);
    }

    // Load remaining images in parallel
    Promise.all(loadPromises.slice(1));
  }, [validImages]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  // Reset current index if out of bounds
  useEffect(() => {
    if (currentIndex >= validImages.length && validImages.length > 0) {
      setCurrentIndex(0);
    }
  }, [validImages.length, currentIndex]);

  if (validImages.length === 0) {
    return (
      <div className={`aspect-square bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200 ${className}`}>
        <div className="text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <span className="text-gray-500 text-sm">No images available</span>
        </div>
      </div>
    );
  }

  const currentImageUrl = validImages[currentIndex];
  const isCurrentImageLoaded = preloadedImages.has(currentImageUrl);

  return (
    <div className={className}>
      {/* Main Image Display - Ultra Fast */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-white border mb-4">
        {/* Main image with instant display */}
        <img
          src={currentImageUrl}
          alt={`${coinName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-150"
          style={{ 
            opacity: isCurrentImageLoaded ? 1 : 0.7,
            imageRendering: 'crisp-edges'
          }}
          loading="eager"
          fetchPriority="high"
        />
        
        {/* Ultra-fast loading state */}
        {isLoading && !isCurrentImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-blue-200 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Ultra-fast thumbnail navigation */}
      {validImages.length > 1 && (
        <div className="flex gap-2 justify-center overflow-x-auto pb-2">
          {validImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-150 ${
                index === currentIndex 
                  ? 'border-blue-500 ring-2 ring-blue-200 scale-105' 
                  : 'border-gray-200 hover:border-gray-300 hover:scale-102'
              }`}
            >
              <img
                src={image}
                alt={`${coinName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover bg-white"
                loading="lazy"
                style={{ imageRendering: 'crisp-edges' }}
              />
              
              {/* Ultra-fast counter badge */}
              <Badge className="absolute top-0.5 right-0.5 bg-white/95 text-gray-800 border-0 px-1 py-0 text-xs min-w-0 h-4 leading-none">
                {index + 1}
              </Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UltraFastImageGallery;
