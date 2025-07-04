import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ImageGalleryProps {
  images: string[];
  coinName: string;
  className?: string;
  showThumbnails?: boolean;
  compact?: boolean;
  showMainOnly?: boolean;
  thumbnailsOnly?: boolean;
}

const ImageGallery = ({ 
  images = [], 
  coinName = 'Coin', 
  className = '', 
  showThumbnails = true,
  compact = false,
  showMainOnly = false,
  thumbnailsOnly = false
}: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<number>>(new Set());
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const isMobile = useIsMobile();
  
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

  const goToNext = useCallback(() => {
    try {
      goToImage(currentIndex + 1 >= validImages.length ? 0 : currentIndex + 1);
    } catch (error) {
      console.error('Error going to next image:', error);
    }
  }, [currentIndex, validImages.length]);

  const goToPrevious = useCallback(() => {
    try {
      goToImage(currentIndex - 1 < 0 ? validImages.length - 1 : currentIndex - 1);
    } catch (error) {
      console.error('Error going to previous image:', error);
    }
  }, [currentIndex, validImages.length]);

  // PHASE 5: CONTAINER-ENFORCED touch gesture handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile || showMainOnly) return;
    e.stopPropagation(); // Prevent event bubbling
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || showMainOnly) return;
    e.stopPropagation(); // Prevent event bubbling
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile || showMainOnly || !touchStart || !touchEnd) return;
    e.stopPropagation(); // Prevent event bubbling
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && validImages.length > 1) {
      goToNext();
    }
    if (isRightSwipe && validImages.length > 1) {
      goToPrevious();
    }
  };

  // PHASE 5: Keyboard navigation
  useEffect(() => {
    if (showMainOnly || thumbnailsOnly) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'Escape') {
        setIsZoomed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, showMainOnly, thumbnailsOnly]);

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

  // PHASE 4: Return only thumbnails if thumbnailsOnly mode
  if (thumbnailsOnly) {
    return (
      <div className={`flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide ${className}`}>
        {validImages.map((image, index) => {
          if (!image || typeof image !== 'string') return null;
          
          return (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === safeCurrentIndex 
                  ? 'border-blue-500 ring-1 ring-blue-200' 
                  : 'border-gray-200 hover:border-gray-300'
              } bg-gray-100`}
              title={`View image ${index + 1}`}
            >
              {errorImages.has(index) ? (
                <img
                  src="/placeholder-coin.svg"
                  alt={`${safeCoinName} thumbnail placeholder`}
                  className="w-full h-full object-contain opacity-70"
                />
              ) : (
                <img
                  src={image}
                  alt={`${safeCoinName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-200"
                  loading="lazy"
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                />
              )}
              {index === safeCurrentIndex && (
                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* CONTAINER-ENFORCED: Main Image Display */}
      <div 
        className="relative aspect-square w-full max-w-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg border border-gray-200"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          boxSizing: 'border-box',
          maxWidth: '100%',
          touchAction: 'pan-y pinch-zoom',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* CONTAINER-ENFORCED: Navigation Arrows */}
        {validImages.length > 1 && !showMainOnly && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full w-8 h-8 p-0 transition-all duration-200 opacity-80 hover:opacity-100 shadow-lg"
              style={{ touchAction: 'manipulation' }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full w-8 h-8 p-0 transition-all duration-200 opacity-80 hover:opacity-100 shadow-lg"
              style={{ touchAction: 'manipulation' }}
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* CONTAINER-ENFORCED: Image Counter */}
        {validImages.length > 1 && !showMainOnly && (
          <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
            {safeCurrentIndex + 1} / {validImages.length}
          </div>
        )}

        {isCurrentImageError ? (
          // Error state - Show placeholder
          <img
            src="/placeholder-coin.svg"
            alt={`${safeCoinName} - Placeholder`}
            className="w-full h-full object-contain"
          />
        ) : (
          <>
            <img
              src={currentImageUrl}
              alt={`${safeCoinName} - Image ${safeCurrentIndex + 1}`}
              className={`w-full h-full max-w-full max-h-full object-contain transition-opacity duration-200 ${
                isCurrentImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ 
                boxSizing: 'border-box',
                maxWidth: '100%',
                maxHeight: '100%'
              }}
              onLoad={() => handleImageLoad(safeCurrentIndex)}
              onError={() => handleImageError(safeCurrentIndex)}
              loading="eager"
              draggable={false}
            />
            
            {/* CONTAINER-ENFORCED: Loading indicator */}
            {!isCurrentImageLoaded && !isCurrentImageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-200 border-t-blue-600 shadow-lg"></div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* CONTAINER-ENFORCED: Thumbnail Navigation */}
      {validImages.length > 1 && showThumbnails && !showMainOnly && (
        <div className="flex gap-2 mt-3 justify-center overflow-x-auto scrollbar-hide px-2">
          {validImages.map((image, index) => {
            if (!image || typeof image !== 'string') return null;
            
            return (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 shadow-md ${
                  index === safeCurrentIndex 
                    ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg' 
                    : 'border-gray-300 hover:border-gray-400 hover:shadow-lg'
                } bg-gray-100`}
                style={{ touchAction: 'manipulation' }}
                title={`View image ${index + 1}`}
              >
                {errorImages.has(index) ? (
                  <img
                    src="/placeholder-coin.svg"
                    alt={`${safeCoinName} thumbnail placeholder`}
                    className="w-full h-full object-contain opacity-70"
                  />
                ) : (
                  <>
                    <img
                      src={image}
                      alt={`${safeCoinName} thumbnail ${index + 1}`}
                      className="w-full h-full max-w-full max-h-full object-cover"
                      style={{ 
                        boxSizing: 'border-box',
                        maxWidth: '100%',
                        maxHeight: '100%'
                      }}
                      loading="lazy"
                      onLoad={() => handleImageLoad(index)}
                      onError={() => handleImageError(index)}
                    />
                    
                    {/* Active indicator */}
                    {index === safeCurrentIndex && (
                      <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center rounded-lg">
                        <div className="w-3 h-3 bg-blue-600 rounded-full shadow-lg"></div>
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
