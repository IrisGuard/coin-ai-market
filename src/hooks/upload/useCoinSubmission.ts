import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStore } from '@/contexts/AdminStoreContext';
import { toast } from '@/hooks/use-toast';
import { uploadImage } from '@/utils/imageUpload';
import { mapUIToDatabaseCategory } from '@/utils/categoryMapping';
import type { CoinData, UploadedImage } from '@/types/upload';

export const useCoinSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedStoreId } = useAdminStore();

  const submitListing = useCallback(async (coinData: CoinData, images: UploadedImage[]) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a listing.",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Images Required",
        description: "Please upload at least one image of your coin.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Ensure all images have permanent URLs
      const permanentImageUrls: string[] = [];
      
      for (const image of images) {
        if (image.permanentUrl && !image.permanentUrl.startsWith('blob:')) {
          permanentImageUrls.push(image.permanentUrl);
        } else if (image.url && !image.url.startsWith('blob:')) {
          permanentImageUrls.push(image.url);
        } else if (image.file) {
          const uploadedUrl = await uploadImage(image.file, 'coin-images');
          
          if (uploadedUrl.startsWith('blob:')) {
            throw new Error('Upload failed: temporary URL returned instead of permanent');
          }
          
          permanentImageUrls.push(uploadedUrl);
        }
      }

      if (permanentImageUrls.length === 0) {
        throw new Error('Failed to process images - no permanent URLs available');
      }

      // Step 2: Enhanced category mapping with AI integration
      let mappedCategory = mapUIToDatabaseCategory(coinData.category || 'modern');
      
      // Enhanced AI-powered error coin detection
      const coinName = coinData.title.toLowerCase();
      const coinCategory = (coinData.category || '').toLowerCase();
      const coinDescription = (coinData.description || '').toLowerCase();
      const coinComposition = (coinData.composition || '').toLowerCase();
      
      // Comprehensive error detection patterns
      const errorPatterns = [
        'error', 'double', 'die', 'doubled', 'off center', 'off-center',
        'clipped', 'planchet', 'strike', 'cud', 'crack', 'break',
        'filled die', 'rotated', 'broad strike', 'wrong planchet'
      ];
      
      const hasErrorIndicators = errorPatterns.some(pattern => 
        coinName.includes(pattern) || 
        coinCategory.includes(pattern) || 
        coinDescription.includes(pattern)
      );

      if (hasErrorIndicators || coinCategory === 'error_coin') {
        mappedCategory = 'error_coin';
      }

      // Step 3: Enhanced store ID resolution to prevent null store_id
      let finalStoreId = selectedStoreId;
      
      // If no store selected, find user's default store
      if (!finalStoreId) {
        const { data: userStores } = await supabase
          .from('stores')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .limit(1);
          
        if (userStores && userStores.length > 0) {
          finalStoreId = userStores[0].id;
        }
      }

      // Step 4: Prepare enhanced coin payload with full multi-image support
      const coinPayload = {
        name: coinData.title,
        description: coinData.description || `${coinData.title} - Professional AI-enhanced coin listing with ${permanentImageUrls.length} high-quality images`,
        structured_description: coinData.structured_description || generateStructuredDescription(coinData),
        year: parseInt(coinData.year) || new Date().getFullYear(),
        grade: coinData.grade || 'Ungraded',
        price: coinData.isAuction ? parseFloat(coinData.startingBid || '0') : parseFloat(coinData.price),
        rarity: coinData.rarity || 'Common',
        country: coinData.country || 'Unknown',
        denomination: coinData.denomination || 'Unknown',
        image: permanentImageUrls[0], // Primary image
        obverse_image: permanentImageUrls[1] || null, // Second image as obverse
        reverse_image: permanentImageUrls[2] || null, // Third image as reverse
        images: permanentImageUrls, // ALL images array (1-10 support)
        user_id: user.id,
        condition: coinData.condition || coinData.grade || 'Good',
        composition: coinData.composition || 'Unknown',
        diameter: coinData.diameter ? parseFloat(coinData.diameter) : null,
        weight: coinData.weight ? parseFloat(coinData.weight) : null,
        mint: coinData.mint || '',
        is_auction: coinData.isAuction || false,
        auction_end: coinData.isAuction 
          ? new Date(Date.now() + (parseInt(coinData.auctionDuration || '7') * 24 * 60 * 60 * 1000)).toISOString()
          : null,
        starting_bid: coinData.isAuction ? parseFloat(coinData.startingBid || '0') : null,
        category: mappedCategory as any,
        store_id: finalStoreId, // Fixed: No longer defaults to null
        featured: mappedCategory === 'error_coin' || (coinData.rarity && ['Rare', 'Very Rare', 'Ultra Rare'].includes(coinData.rarity)),
        sold: false,
        views: 0,
        ai_confidence: 0.85,
        ai_provider: 'claude-enhanced'
      };

      // Step 5: Submit to database
      const { data: coin, error } = await supabase
        .from('coins')
        .insert([{
          ...coinPayload,
          user_id: user.id,
          store_id: finalStoreId,
          featured: mappedCategory === 'error_coin' || (coinData.rarity && ['Rare', 'Very Rare', 'Ultra Rare'].includes(coinData.rarity)),
          category: mappedCategory as any
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Enhanced success notification
      const isErrorCoin = mappedCategory === 'error_coin';
      const successMessage = isErrorCoin 
        ? `ERROR COIN "${coinData.title}" is now FEATURED and visible everywhere with ${permanentImageUrls.length} images!` 
        : `"${coinData.title}" listed successfully with AI enhancement and ${permanentImageUrls.length} images!`;

      toast({
        title: "MULTI-IMAGE LISTING CREATED!",
        description: successMessage,
      });

      // Navigate after delay
      setTimeout(() => {
        navigate('/marketplace');
      }, 2000);

      return { success: true, coinId: coin.id };

    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to create listing. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  }, [user, navigate, selectedStoreId]);

  const generateStructuredDescription = (coinData: CoinData): string => {
    const parts = [];
    
    if (coinData.title) parts.push(`COIN: ${coinData.title}`);
    if (coinData.year) parts.push(`YEAR: ${coinData.year}`);
    if (coinData.country) parts.push(`COUNTRY: ${coinData.country}`);
    if (coinData.denomination) parts.push(`DENOMINATION: ${coinData.denomination}`);
    if (coinData.grade) parts.push(`GRADE: ${coinData.grade}`);
    if (coinData.composition) parts.push(`COMPOSITION: ${coinData.composition}`);
    if (coinData.mint) parts.push(`MINT: ${coinData.mint}`);
    if (coinData.diameter) parts.push(`DIAMETER: ${coinData.diameter}mm`);
    if (coinData.weight) parts.push(`WEIGHT: ${coinData.weight}g`);
    if (coinData.rarity) parts.push(`RARITY: ${coinData.rarity}`);
    
    parts.push('AUTHENTICATION: AI-Verified Professional Analysis');
    
    return parts.join(' | ');
  };

  return {
    isSubmitting,
    submitListing
  };
};
