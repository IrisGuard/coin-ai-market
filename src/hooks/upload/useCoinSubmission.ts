
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { CoinData, UploadedImage } from '@/types/upload';

export const useCoinSubmission = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitListing = useCallback(async (
    coinData: CoinData, 
    images: UploadedImage[],
    onSuccess?: () => void
  ) => {
    if (!user) {
      toast.error('Please log in to create a listing');
      return;
    }

    if (!coinData.title || images.length === 0) {
      toast.error('Please fill in all required fields and upload images');
      return;
    }

    setIsSubmitting(true);
    try {
      const uploadedImageUrls = images
        .filter(img => img.uploaded && img.url)
        .map(img => img.url);

      const coinDataToInsert = {
        name: coinData.title,
        description: coinData.description,
        // Convert string prices to numbers for database
        price: coinData.isAuction ? parseFloat(coinData.startingBid) || 0 : parseFloat(coinData.price) || 0,
        starting_bid: coinData.isAuction ? parseFloat(coinData.startingBid) || null : null,
        is_auction: coinData.isAuction,
        condition: coinData.condition,
        year: parseInt(coinData.year) || 2024,
        country: coinData.country,
        denomination: coinData.denomination,
        grade: coinData.grade,
        rarity: coinData.rarity,
        image: uploadedImageUrls[0] || '',
        user_id: user.id,
        seller_id: user.id
      };

      const { data, error } = await supabase
        .from('coins')
        .insert([coinDataToInsert])
        .select()
        .single();

      if (error) throw error;

      toast.success('Coin listing created successfully!');
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  }, [user]);

  return {
    isSubmitting,
    submitListing
  };
};
