import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const usePlaceBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ coinId, amount }: { coinId: string; amount: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bids')
        .insert([{
          coin_id: coinId,
          user_id: user.id,
          amount: amount
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['coin', variables.coinId] });
      queryClient.invalidateQueries({ queryKey: ['coins'] });
      toast({
        title: "Bid Placed",
        description: "Your bid has been successfully placed.",
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      });
    },
  });
};

export const useCoinBids = (coinId: string) => {
  return useQuery({
    queryKey: ['bids', coinId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          profiles:user_id (
            name,
            avatar_url
          )
        `)
        .eq('coin_id', coinId)
        .order('amount', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!coinId,
  });
};
