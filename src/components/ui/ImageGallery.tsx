
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  coinName: string;
  className?: string;
}

const ImageGallery = ({ images, coinName, className = '' }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isZoomed, setIsZoomed] = useState(false);
  
  // FIXED: Filter out empty, null, undefined, blob URLs and invalid images
  const validImages = useMemo(() => {
    console.log('Raw images array:', images);
    const filtered = images
      .filter(img => 
        img && 
        typeof img === 'string' && 
        img.trim() !== '' && 
        img !== 'null' && 
        img !== 'undefined' &&
        !img.startsWith('blob:') &&
        (img.startsWith('http') || img.startsWith('/'))
      )
      .slice(0, 10); // Limit to 10 images
    console.log('Valid images after comprehensive filtering:', filtered);
    return filtered;
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

  // Preload all images
  useEffect(() => {
    validImages.forEach((src, index) => {
      const img = new Image();
      img.onload = () => handleImageLoad(index);
      img.onerror = () => console.error(`Failed to load image ${index}:`, src);
      img.src = src;
    });
  }, [validImages]);

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
    if (index >= 0 && index < validImages.length) {
      setCurrentIndex(index);
      setIsZoomed(false);
    }
  };

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : validImages.length - 1;
    goToImage(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex < validImages.length - 1 ? currentIndex + 1 : 0;
    goToImage(newIndex);
  };

  const currentImageUrl = validImages[currentIndex];

  return (
    <div className={`relative group ${className}`}>
      {/* Main Image Display - COMPLETELY CLEAN */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
        <img
          src={currentImageUrl}
          alt={`${coinName} - Image ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-all duration-300 ${
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
        
        {/* Loading indicator only when image is not loaded */}
        {!loadedImages.has(currentIndex) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-200 border-t-blue-600"></div>
              <span className="text-sm text-gray-600 font-medium">Loading...</span>
            </div>
          </div>
        )}

        {/* Navigation Arrows - Only show on hover and if multiple images */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      
      {/* Thumbnail Navigation - Show ALWAYS when there are multiple images */}
      {validImages.length > 1 && (
        <div className="mt-6">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {validImages.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 shadow-md ${
                  index === currentIndex 
                    ? 'border-blue-500 ring-2 ring-blue-200 shadow-blue-200 scale-105' 
                    : 'border-gray-300 hover:border-blue-300 hover:shadow-lg hover:scale-102'
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
                    <div className="w-4 h-4 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Active indicator overlay */}
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-blue-500/15 border border-blue-500/30 rounded-lg"></div>
                )}

                {/* Thumbnail number badge */}
                <div className="absolute top-1 left-1 bg-black/70 text-white text-xs rounded px-1.5 py-0.5 leading-none font-medium">
                  {index + 1}
                </div>
              </button>
            ))}
          </div>
          
          {/* Image counter below thumbnails */}
          <div className="mt-3 text-center">
            <span className="text-sm text-gray-500 font-medium">
              {currentIndex + 1} of {validImages.length} images
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
