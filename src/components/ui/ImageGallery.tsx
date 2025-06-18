
import React, { useState, useEffect } from 'react';
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
  
  // Filter out null/undefined images and ensure we have valid URLs
  const validImages = images.filter(img => img && img.length > 0 && !img.startsWith('blob:'));
  
  // DEBUG: Log the images being processed
  useEffect(() => {
    console.log('🔍 ImageGallery DEBUG for coin:', coinName);
    console.log('🔍 Raw images received:', images);
    console.log('🔍 Valid images filtered:', validImages);
    console.log('🔍 Current index:', currentIndex);
  }, [images, coinName, validImages, currentIndex]);

  if (validImages.length === 0) {
    console.log('❌ No valid images found for:', coinName);
    return (
      <div className={`aspect-square bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-500">No images available</span>
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
        <img
          src={currentImageUrl}
          alt={`${coinName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          style={{ display: 'block', minHeight: '100%' }}
          onLoad={() => console.log('✅ Image loaded successfully:', currentImageUrl)}
          onError={(e) => {
            console.error('❌ Image failed to load:', currentImageUrl);
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            // Don't replace with placeholder - let it fail visibly for debugging
          }}
        />
        
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
                onError={(e) => {
                  console.error('❌ Thumbnail failed to load:', image);
                  const target = e.target as HTMLImageElement;
                  target.style.opacity = '0.3';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
