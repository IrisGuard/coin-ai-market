
export const breakpoints = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// PHASE 5: Enhanced responsive utilities with performance optimizations
export const useScreenSize = () => {
  const getScreenSize = (): Breakpoint => {
    const width = window.innerWidth;
    
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  };

  return {
    isMobile: window.innerWidth < breakpoints.md,
    isTablet: window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg,
    isDesktop: window.innerWidth >= breakpoints.lg,
    isTouch: 'ontouchstart' in window,
    screenSize: getScreenSize(),
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight,
  };
};

// PHASE 5: Enhanced text formatting for mobile
export const formatTextForMobile = (text: string, maxLength: number = 50): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

// PHASE 5: Advanced image optimization with lazy loading support
export const optimizeImageForMobile = (imageUrl: string, size: 'small' | 'medium' | 'large' = 'medium'): string => {
  if (!imageUrl) return '';
  
  const sizeParams = {
    small: 'w=150&h=150&q=75',
    medium: 'w=300&h=300&q=80',
    large: 'w=600&h=600&q=85',
  };
  
  // Enhanced Supabase image optimization
  if (imageUrl.includes('supabase')) {
    return `${imageUrl}?${sizeParams[size]}&format=webp&quality=80&auto=compress`;
  }
  
  return imageUrl;
};

// PHASE 5: Smart grid columns calculation
export const getOptimalColumns = (containerWidth: number, itemMinWidth: number = 280): number => {
  const columns = Math.max(1, Math.floor(containerWidth / itemMinWidth));
  
  // Apply responsive constraints
  if (containerWidth < breakpoints.sm) return 1;
  if (containerWidth < breakpoints.md) return Math.min(2, columns);
  if (containerWidth < breakpoints.lg) return Math.min(3, columns);
  if (containerWidth < breakpoints.xl) return Math.min(4, columns);
  if (containerWidth < breakpoints['2xl']) return Math.min(5, columns);
  
  return Math.min(6, columns); // Max 6 columns
};

// PHASE 5: Enhanced touch device detection
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || 
         navigator.maxTouchPoints > 0 || 
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const getMobileOrientation = (): 'portrait' | 'landscape' => {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};

// PHASE 5: Performance-optimized viewport management
export const addMobileViewportMeta = (): void => {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';
    document.head.appendChild(meta);
  }
};

// PHASE 5: Mobile performance utilities
export const isMobilePerformanceMode = (): boolean => {
  const connection = (navigator as any).connection;
  const deviceMemory = (navigator as any).deviceMemory;
  
  // Enable performance mode on slow connections or low-memory devices
  if (connection && connection.effectiveType === 'slow-2g') return true;
  if (connection && connection.effectiveType === '2g') return true;
  if (deviceMemory && deviceMemory < 4) return true; // Less than 4GB RAM
  
  return false;
};

// PHASE 5: Responsive image loading strategy
export const getImageLoadingStrategy = (index: number, isMobile: boolean): 'eager' | 'lazy' => {
  // Load first few images eagerly, rest lazily
  const eagerCount = isMobile ? 4 : 8;
  return index < eagerCount ? 'eager' : 'lazy';
};

// PHASE 5: Touch gesture utilities
export const getTouchDirection = (startX: number, startY: number, endX: number, endY: number) => {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const absDeltaX = Math.abs(deltaX);
  const absDeltaY = Math.abs(deltaY);
  
  if (absDeltaX < 30 && absDeltaY < 30) return null; // Too small to be intentional
  
  if (absDeltaX > absDeltaY) {
    return deltaX > 0 ? 'right' : 'left';
  } else {
    return deltaY > 0 ? 'down' : 'up';
  }
};
