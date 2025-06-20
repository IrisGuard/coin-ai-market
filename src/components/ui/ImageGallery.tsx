
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ImageGalleryProps {
  images: string[];
  coinName: string;
  className?: string;
}

const ImageGallery = ({ images, coinName, className = '' }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  
  // Memoize valid images to prevent unnecessary recalculation
  const validImages = useMemo(() => {
    const filtered = images.filter(img => img && img.length > 0 && !img.startsWith('blob:'));
    console.log(`🔍 ImageGallery for ${coinName}: ${images.length} raw -> ${filtered.length} valid images`);
    return filtered;
  }, [images, coinName]);
  
  // DEBUG: Log the images being processed
  useEffect(() => {
    console.log('🔍 ImageGallery DEBUG for coin:', coinName);
    console.log('🔍 Raw images received:', images);
    console.log('🔍 Valid images filtered:', validImages);
    console.log('🔍 Current index:', currentIndex);
    
    // Special debug for the Greece coin
    if (coinName.includes('GREECE COIN 10 LEPTA DOUBLED DIE ERROR')) {
      console.log('🏛️ GREECE COIN GALLERY DEBUG:');
      console.log('🏛️ Raw images array:', images);
      console.log('🏛️ Valid images array:', validImages);
      console.log('🏛️ Images count:', validImages.length);
      validImages.forEach((img, idx) => {
        console.log(`🏛️ Image ${idx + 1}:`, img);
      });
    }
  }, [images, coinName, validImages, currentIndex]);

  // Reset current index if it's out of bounds
  useEffect(() => {
    if (currentIndex >= validImages.length && validImages.length > 0) {
      setCurrentIndex(0);
    }
  }, [validImages.length, currentIndex]);

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set([...prev, index]));
    console.log(`✅ Image ${index + 1} loaded successfully for ${coinName}`);
  };

  const handleImageError = (index: number, imageUrl: string) => {
    console.error(`❌ Image ${index + 1} failed to load for ${coinName}:`, imageUrl);
  };

  if (validImages.length === 0) {
    console.log('❌ No valid images found for:', coinName);
    return (
      <div className={`aspect-square bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-2">🪙</div>
          <span className="text-gray-500 text-sm">No images available</span>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const currentImageUrl = validImages[currentIndex];
  console.log('🖼️ Displaying image:', currentImageUrl);

  return (
    <div className={`relative ${className}`}>
      {/* Main Image Display */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
        {/* Enhanced image with better loading */}
        <img
          src={currentImageUrl}
          alt={`${coinName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ 
            display: 'block', 
            minHeight: '100%',
            opacity: loadedImages.has(currentIndex) ? 1 : 0.7
          }}
          onLoad={() => handleImageLoad(currentIndex)}
          onError={() => handleImageError(currentIndex, currentImageUrl)}
          loading="eager" // Prioritize loading for main image
        />
        
        {/* Loading indicator */}
        {!loadedImages.has(currentIndex) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {/* Image Counter */}
        <Badge className="absolute top-2 right-2 bg-black/60 text-white">
          {currentIndex + 1} / {validImages.length}
        </Badge>
        
        {/* Navigation Buttons - only show if multiple images */}
        {validImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      
      {/* Thumbnail Navigation - only show if multiple images */}
      {validImages.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                index === currentIndex 
                  ? 'border-blue-500' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${coinName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy" // Lazy load thumbnails for performance
                onError={() => handleImageError(index, image)}
              />
              
              {/* Thumbnail loading indicator */}
              {!loadedImages.has(index) && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      )}
      
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && coinName.includes('GREECE') && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <strong>DEBUG:</strong> {validImages.length} images loaded for {coinName}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
