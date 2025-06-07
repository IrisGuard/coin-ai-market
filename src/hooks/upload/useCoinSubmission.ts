
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import type { CoinData, UploadedImage } from '@/types/upload';

export const useCoinSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const submitListing = useCallback(async (coinData: CoinData, images: UploadedImage[]) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a listing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
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
          : null
      };

      const { error } = await supabase
        .from('coins')
        .insert([coinPayload]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: coinData.isAuction ? "Auction started successfully!" : "Coin listed successfully!",
      });

      navigate('/marketplace');
    } catch (error) {
      console.error('Submission failed:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [user, navigate]);

  return {
    isSubmitting,
    submitListing
  };
};
