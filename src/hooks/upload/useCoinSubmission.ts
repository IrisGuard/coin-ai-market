
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStore } from '@/contexts/AdminStoreContext';
import { toast } from '@/hooks/use-toast';
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
      // Prepare complete coin payload with all fields
      const coinPayload = {
        name: coinData.title,
        description: coinData.description,
        year: parseInt(coinData.year) || new Date().getFullYear(),
        grade: coinData.grade,
        price: coinData.isAuction ? parseFloat(coinData.startingBid) : parseFloat(coinData.price),
        rarity: coinData.rarity,
        country: coinData.country,
        denomination: coinData.denomination,
        image: images[0]?.url || images[0]?.preview || '',
        user_id: user.id,
        condition: coinData.condition,
        composition: coinData.composition,
        diameter: coinData.diameter ? parseFloat(coinData.diameter) : null,
        weight: coinData.weight ? parseFloat(coinData.weight) : null,
        mint: coinData.mint,
        is_auction: coinData.isAuction,
        auction_end_date: coinData.isAuction 
          ? new Date(Date.now() + (parseInt(coinData.auctionDuration) * 24 * 60 * 60 * 1000)).toISOString()
          : null,
        starting_bid: coinData.isAuction ? parseFloat(coinData.startingBid) : null,
        // New fields from enhanced auto-fill
        category: coinData.category as any, // Cast to enum type
        store_id: selectedStoreId || null,
        // Additional images if available
        obverse_image: images[0]?.url || images[0]?.preview || '',
        reverse_image: images[1]?.url || images[1]?.preview || null,
        // Authentication status for live platform
        authentication_status: 'pending',
        // AI analysis metadata
        ai_confidence: 0.85, // Will be replaced with actual AI confidence
        ai_provider: 'claude-enhanced'
      };

      console.log('Submitting coin with complete data to database:', coinPayload);

      const { data, error } = await supabase
        .from('coins')
        .insert([coinPayload])
        .select()
        .single();

      if (error) {
        console.error('Database submission failed:', error);
        throw error;
      }

      console.log('Coin successfully created in database:', data);

      toast({
        title: "Success!",
        description: coinData.isAuction 
          ? "Auction started successfully! Your coin is now live in the marketplace." 
          : "Coin listed successfully! Your coin is now available for purchase.",
      });

      // Navigate to marketplace to see the listing
      navigate('/marketplace');
    } catch (error: any) {
      console.error('Submission failed:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to create listing. Please check your data and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [user, navigate, selectedStoreId]);

  return {
    isSubmitting,
    submitListing
  };
};
