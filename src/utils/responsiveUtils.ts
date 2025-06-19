
export const breakpoints = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

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
    screenSize: getScreenSize(),
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

export const formatTextForMobile = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export const optimizeImageForMobile = (imageUrl: string, size: 'small' | 'medium' | 'large' = 'medium'): string => {
  if (!imageUrl) return '';
  
  const sizeParams = {
    small: 'w=150&h=150',
    medium: 'w=300&h=300',
    large: 'w=600&h=600',
  };
  
  if (imageUrl.includes('supabase')) {
    return `${imageUrl}?${sizeParams[size]}&format=webp&quality=80`;
  }
  
  return imageUrl;
};

export const getOptimalColumns = (containerWidth: number, itemMinWidth: number = 280): number => {
  return Math.max(1, Math.floor(containerWidth / itemMinWidth));
};

export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const getMobileOrientation = (): 'portrait' | 'landscape' => {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};

export const addMobileViewportMeta = (): void => {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(meta);
  }
};
