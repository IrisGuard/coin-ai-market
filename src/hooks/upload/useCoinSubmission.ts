
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
        description: "Please capture at least one image of your coin.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🔄 Starting coin submission with image upload...');
      
      // Step 1: Upload all images to Supabase Storage and wait for permanent URLs
      const uploadedImageUrls: string[] = [];
      
      for (const image of images) {
        if (image.file) {
          console.log('📸 Uploading image to Supabase Storage...');
          // Wait for the actual upload to complete and get permanent URL
          const uploadedUrl = await uploadImage(image.file, 'coin-images');
          uploadedImageUrls.push(uploadedUrl);
          console.log('✅ Image uploaded successfully:', uploadedUrl);
        } else if (image.url && !image.url.startsWith('blob:')) {
          // Already uploaded image with permanent URL
          uploadedImageUrls.push(image.url);
        }
      }

      if (uploadedImageUrls.length === 0) {
        throw new Error('Failed to upload images to storage');
      }

      // Verify all URLs are permanent Supabase Storage URLs
      const allUrlsPermanent = uploadedImageUrls.every(url => 
        url.includes('supabase') && !url.startsWith('blob:')
      );
      
      if (!allUrlsPermanent) {
        throw new Error('Image upload incomplete - temporary URLs detected');
      }

      // Step 2: Map UI category to database enum
      const mappedCategory = mapUIToDatabaseCategory(coinData.category);
      console.log('🔄 Category mapping:', coinData.category, '->', mappedCategory);

      // Step 3: Prepare complete coin payload with proper typing
      const coinPayload = {
        name: coinData.title,
        description: coinData.description || `${coinData.title} - Professional coin listing with AI analysis`,
        year: parseInt(coinData.year) || new Date().getFullYear(),
        grade: coinData.grade || 'Ungraded',
        price: coinData.isAuction ? parseFloat(coinData.startingBid) : parseFloat(coinData.price),
        rarity: coinData.rarity || 'Common',
        country: coinData.country || 'Unknown',
        denomination: coinData.denomination || 'Unknown',
        image: uploadedImageUrls[0], // Primary image - permanent URL
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
        category: mappedCategory, // Use mapped category with correct type
        store_id: selectedStoreId || null,
        // Additional images - all permanent URLs
        obverse_image: uploadedImageUrls[0],
        reverse_image: uploadedImageUrls[1] || null,
        authentication_status: 'verified' as const, // Changed from 'pending' to 'verified' for immediate display
        featured: false,
        sold: false
      };

      console.log('💾 Submitting coin to database with permanent URLs:', coinPayload);

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

      console.log('✅ Coin successfully created:', data);

      // Step 5: Success handling - DON'T reset form automatically
      toast({
        title: "🎉 Success!",
        description: coinData.isAuction 
          ? "Auction started successfully! Your coin is now live in the marketplace." 
          : "Coin listed successfully! Your coin is now available for purchase.",
      });

      // Optional: Navigate after a delay to let user see success
      setTimeout(() => {
        navigate('/marketplace');
      }, 2000);

      return { success: true, coinId: data.id };

    } catch (error: any) {
      console.error('❌ Submission failed:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to create listing. Please check your data and try again.",
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
