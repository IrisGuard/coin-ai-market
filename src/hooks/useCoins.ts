import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Coin } from '@/types/coin';
import { toast } from '@/hooks/use-toast';
import { sampleCoins, getCoinById } from '@/data/sampleCoins';

export const useCoins = () => {
  return useQuery({
    queryKey: ['coins'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('coins')
          .select(`
            *,
            profiles:user_id (
              name,
              reputation,
              verified_dealer
            ),
            bids (
              amount,
              user_id,
              created_at,
              profiles:user_id (name)
            )
          `)
          .eq('authentication_status', 'verified')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Supabase error, using sample data:', error);
          return sampleCoins;
        }
        
        // If no data from Supabase, return sample data
        return data && data.length > 0 ? data as Coin[] : sampleCoins;
      } catch (error) {
        console.warn('Connection error, using sample data:', error);
        return sampleCoins;
      }
    },
  });
};

export const useCoin = (id: string) => {
  return useQuery({
    queryKey: ['coin', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('coins')
          .select(`
            *,
            profiles:user_id (
              name,
              reputation,
              verified_dealer,
              avatar_url
            ),
            bids (
              id,
              amount,
              user_id,
              created_at,
              profiles:user_id (name)
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.warn('Supabase error, using sample data:', error);
          return getCoinById(id);
        }
        
        return data as Coin;
      } catch (error) {
        console.warn('Connection error, using sample data:', error);
        return getCoinById(id);
      }
    },
    enabled: !!id,
  });
};

export const useCreateCoin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (coinData: Partial<Coin>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('coins')
        .insert([{ ...coinData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coins'] });
      toast({
        title: "Coin Listed",
        description: "Your coin has been successfully listed for review.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
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
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
