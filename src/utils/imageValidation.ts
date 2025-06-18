
export const validateImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  // Check if it's a valid Supabase storage URL
  if (url.includes('supabase.co/storage/v1/object/public/')) {
    return true;
  }
  
  // Check if it's a valid HTTP/HTTPS URL
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export const getValidImages = (images: (string | null | undefined)[]): string[] => {
  return images
    .filter((img): img is string => Boolean(img))
    .filter(img => !img.startsWith('blob:'))
    .filter(validateImageUrl);
};

export const getImageWithFallback = (imageUrl: string | null | undefined, fallback = '/placeholder.svg'): string => {
  if (!imageUrl || !validateImageUrl(imageUrl)) {
    return fallback;
  }
  return imageUrl;
};

export const preloadImage = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
};
