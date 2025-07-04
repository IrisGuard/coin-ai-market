// PHASE 5: High-performance lazy loading image component
import React from 'react';
import { useLazyLoading } from '@/hooks/useIntersectionObserver';
import { optimizeImageForMobile, isMobilePerformanceMode } from '@/utils/responsiveUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  sizes,
  priority = false,
  onLoad,
  onError,
}) => {
  const isMobile = useIsMobile();
  const isPerformanceMode = isMobilePerformanceMode();
  
  // Optimize image source based on device capabilities
  const optimizedSrc = React.useMemo(() => {
    if (isPerformanceMode) {
      return optimizeImageForMobile(src, 'small');
    }
    return optimizeImageForMobile(src, isMobile ? 'medium' : 'large');
  }, [src, isMobile, isPerformanceMode]);

  const {
    elementRef,
    src: lazySrc,
    isLoaded,
    error,
    handleLoad,
    handleError,
    isIntersecting,
  } = useLazyLoading(priority ? optimizedSrc : undefined);

  // For priority images, load immediately
  React.useEffect(() => {
    if (priority && !lazySrc && optimizedSrc) {
      // Force load priority images
      const img = elementRef.current as HTMLImageElement;
      if (img) {
        img.src = optimizedSrc;
      }
    }
  }, [priority, lazySrc, optimizedSrc, elementRef]);

  const handleImageLoad = () => {
    handleLoad();
    onLoad?.();
  };

  const handleImageError = () => {
    handleError();
    onError?.();
  };

  return (
    <div 
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Placeholder/Loading state */}
      {!isLoaded && !error && (
        <div className={`absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 ${placeholderClassName}`}>
          <div className="absolute inset-0 shimmer"></div>
          {isIntersecting && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-200 border-t-blue-600"></div>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className={`absolute inset-0 bg-gray-100 flex items-center justify-center ${placeholderClassName}`}>
          <div className="text-center text-gray-500">
            <div className="text-3xl mb-2">🖼️</div>
            <div className="text-sm">Image unavailable</div>
          </div>
        </div>
      )}

      {/* Actual image */}
      {(lazySrc || priority) && (
        <img
          src={lazySrc || optimizedSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleImageLoad}
          onError={handleImageError}
          draggable={false}
        />
      )}
    </div>
  );
};

export default LazyImage;