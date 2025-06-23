import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useCreateCoin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (coinData: {
      name: string;
      year: number;
      grade: string;
      price: number;
      rarity: string;
      image: string;
      country?: string;
      denomination?: string;
      description?: string;
      composition?: string;
      diameter?: number;
      weight?: number;
      mint?: string;
      store_id?: string;
      category?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Enhanced category mapping for error detection
      const coinName = coinData.name.toLowerCase();
      const errorPatterns = ['error', 'double', 'die', 'doubled'];
      const isErrorCoin = errorPatterns.some(pattern => coinName.includes(pattern)) || 
                         coinData.category === 'error_coin';

      // If no store_id provided, find user's default store
      let finalStoreId = coinData.store_id;
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

      const { data, error } = await supabase
        .from('coins')
        .insert([{ 
          ...coinData, 
          user_id: user.id,
          store_id: finalStoreId,
          authentication_status: 'verified',
          featured: isErrorCoin || (coinData.rarity && ['Rare', 'Very Rare', 'Ultra Rare'].includes(coinData.rarity)),
          category: isErrorCoin ? 'error_coin' as const : (coinData.category as any || 'modern' as const)
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coins'] });
      toast({
        title: "Coin Listed",
        description: "Your coin has been successfully submitted for verification.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'An error occurred',
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCoin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (coinId: string) => {
      const { error } = await supabase
        .from('coins')
        .delete()
        .eq('id', coinId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coins'] });
      toast({
        title: "Coin Deleted",
        description: "Your coin has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'An error occurred',
        variant: "destructive",
      });
    },
  });
};
