
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Image as ImageIcon, Sparkles, Zap, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdvancedImageEnhancer from './AdvancedImageEnhancer';
import ImageQualityAnalyzer from './ImageQualityAnalyzer';

interface UltraFastImageGalleryProps {
  images: string[];
  coinName: string;
  className?: string;
  enableEnhancement?: boolean;
  showQualityAnalysis?: boolean;
}

const UltraFastImageGallery = ({ 
  images, 
  coinName, 
  className = '',
  enableEnhancement = false,
  showQualityAnalysis = false 
}: UltraFastImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const [enhancedImages, setEnhancedImages] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [showEnhancer, setShowEnhancer] = useState(false);
  
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

  // Ultra-fast preloading system with enhancement support
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
        
        // Priority loading for first image with enhanced quality
        if (index === 0) {
          img.loading = 'eager';
          // Apply ultra-high quality rendering
          img.style.imageRendering = 'high-quality';
        }
      });
    });

    // Load first image immediately for instant display
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

  const handleImageEnhanced = useCallback((originalUrl: string, enhancedUrl: string) => {
    setEnhancedImages(prev => new Map([...prev, [originalUrl, enhancedUrl]]));
    setShowEnhancer(false);
  }, []);

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
  const displayImageUrl = enhancedImages.get(currentImageUrl) || currentImageUrl;
  const isCurrentImageLoaded = preloadedImages.has(currentImageUrl);
  const isEnhanced = enhancedImages.has(currentImageUrl);

  return (
    <div className={className}>
      {/* Main Image Display - Ultra Fast with Enhancement */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-white border mb-4">
        {/* Enhanced image display with ultra-high quality */}
        <img
          src={displayImageUrl}
          alt={`${coinName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
          style={{ 
            opacity: isCurrentImageLoaded ? 1 : 0.7,
            imageRendering: 'high-quality',
            filter: isEnhanced ? 'none' : 'unset'
          }}
          loading="eager"
          fetchPriority="high"
        />
        
        {/* Enhancement indicators */}
        {isEnhanced && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-purple-600 text-white text-xs flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI Enhanced
            </Badge>
          </div>
        )}
        
        {/* Enhancement controls */}
        {enableEnhancement && (
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowEnhancer(!showEnhancer)}
              className="bg-white/90 hover:bg-white text-gray-800 text-xs"
            >
              <Zap className="h-3 w-3 mr-1" />
              Enhance
            </Button>
          </div>
        )}
        
        {/* Ultra-fast loading state */}
        {isLoading && !isCurrentImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-blue-200 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>

      {/* Image Enhancement Panel */}
      {showEnhancer && enableEnhancement && (
        <div className="mb-4">
          <AdvancedImageEnhancer
            image={currentImageUrl}
            onEnhanced={(enhancedUrl) => handleImageEnhanced(currentImageUrl, enhancedUrl)}
          />
        </div>
      )}

      {/* Quality Analysis Panel */}
      {showQualityAnalysis && (
        <div className="mb-4">
          <ImageQualityAnalyzer imageUrl={displayImageUrl} />
        </div>
      )}
      
      {/* Ultra-fast thumbnail navigation with quality indicators */}
      {validImages.length > 1 && (
        <div className="flex gap-2 justify-center overflow-x-auto pb-2">
          {validImages.map((image, index) => {
            const thumbnailUrl = enhancedImages.get(image) || image;
            const isThisEnhanced = enhancedImages.has(image);
            
            return (
              <button
                key={`${image}-${index}`}
                onClick={() => setCurrentIndex(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                  index === currentIndex 
                    ? 'border-blue-500 ring-2 ring-blue-200 scale-105' 
                    : 'border-gray-200 hover:border-gray-300 hover:scale-102'
                }`}
              >
                <img
                  src={thumbnailUrl}
                  alt={`${coinName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover bg-white"
                  loading="lazy"
                  style={{ imageRendering: 'high-quality' }}
                />
                
                {/* Enhanced indicator on thumbnail */}
                {isThisEnhanced && (
                  <div className="absolute top-0.5 left-0.5">
                    <Sparkles className="h-2 w-2 text-purple-600" />
                  </div>
                )}
                
                {/* Ultra-fast counter badge */}
                <Badge className="absolute top-0.5 right-0.5 bg-white/95 text-gray-800 border-0 px-1 py-0 text-xs min-w-0 h-4 leading-none">
                  {index + 1}
                </Badge>
              </button>
            );
          })}
        </div>
      )}

      {/* Quality Summary */}
      <div className="text-center text-xs text-gray-500 mt-2">
        {enhancedImages.size > 0 && (
          <span className="text-purple-600 font-medium">
            ✨ {enhancedImages.size} image{enhancedImages.size !== 1 ? 's' : ''} AI-enhanced
          </span>
        )}
        {enhancedImages.size > 0 && validImages.length > enhancedImages.size && ' • '}
        <span>Ultra-High Quality • Professional Ready</span>
      </div>
    </div>
  );
};

export default UltraFastImageGallery;
