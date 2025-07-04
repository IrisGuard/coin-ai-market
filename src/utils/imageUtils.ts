/**
 * Image Utilities for Coin AI Market
 * Debug and validation tools for images
 */

import { supabase } from '@/integrations/supabase/client';

export interface ImageValidationResult {
  url: string;
  isValid: boolean;
  isLoading: boolean;
  error?: string;
  naturalWidth?: number;
  naturalHeight?: number;
}

export interface CoinImageReport {
  coinId: string;
  coinName: string;
  userId: string;
  userName?: string;
  storeName?: string;
  images: ImageValidationResult[];
  hasValidImages: boolean;
  totalImages: number;
  validImages: number;
  brokenImages: number;
}

/**
 * Validate a single image URL
 */
export const validateImageUrl = (url: string): Promise<ImageValidationResult> => {
  return new Promise((resolve) => {
    if (!url || typeof url !== 'string' || url.trim() === '') {
      resolve({
        url: url || '',
        isValid: false,
        isLoading: false,
        error: 'Empty or invalid URL'
      });
      return;
    }

    // Check for blob URLs (temporary)
    if (url.startsWith('blob:')) {
      resolve({
        url,
        isValid: false,
        isLoading: false,
        error: 'Temporary blob URL - needs permanent storage'
      });
      return;
    }

    // Check for placeholder
    if (url === '/placeholder-coin.svg') {
      resolve({
        url,
        isValid: true,
        isLoading: false,
        naturalWidth: 400,
        naturalHeight: 400
      });
      return;
    }

    const img = new Image();
    let resolved = false;

    const handleLoad = () => {
      if (resolved) return;
      resolved = true;
      resolve({
        url,
        isValid: true,
        isLoading: false,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      });
    };

    const handleError = () => {
      if (resolved) return;
      resolved = true;
      resolve({
        url,
        isValid: false,
        isLoading: false,
        error: 'Failed to load image'
      });
    };

    const handleTimeout = () => {
      if (resolved) return;
      resolved = true;
      resolve({
        url,
        isValid: false,
        isLoading: false,
        error: 'Image load timeout (10s)'
      });
    };

    img.onload = handleLoad;
    img.onerror = handleError;
    
    // Set timeout for slow loading images
    setTimeout(handleTimeout, 10000);

    // If image is already cached, it might trigger onload immediately
    img.src = url;
    
    if (img.complete && img.naturalHeight !== 0) {
      handleLoad();
    }
  });
};

/**
 * Get all images from a coin object
 */
export const extractCoinImages = (coin: any): string[] => {
  const images: string[] = [];
  
  // From images array
  if (coin.images && Array.isArray(coin.images)) {
    images.push(...coin.images.filter(img => img && typeof img === 'string'));
  }
  
  // From individual fields
  const individualImages = [coin.image, coin.obverse_image, coin.reverse_image]
    .filter(img => img && typeof img === 'string' && !images.includes(img));
  
  images.push(...individualImages);
  
  return images;
};

/**
 * Generate comprehensive image report for all coins
 */
export const generateImageReport = async (): Promise<CoinImageReport[]> => {
  try {
    console.log('🔍 Starting comprehensive image validation...');
    
    // Fetch all coins with user and store information
    const { data: coins, error } = await supabase
      .from('coins')
      .select(`
        id,
        name,
        user_id,
        image,
        images,
        obverse_image,
        reverse_image,
        profiles!inner(
          username,
          name
        ),
        stores(
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching coins:', error);
      throw error;
    }

    const reports: CoinImageReport[] = [];

    for (const coin of coins || []) {
      const imageUrls = extractCoinImages(coin);
      const imageValidations: ImageValidationResult[] = [];

      // Validate each image
      for (const url of imageUrls) {
        const validation = await validateImageUrl(url);
        imageValidations.push(validation);
      }

      const validImages = imageValidations.filter(img => img.isValid).length;
      const brokenImages = imageValidations.filter(img => !img.isValid).length;

      const report: CoinImageReport = {
        coinId: coin.id,
        coinName: coin.name,
        userId: coin.user_id,
        userName: (coin.profiles as any)?.name || (coin.profiles as any)?.username || 'Unknown User',
        storeName: coin.stores?.[0]?.name,
        images: imageValidations,
        hasValidImages: validImages > 0,
        totalImages: imageUrls.length,
        validImages,
        brokenImages
      };

      reports.push(report);
      
      // Log progress
      if (reports.length % 10 === 0) {
        console.log(`📊 Processed ${reports.length} coins...`);
      }
    }

    console.log('✅ Image validation complete!');
    return reports;

  } catch (error) {
    console.error('💥 Error generating image report:', error);
    throw error;
  }
};

/**
 * Get summary statistics from image report
 */
export const getImageReportSummary = (reports: CoinImageReport[]) => {
  const totalCoins = reports.length;
  const coinsWithValidImages = reports.filter(r => r.hasValidImages).length;
  const coinsWithBrokenImages = reports.filter(r => r.brokenImages > 0).length;
  const totalImages = reports.reduce((sum, r) => sum + r.totalImages, 0);
  const totalValidImages = reports.reduce((sum, r) => sum + r.validImages, 0);
  const totalBrokenImages = reports.reduce((sum, r) => sum + r.brokenImages, 0);

  return {
    totalCoins,
    coinsWithValidImages,
    coinsWithBrokenImages,
    coinsWithoutAnyImages: totalCoins - coinsWithValidImages,
    totalImages,
    totalValidImages,
    totalBrokenImages,
    validImagePercentage: totalImages > 0 ? (totalValidImages / totalImages * 100).toFixed(2) : '0'
  };
};

/**
 * Get coins that need attention (broken or missing images)
 */
export const getProblematicCoins = (reports: CoinImageReport[]) => {
  return reports.filter(report => 
    !report.hasValidImages || report.brokenImages > 0
  ).sort((a, b) => b.brokenImages - a.brokenImages);
};

/**
 * Replace broken images with placeholder
 */
export const fixBrokenCoinImages = async (coinId: string): Promise<boolean> => {
  try {
    const { data: coin, error: fetchError } = await supabase
      .from('coins')
      .select('*')
      .eq('id', coinId)
      .single();

    if (fetchError || !coin) {
      console.error('❌ Error fetching coin:', fetchError);
      return false;
    }

    const images = extractCoinImages(coin);
    const updates: any = {};
    
    // Validate and fix each image field
    for (const url of images) {
      const validation = await validateImageUrl(url);
      if (!validation.isValid) {
        // Replace broken images with placeholder
        if (coin.image === url) updates.image = '/placeholder-coin.svg';
        if (coin.obverse_image === url) updates.obverse_image = '/placeholder-coin.svg';
        if (coin.reverse_image === url) updates.reverse_image = '/placeholder-coin.svg';
        
        // Fix images array
        if (coin.images && Array.isArray(coin.images)) {
          updates.images = coin.images.map((img: string) => 
            img === url ? '/placeholder-coin.svg' : img
          );
        }
      }
    }

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from('coins')
        .update(updates)
        .eq('id', coinId);

      if (updateError) {
        console.error('❌ Error updating coin:', updateError);
        return false;
      }

      console.log(`✅ Fixed broken images for coin ${coinId}`);
      return true;
    }

    return true;
  } catch (error) {
    console.error('💥 Error fixing coin images:', error);
    return false;
  }
}; 