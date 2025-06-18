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
      console.log('🔧 Fixing existing coin with blob URL...');

      // Find coin with blob: image URL and wrong category
      const { data: problemCoin, error: fetchError } = await supabase
        .from('coins')
        .select('*')
        .or('image.like.blob:%,category.eq.unclassified')
        .limit(1)
        .single();

      if (fetchError || !problemCoin) {
        console.log('No problem coin found to fix');
        return;
      }

      console.log('Found problem coin:', problemCoin.name);

      // Update the problematic coin
      const { error: updateError } = await supabase
        .from('coins')
        .update({
          category: 'error_coin', // Fix category
          authentication_status: 'verified', // Make it visible
          // Keep existing image URL for now - user can re-upload if needed
        })
        .eq('id', problemCoin.id);

      if (updateError) {
        console.error('Failed to fix existing coin:', updateError);
      } else {
        console.log('✅ Fixed existing coin successfully');
        toast({
          title: "Existing Coin Fixed!",
          description: "Your ERROR COIN is now visible in marketplace and categories",
        });
      }
    } catch (error) {
      console.error('Error fixing existing coin:', error);
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
      console.log('🔄 Starting coin submission with proper fixes...');
      
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
        throw new Error('Failed to upload images to storage');
      }

      // Step 2: Enhanced category mapping for error coins
      let mappedCategory = mapUIToDatabaseCategory(coinData.category);
      
      // Special handling for error coins
      if (coinData.category.toLowerCase().includes('double') || 
          coinData.category.toLowerCase().includes('die') ||
          coinData.category.toLowerCase().includes('error')) {
        mappedCategory = 'error_coin';
      }
      
      console.log('🔄 Category mapping:', coinData.category, '->', mappedCategory);

      // Step 3: Prepare coin payload with fixed settings
      const coinPayload = {
        name: coinData.title,
        description: coinData.description || `${coinData.title} - Professional coin listing with AI analysis`,
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
        category: mappedCategory, // Fixed category mapping
        store_id: selectedStoreId || null,
        obverse_image: uploadedImageUrls[0],
        reverse_image: uploadedImageUrls[1] || null,
        authentication_status: 'verified', // ALWAYS verified for immediate display
        featured: false,
        sold: false
      };

      console.log('💾 Submitting coin with verified status and proper category:', coinPayload);

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

      console.log('✅ Coin successfully created and visible:', data);

      toast({
        title: "🎉 Success!",
        description: coinData.isAuction 
          ? "ERROR COIN auction started! Now visible in marketplace and categories." 
          : "ERROR COIN listed successfully! Now visible everywhere.",
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
