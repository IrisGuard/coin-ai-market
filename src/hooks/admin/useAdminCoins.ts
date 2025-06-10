
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CoinFilters {
  status?: string;
  category?: string;
  featured?: boolean;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  priceMin?: number;
  priceMax?: number;
}

export const useAdminCoins = (filters: CoinFilters = {}) => {
  return useQuery({
    queryKey: ['admin-coins', filters],
    queryFn: async () => {
      let query = supabase
        .from('coins')
        .select(`
          *,
          profiles!coins_user_id_fkey (
            id,
            name,
            email,
            verified_dealer
          )
        `);

      // Apply filters
      if (filters.status) {
        query = query.eq('authentication_status', filters.status);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }
      if (filters.priceMin) {
        query = query.gte('price', filters.priceMin);
      }
      if (filters.priceMax) {
        query = query.lte('price', filters.priceMax);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useUpdateCoinStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ coinId, status }: { coinId: string; status: string }) => {
      const { error } = await supabase
        .from('coins')
        .update({ authentication_status: status })
        .eq('id', coinId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coins'] });
      queryClient.invalidateQueries({ queryKey: ['admin-coin-analytics'] });
      toast({
        title: "Success",
        description: "Coin status updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useToggleCoinFeature = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ coinId, featured }: { coinId: string; featured: boolean }) => {
      const { error } = await supabase
        .from('coins')
        .update({ featured })
        .eq('id', coinId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coins'] });
      queryClient.invalidateQueries({ queryKey: ['admin-coin-analytics'] });
      toast({
        title: "Success",
        description: "Coin feature status updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
