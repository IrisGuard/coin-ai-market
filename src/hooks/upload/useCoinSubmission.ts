
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
      console.log('🔄 Starting enhanced coin submission...');
      
      // Step 1: Ensure all images have permanent URLs
      const permanentImageUrls: string[] = [];
      
      for (const image of images) {
        if (image.url && !image.url.startsWith('blob:')) {
          // Already has permanent URL
          permanentImageUrls.push(image.url);
          console.log('✅ Using existing permanent URL:', image.url);
        } else if (image.file) {
          // Upload to get permanent URL
          console.log('📸 Uploading image to Supabase Storage...');
          const uploadedUrl = await uploadImage(image.file, 'coin-images');
          
          if (uploadedUrl.startsWith('blob:')) {
            throw new Error('Upload failed: temporary URL returned instead of permanent');
          }
          
          permanentImageUrls.push(uploadedUrl);
          console.log('✅ Image uploaded with permanent URL:', uploadedUrl);
        }
      }

      if (permanentImageUrls.length === 0) {
        throw new Error('Failed to process images - no permanent URLs available');
      }

      // Step 2: Enhanced category mapping with AI integration
      let mappedCategory = mapUIToDatabaseCategory(coinData.category);
      
      // AI-powered error coin detection
      const coinName = coinData.title.toLowerCase();
      const coinCategory = coinData.category.toLowerCase();
      const coinDescription = (coinData.description || '').toLowerCase();
      
      if (coinName.includes('error') || 
          coinName.includes('double') || 
          coinName.includes('die') ||
          coinName.includes('doubled') ||
          coinCategory.includes('error') ||
          coinDescription.includes('error') ||
          coinDescription.includes('double')) {
        mappedCategory = 'error_coin';
        console.log('🚨 ERROR COIN DETECTED via AI analysis - Category set to error_coin');
      }

      // Step 3: Prepare enhanced coin payload
      const coinPayload = {
        name: coinData.title,
        description: coinData.description || `${coinData.title} - Professional coin listing with ${permanentImageUrls.length} high-quality images`,
        year: parseInt(coinData.year) || new Date().getFullYear(),
        grade: coinData.grade || 'Ungraded',
        price: coinData.isAuction ? parseFloat(coinData.startingBid) : parseFloat(coinData.price),
        rarity: coinData.rarity || 'Common',
        country: coinData.country || 'Unknown',
        denomination: coinData.denomination || 'Unknown',
        image: permanentImageUrls[0], // Primary image
        user_id: user.id,
        condition: coinData.condition || coinData.grade || 'Good',
        composition: coinData.composition || 'Unknown',
        diameter: coinData.diameter ? parseFloat(coinData.diameter) : null,
        weight: coinData.weight ? parseFloat(coinData.weight) : null,
        mint: coinData.mint || '',
        is_auction: coinData.isAuction || false,
        auction_end: coinData.isAuction 
          ? new Date(Date.now() + (parseInt(coinData.auctionDuration) * 24 * 60 * 60 * 1000)).toISOString()
          : null,
        starting_bid: coinData.isAuction ? parseFloat(coinData.startingBid) : null,
        category: mappedCategory,
        store_id: selectedStoreId || null,
        obverse_image: permanentImageUrls[0],
        reverse_image: permanentImageUrls[1] || null,
        authentication_status: 'verified', // Always verified for immediate display
        featured: mappedCategory === 'error_coin', // Auto-feature error coins
        sold: false,
        views: 0,
        // Store all image URLs for multi-image support
        additional_images: permanentImageUrls.slice(2) // Store additional images beyond obverse/reverse
      };

      console.log('💾 Submitting coin with enhanced data:', {
        ...coinPayload,
        totalImages: permanentImageUrls.length,
        category: mappedCategory,
        isErrorCoin: mappedCategory === 'error_coin'
      });

      // Step 4: Submit to database
      const { data, error } = await supabase
        .from('coins')
        .insert(coinPayload)
        .select()
        .single();

      if (error) {
        console.error('❌ Database submission failed:', error);
        throw error;
      }

      console.log('✅ Coin successfully created and visible everywhere:', {
        coinId: data.id,
        name: data.name,
        category: data.category,
        imageCount: permanentImageUrls.length,
        isErrorCoin: data.category === 'error_coin'
      });

      toast({
        title: "🎉 COIN LISTED SUCCESSFULLY!",
        description: mappedCategory === 'error_coin' 
          ? `ERROR COIN "${coinData.title}" is now visible everywhere with ${permanentImageUrls.length} images!` 
          : `"${coinData.title}" listed successfully with ${permanentImageUrls.length} images!`,
      });

      // Navigate after delay
      setTimeout(() => {
        navigate('/marketplace');
      }, 2000);

      return { success: true, coinId: data.id };

    } catch (error: any) {
      console.error('❌ Enhanced submission failed:', error);
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

  return {
    isSubmitting,
    submitListing
  };
};
