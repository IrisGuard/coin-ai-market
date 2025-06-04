
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Coin } from '@/types/coin';
import { toast } from '@/hooks/use-toast';

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
          console.error('Error fetching coins:', error);
          return [];
        }
        
        // Return real data from database, no mock data
        return data as Coin[] || [];
      } catch (error) {
        console.error('Connection error:', error);
        return [];
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
          console.error('Error fetching coin:', error);
          return null;
        }
        
        return data as Coin;
      } catch (error) {
        console.error('Connection error:', error);
        return null;
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

// Enhanced AI coin recognition hook - ready for real API integration
export const useAICoinRecognition = () => {
  return useMutation({
    mutationFn: async (imageData: { image: string; additionalImages?: string[] }) => {
      // This will be connected to real AI recognition API
      const { data, error } = await supabase.functions.invoke('ai-coin-recognition', {
        body: imageData
      });

      if (error) throw error;
      return data;
    },
    onError: (error: any) => {
      toast({
        title: "Recognition Failed",
        description: error.message || "Unable to analyze the coin image. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Hook for PCGS API integration
export const usePCGSData = () => {
  return useMutation({
    mutationFn: async (pcgsNumber: string) => {
      const { data, error } = await supabase.functions.invoke('pcgs-integration', {
        body: { pcgs_number: pcgsNumber }
      });

      if (error) throw error;
      return data;
    },
    onError: (error: any) => {
      console.error('PCGS API Error:', error);
    },
  });
};

// Hook for NGC API integration
export const useNGCData = () => {
  return useMutation({
    mutationFn: async (ngcNumber: string) => {
      const { data, error } = await supabase.functions.invoke('ngc-integration', {
        body: { ngc_number: ngcNumber }
      });

      if (error) throw error;
      return data;
    },
    onError: (error: any) => {
      console.error('NGC API Error:', error);
    },
  });
};
