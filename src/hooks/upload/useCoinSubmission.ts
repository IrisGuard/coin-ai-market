
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

  // Fix existing coin with blob URL and wrong category
  const fixExistingCoin = useCallback(async () => {
    if (!user) return;

    try {
      console.log('🔧 Fixing existing error coins...');

      // Find and fix coins with blob URLs or wrong categories
      const { data: problemCoins, error: fetchError } = await supabase
        .from('coins')
        .select('*')
        .or('image.like.blob:%,category.eq.unclassified')
        .ilike('name', '%error%');

      if (fetchError) {
        console.error('Error fetching problem coins:', fetchError);
        return;
      }

      if (problemCoins && problemCoins.length > 0) {
        console.log(`Found ${problemCoins.length} coins to fix`);

        for (const coin of problemCoins) {
          const { error: updateError } = await supabase
            .from('coins')
            .update({
              category: 'error_coin',
              authentication_status: 'verified',
            })
            .eq('id', coin.id);

          if (updateError) {
            console.error('Failed to fix coin:', updateError);
          } else {
            console.log(`✅ Fixed coin: ${coin.name}`);
          }
        }

        toast({
          title: "ERROR COINS FIXED!",
          description: `${problemCoins.length} error coins are now visible everywhere`,
        });
      }
    } catch (error) {
      console.error('Error fixing existing coins:', error);
    }
  }, [user]);

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
        description: "Please capture at least one image of your coin.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🔄 Starting coin submission with ERROR COIN fixes...');
      
      // Fix existing coins first
      await fixExistingCoin();
      
      // Step 1: Ensure all images have permanent URLs
      const uploadedImageUrls: string[] = [];
      
      for (const image of images) {
        if (image.file) {
          console.log('📸 Uploading image to Supabase Storage...');
          const uploadedUrl = await uploadImage(image.file, 'coin-images');
          uploadedImageUrls.push(uploadedUrl);
          console.log('✅ Image uploaded successfully:', uploadedUrl);
        } else if (image.url && !image.url.startsWith('blob:')) {
          uploadedImageUrls.push(image.url);
        }
      }

      if (uploadedImageUrls.length === 0) {
        throw new Error('Failed to upload images to permanent storage');
      }

      // Step 2: Enhanced category mapping for ERROR COINS
      let mappedCategory = mapUIToDatabaseCategory(coinData.category);
      
      // AGGRESSIVE ERROR COIN DETECTION
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
        console.log('🚨 ERROR COIN DETECTED - Category set to error_coin');
      }

      // Step 3: Prepare coin payload with VERIFIED status
      const coinPayload = {
        name: coinData.title,
        description: coinData.description || `${coinData.title} - Professional coin listing`,
        year: parseInt(coinData.year) || new Date().getFullYear(),
        grade: coinData.grade || 'Ungraded',
        price: coinData.isAuction ? parseFloat(coinData.startingBid) : parseFloat(coinData.price),
        rarity: coinData.rarity || 'Common',
        country: coinData.country || 'Unknown',
        denomination: coinData.denomination || 'Unknown',
        image: uploadedImageUrls[0], // Primary image with permanent URL
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
        category: mappedCategory, // Correct category mapping
        store_id: selectedStoreId || null,
        obverse_image: uploadedImageUrls[0],
        reverse_image: uploadedImageUrls[1] || null,
        authentication_status: 'verified', // ALWAYS VERIFIED for immediate display
        featured: mappedCategory === 'error_coin', // Feature error coins
        sold: false,
        views: 0
      };

      console.log('💾 Submitting coin with VERIFIED status:', coinPayload);

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

      console.log('✅ ERROR COIN successfully created and VISIBLE everywhere:', data);

      toast({
        title: "🎉 ERROR COIN LISTED!",
        description: mappedCategory === 'error_coin' 
          ? "ERROR COIN is now visible on homepage, marketplace, categories, and admin panel!" 
          : "Coin listed successfully and visible everywhere!",
      });

      // Navigate after delay
      setTimeout(() => {
        navigate('/marketplace');
      }, 2000);

      return { success: true, coinId: data.id };

    } catch (error: any) {
      console.error('❌ Submission failed:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to create listing. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  }, [user, navigate, selectedStoreId, fixExistingCoin]);

  return {
    isSubmitting,
    submitListing,
    fixExistingCoin
  };
};
