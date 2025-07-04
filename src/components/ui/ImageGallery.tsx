import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
  images: string[];
  coinName: string;
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  coinName, 
  className = '' 
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Simple image validation
  const validImages = images.filter(img => 
    img && 
    typeof img === 'string' && 
    img.trim() !== '' && 
    !img.startsWith('blob:')
  );

  const displayImages = validImages.length > 0 ? validImages : ['/placeholder-coin.svg'];
  const currentImage = displayImages[selectedIndex] || displayImages[0];

  const handlePrevious = () => {
    if (displayImages.length > 1) {
      setSelectedIndex(prev => prev === 0 ? displayImages.length - 1 : prev - 1);
    }
  };

  const handleNext = () => {
    if (displayImages.length > 1) {
      setSelectedIndex(prev => prev === displayImages.length - 1 ? 0 : prev + 1);
    }
  };

  return (
    <div className={`relative w-full aspect-square bg-gray-50 rounded-xl overflow-hidden ${className}`}>
      {/* Main Image */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={currentImage}
          alt={`${coinName} - Image ${selectedIndex + 1}`}
          className="w-full h-full object-contain"
          draggable={false}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (img.src !== '/placeholder-coin.svg') {
              img.src = '/placeholder-coin.svg';
            }
          }}
        />
        
        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 p-1 bg-black/20 rounded-lg">
          {displayImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`w-8 h-8 rounded-md overflow-hidden border-2 transition-all ${
                index === selectedIndex 
                  ? 'border-blue-400' 
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (img.src !== '/placeholder-coin.svg') {
                    img.src = '/placeholder-coin.svg';
                  }
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {displayImages.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
          {selectedIndex + 1} / {displayImages.length}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;