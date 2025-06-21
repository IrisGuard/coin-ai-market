import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
  images: string[];
  coinName: string;
  className?: string;
}

const ImageGallery = ({ images, coinName, className = '' }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Memoize valid images to prevent unnecessary recalculation
  const validImages = useMemo(() => {
    return images.filter(img => img && img.length > 0 && !img.startsWith('blob:'));
  }, [images]);
  
  // Reset current index if it's out of bounds
  useEffect(() => {
    if (currentIndex >= validImages.length && validImages.length > 0) {
      setCurrentIndex(0);
    }
  }, [validImages.length, currentIndex]);

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };

  if (validImages.length === 0) {
    return (
      <div className={`aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-50">🪙</div>
          <span className="text-gray-500 text-sm font-medium">No images available</span>
        </div>
      </div>
    );
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const currentImageUrl = validImages[currentIndex];

  return (
    <div className={`relative ${className}`}>
      {/* Main Image Display - COMPLETELY CLEAN, NO OVERLAYS */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner">
        <img
          src={currentImageUrl}
          alt={`${coinName} - Image ${currentIndex + 1}`}
          className={`w-full h-full object-contain transition-all duration-500 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
          }`}
          style={{ 
            display: 'block', 
            minHeight: '100%',
            opacity: loadedImages.has(currentIndex) ? 1 : 0.8
          }}
          onLoad={() => handleImageLoad(currentIndex)}
          onClick={() => setIsZoomed(!isZoomed)}
          loading="eager"
        />
        
        {/* Loading indicator only - No other overlays */}
        {!loadedImages.has(currentIndex) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-200 border-t-blue-600"></div>
              <span className="text-sm text-gray-600 font-medium">Loading...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Thumbnail Navigation - Only show when there are multiple images */}
      {validImages.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex 
                  ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-102'
              }`}
            >
              <img
                src={image}
                alt={`${coinName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover transition-opacity duration-200"
                loading="lazy"
              />
              
              {/* Thumbnail loading indicator */}
              {!loadedImages.has(index) && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {/* Active indicator */}
              {index === currentIndex && (
                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
