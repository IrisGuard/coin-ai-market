
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
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('coins')
        .insert([{ 
          ...coinData, 
          user_id: user.id,
          authentication_status: 'pending'
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
