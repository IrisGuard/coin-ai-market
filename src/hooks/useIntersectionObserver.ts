// PHASE 5: Advanced Intersection Observer hook for lazy loading and animations
import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
}: UseIntersectionObserverOptions = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);

        if (isVisible && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [threshold, rootMargin, hasIntersected]);

  // Return appropriate intersection state based on triggerOnce setting
  const shouldShow = triggerOnce ? hasIntersected : isIntersecting;

  return {
    elementRef,
    isIntersecting: shouldShow,
    hasIntersected,
  };
};

// PHASE 5: Lazy loading hook for images
export const useLazyLoading = (initialSrc?: string) => {
  const [src, setSrc] = useState<string | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px', // Start loading 100px before element comes into view
    triggerOnce: true,
  });

  useEffect(() => {
    if (isIntersecting && initialSrc && !src) {
      setSrc(initialSrc);
    }
  }, [isIntersecting, initialSrc, src]);

  const handleLoad = () => {
    setIsLoaded(true);
    setError(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(false);
  };

  return {
    elementRef,
    src,
    isLoaded,
    error,
    handleLoad,
    handleError,
    isIntersecting,
  };
};

// PHASE 5: Animation trigger hook
export const useAnimationTrigger = (delay: number = 0) => {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '0px',
    triggerOnce: true,
  });

  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isIntersecting && !shouldAnimate) {
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isIntersecting, shouldAnimate, delay]);

  return {
    elementRef,
    shouldAnimate,
    isIntersecting,
  };
};