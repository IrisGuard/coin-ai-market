
// Bundle size optimization utilities

// Tree-shaking helpers
export const createOptimizedImport = <T>(
  moduleFactory: () => Promise<T>,
  fallback?: T
) => {
  return async (): Promise<T> => {
    try {
      return await moduleFactory();
    } catch (error) {
      console.warn('Failed to load module:', error);
      if (fallback) return fallback;
      throw error;
    }
  };
};

// Preload critical resources
export const preloadCriticalResources = () => {
  const criticalImages = [
    '/lovable-uploads/fc7c60ba-6810-44ba-b3af-8e1882db04ba.png'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Optimize imports for better tree-shaking
export const optimizedLucideImports = {
  // Instead of importing the entire lucide-react package
  // Import specific icons to reduce bundle size
  icons: {
    Home: () => import('lucide-react/dist/esm/icons/home'),
    Search: () => import('lucide-react/dist/esm/icons/search'),
    User: () => import('lucide-react/dist/esm/icons/user'),
    Settings: () => import('lucide-react/dist/esm/icons/settings')
  }
};

// Resource hints for better performance
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const domains = [
    'wdgnllgbfvjgurbqhfqb.supabase.co'
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });
};

// Initialize optimizations
if (typeof window !== 'undefined') {
  preloadCriticalResources();
  addResourceHints();
}

export default {
  createOptimizedImport,
  preloadCriticalResources,
  addResourceHints,
  optimizedLucideImports
};
