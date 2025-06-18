
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
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
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  
  // Memoize valid images to prevent unnecessary recalculation
  const validImages = useMemo(() => {
    const filtered = images.filter(img => img && img.length > 0 && !img.startsWith('blob:'));
    console.log(`🔍 ImageGallery for ${coinName}: ${images.length} raw -> ${filtered.length} valid images`);
    return filtered;
  }, [images, coinName]);
  
  // DEBUG: Log the images being processed
  useEffect(() => {
    if (coinName.includes('GREECE COIN 10 LEPTA DOUBLED DIE ERROR')) {
      console.log('🏛️ GREECE COIN GALLERY DEBUG:');
      console.log('🏛️ Raw images array:', images);
      console.log('🏛️ Valid images array:', validImages);
      console.log('🏛️ Images count:', validImages.length);
      validImages.forEach((img, idx) => {
        console.log(`🏛️ Image ${idx + 1}:`, img);
      });
    }
  }, [images, coinName, validImages]);

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
    setImageErrors(prev => new Set([...prev, index]));
    console.error(`❌ Image ${index + 1} failed to load for ${coinName}:`, imageUrl);
  };

  if (validImages.length === 0) {
    console.log('❌ No valid images found for:', coinName);
    return (
      <div className={`aspect-square bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200 ${className}`}>
        <div className="text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
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

  return (
    <div className={`relative ${className}`}>
      {/* Main Image Display */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-white border">
        {/* Main image with better loading handling */}
        <img
          src={currentImageUrl}
          alt={`${coinName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          style={{ 
            opacity: loadedImages.has(currentIndex) && !imageErrors.has(currentIndex) ? 1 : 0.8
          }}
          onLoad={() => handleImageLoad(currentIndex)}
          onError={() => handleImageError(currentIndex, currentImageUrl)}
          loading="eager"
        />
        
        {/* Enhanced loading indicator */}
        {!loadedImages.has(currentIndex) && !imageErrors.has(currentIndex) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <span className="text-sm text-gray-500">Loading...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {imageErrors.has(currentIndex) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-500">Failed to load image</span>
            </div>
          </div>
        )}
        
        {/* Enhanced Image Counter with white background */}
        <Badge className="absolute top-3 right-3 bg-white/90 text-gray-800 border-0 px-3 py-1">
          {currentIndex + 1} / {validImages.length}
        </Badge>
        
        {/* Navigation Buttons - only show if multiple images */}
        {validImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 text-gray-800 h-10 w-10 rounded-full shadow-lg"
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 text-gray-800 h-10 w-10 rounded-full shadow-lg"
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
      
      {/* Enhanced Thumbnail Navigation - only show if multiple images */}
      {validImages.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                index === currentIndex 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${coinName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover bg-white"
                loading="lazy"
                onError={() => handleImageError(index, image)}
              />
              
              {/* Thumbnail loading indicator */}
              {!loadedImages.has(index) && !imageErrors.has(index) && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
              )}

              {/* Error overlay for thumbnails */}
              {imageErrors.has(index) && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="h-4 w-4 text-gray-400" />
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
