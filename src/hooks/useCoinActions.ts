
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usePlaceBid } from '@/hooks/useBids';

export const useCoinActions = (coin: any) => {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isBidding, setIsBidding] = useState(false);
  
  const placeBid = usePlaceBid();

  const toggleFavorite = async () => {
    if (!user || !coin) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add favorites",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('coin_id', coin.id);
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            coin_id: coin.id,
          });
      }
      
      setIsFavorited(!isFavorited);
      toast({
        title: isFavorited ? "Removed from Favorites" : "Added to Favorites",
        description: isFavorited ? "Coin removed from your favorites" : "Coin added to your favorites",
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    }
  };

  const handlePurchase = async () => {
    if (!user || !coin) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a purchase",
        variant: "destructive",
      });
      return;
    }

    setIsPurchasing(true);
    try {
      // Add purchase logic here
      toast({
        title: "Purchase Initiated",
        description: "Processing your purchase...",
      });
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleBid = async () => {
    if (!user || !coin || !bidAmount) {
      toast({
        title: "Invalid Bid",
        description: "Please enter a valid bid amount",
        variant: "destructive",
      });
      return;
    }

    setIsBidding(true);
    try {
      await placeBid.mutateAsync({ 
        coinId: coin.id, 
        amount: parseFloat(bidAmount) 
      });
      setBidAmount('');
    } catch (error) {
      console.error('Bid error:', error);
    } finally {
      setIsBidding(false);
    }
  };

  return {
    isFavorited,
    setIsFavorited,
    bidAmount,
    setBidAmount,
    isPurchasing,
    isBidding,
    toggleFavorite,
    handlePurchase,
    handleBid
  };
};
