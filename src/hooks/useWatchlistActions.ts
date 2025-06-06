
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useWatchlistActions = () => {
  const { toast } = useToast();

  // Remove from watchlist
  const removeFromWatchlist = async (watchlistItemId: string) => {
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', watchlistItemId);

      if (error) throw error;

      toast({
        title: "Removed",
        description: "Item removed from watchlist"
      });

      return true;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from watchlist",
        variant: "destructive"
      });
      return false;
    }
  };

  // Update price alert
  const updatePriceAlert = async (watchlistItemId: string, enabled: boolean, targetPrice?: number) => {
    try {
      const { error } = await supabase
        .from('watchlist')
        .update({
          price_alert_enabled: enabled,
          target_price: targetPrice || null
        })
        .eq('id', watchlistItemId);

      if (error) throw error;

      toast({
        title: enabled ? "Alert Enabled" : "Alert Disabled",
        description: enabled 
          ? `You'll be notified when price ${targetPrice ? `reaches $${targetPrice}` : 'changes'}`
          : "Price alert has been disabled"
      });

      return true;
    } catch (error) {
      console.error('Error updating price alert:', error);
      toast({
        title: "Error",
        description: "Failed to update price alert",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    removeFromWatchlist,
    updatePriceAlert
  };
};
