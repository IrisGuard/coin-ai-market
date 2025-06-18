
export const validateProductionEnvironment = (): boolean => {
  // Check for production-ready environment
  const hasSupabaseUrl = !!import.meta.env.VITE_SUPABASE_URL;
  const hasSupabaseKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  return hasSupabaseUrl && hasSupabaseKey;
};

export const validateImageUrls = (images: string[]): string[] => {
  return images.filter(url => {
    if (!url || typeof url !== 'string') return false;
    if (url.startsWith('blob:')) return false;
    
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  });
};

export const sanitizeUserInput = (input: string): string => {
  return input.replace(/<script[^>]*>.*?<\/script>/gi, '')
              .replace(/javascript:/gi, '')
              .replace(/on\w+=/gi, '');
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};
