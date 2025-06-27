import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  coinName: string;
  className?: string;
}

const ImageGallery = ({ images = [], coinName = 'Coin', className = '' }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<number>>(new Set());
  const [isZoomed, setIsZoomed] = useState(false);
  
  // 🛡️ DEFENSIVE: Ensure we have valid props
  const safeImages = Array.isArray(images) ? images : [];
  const safeCoinName = coinName && typeof coinName === 'string' ? coinName : 'Coin';
  
  // 🔍 DEBUG: Log images being processed
  console.log('🖼️ ImageGallery received images:', safeImages);
  
  // Memoize valid images with better validation
  const validImages = useMemo(() => {
    try {
      const filtered = safeImages.filter(img => {
        if (!img || typeof img !== 'string' || img.trim() === '') return false;
        if (img.startsWith('blob:')) return false;
        if (img === '/placeholder-coin.svg') return true; // Always allow placeholder
        return img.startsWith('http') || img.startsWith('/') || img.startsWith('data:');
      });
      
      console.log('✅ Valid images after filtering:', filtered);
      
      // If no valid images, add placeholder
      if (filtered.length === 0) {
        console.log('⚠️ No valid images, adding placeholder');
        filtered.push('/placeholder-coin.svg');
      }
      
      return filtered;
    } catch (error) {
      console.error('💥 Error filtering images:', error);
      return ['/placeholder-coin.svg'];
    }
  }, [safeImages]);
  
  // Reset states when images change
  useEffect(() => {
    try {
      setCurrentIndex(0);
      setLoadedImages(new Set());
      setErrorImages(new Set());
      setIsZoomed(false);
    } catch (error) {
      console.error('Error resetting states:', error);
    }
  }, [validImages]);

  // ⚡ IMPROVED: Better image preloading and load detection
  useEffect(() => {
    try {
      const preloadImage = (src: string, index: number) => {
        if (!src || typeof src !== 'string') return;
        
        const img = new Image();
        
        // 🔧 FIX: Handle already cached images
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, index]));
          console.log(`✅ Image ${index} loaded:`, src);
        };
        
        img.onerror = () => {
          setErrorImages(prev => new Set([...prev, index]));
          console.error(`❌ Image ${index} failed to load:`, src);
        };
        
        img.src = src;
        
        // 🚀 CRITICAL FIX: If image is already loaded (cached), trigger onload immediately
        if (img.complete && img.naturalHeight !== 0) {
          setLoadedImages(prev => new Set([...prev, index]));
          console.log(`🚀 Image ${index} already cached:`, src);
        }
      };

      // Preload current, next, and previous images
      validImages.forEach((src, index) => {
        if (Math.abs(index - currentIndex) <= 1) {
          preloadImage(src, index);
        }
      });
    } catch (error) {
      console.error('Error preloading images:', error);
    }
  }, [validImages, currentIndex]);

  const handleImageLoad = (index: number) => {
    try {
      setLoadedImages(prev => new Set([...prev, index]));
      console.log(`🎯 Direct load success for image ${index}`);
    } catch (error) {
      console.error('Error handling image load:', error);
    }
  };

  const handleImageError = (index: number) => {
    try {
      setErrorImages(prev => new Set([...prev, index]));
      console.error(`💥 Direct load error for image ${index}`);
    } catch (error) {
      console.error('Error handling image error:', error);
    }
  };

  const goToImage = (index: number) => {
    try {
      if (index >= 0 && index < validImages.length) {
        setCurrentIndex(index);
        setIsZoomed(false);
      }
    } catch (error) {
      console.error('Error navigating to image:', error);
    }
  };

  const goToNext = () => {
    try {
      goToImage(currentIndex + 1 >= validImages.length ? 0 : currentIndex + 1);
    } catch (error) {
      console.error('Error going to next image:', error);
    }
  };

  const goToPrevious = () => {
    try {
      goToImage(currentIndex - 1 < 0 ? validImages.length - 1 : currentIndex - 1);
    } catch (error) {
      console.error('Error going to previous image:', error);
    }
  };

  // 🛡️ Safety check for empty images
  if (!validImages || validImages.length === 0) {
    return (
      <div className={`aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-50">🪙</div>
          <span className="text-gray-500 text-sm font-medium">No images available</span>
        </div>
      </div>
    );
  }

  // 🛡️ Safety check for current index
  const safeCurrentIndex = Math.max(0, Math.min(currentIndex, validImages.length - 1));
  const currentImageUrl = validImages[safeCurrentIndex] || '/placeholder-coin.svg';
  const isCurrentImageLoaded = loadedImages.has(safeCurrentIndex);
  const isCurrentImageError = errorImages.has(safeCurrentIndex);

  console.log(`🎯 Current image ${safeCurrentIndex}: loaded=${isCurrentImageLoaded}, error=${isCurrentImageError}, url=${currentImageUrl}`);

  return (
    <div className={`relative ${className}`}>
      {/* Main Image Display */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner">
        {/* Navigation Arrows for Multiple Images */}
        {validImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full w-8 h-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full w-8 h-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {validImages.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {safeCurrentIndex + 1} / {validImages.length}
          </div>
        )}

        {isCurrentImageError ? (
          // Error state
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-center">
              <div className="text-4xl mb-2">⚠️</div>
              <p className="text-sm text-gray-600">Image failed to load</p>
              <p className="text-xs text-gray-500 mt-1">Using placeholder instead</p>
            </div>
          </div>
        ) : (
          <>
            <img
              src={currentImageUrl}
              alt={`${safeCoinName} - Image ${safeCurrentIndex + 1}`}
              className={`w-full h-full object-contain transition-all duration-300 ${
                isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
              } ${isCurrentImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ 
                display: 'block', 
                minHeight: '100%'
              }}
              onLoad={() => handleImageLoad(safeCurrentIndex)}
              onError={() => handleImageError(safeCurrentIndex)}
              onClick={() => {
                try {
                  setIsZoomed(!isZoomed);
                } catch (error) {
                  console.error('Error toggling zoom:', error);
                }
              }}
              loading="eager"
            />
            
            {/* Loading indicator - only show if image hasn't loaded yet AND no error */}
            {!isCurrentImageLoaded && !isCurrentImageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-200 border-t-blue-600"></div>
                  <span className="text-sm text-gray-600 font-medium">Loading image...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Thumbnail Navigation - Only show when there are multiple images */}
      {validImages.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {validImages.map((image, index) => {
            if (!image || typeof image !== 'string') return null;
            
            return (
              <button
                key={`${index}-${image}`}
                onClick={() => goToImage(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === safeCurrentIndex 
                    ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-102'
                }`}
              >
                {errorImages.has(index) ? (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Error</span>
                  </div>
                ) : (
                  <>
                    <img
                      src={image}
                      alt={`${safeCoinName} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover transition-opacity duration-200"
                      loading="lazy"
                      onLoad={() => handleImageLoad(index)}
                      onError={() => handleImageError(index)}
                    />
                    
                    {/* Thumbnail loading indicator */}
                    {!loadedImages.has(index) && !errorImages.has(index) && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}

                    {/* Active indicator */}
                    {index === safeCurrentIndex && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
