
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Store {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: any;
  is_active: boolean;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export const useUserStore = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-store', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    },
    enabled: !!user,
  });
};

export const useCreateStore = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (storeData: Omit<Store, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'is_active' | 'verified'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('stores')
        .insert([{
          ...storeData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-store'] });
      toast({
        title: "Store Created",
        description: "Your store has been successfully created!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || 'Failed to create store',
        variant: "destructive",
      });
    },
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Store> & { id: string }) => {
      const { data, error } = await supabase
        .from('stores')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-store'] });
      toast({
        title: "Store Updated",
        description: "Your store has been successfully updated!",
      });
    },
  });
};

export const useAllStores = () => {
  return useQuery({
    queryKey: ['all-stores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
