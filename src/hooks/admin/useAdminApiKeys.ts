
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useApiKeys = () => {
  return useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useApiKeyCategories = () => {
  return useQuery({
    queryKey: ['api-key-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_key_categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (keyData: {
      key_name: string;
      encrypted_value: string;
      description?: string;
      category_id?: string | null;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('api_keys')
        .insert([{ 
          ...keyData,
          created_by: user?.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast({
        title: "API Key Created",
        description: "API key has been created successfully.",
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      });
    },
  });
};

export const useBulkCreateApiKeys = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (keysData: Array<{
      name: string;
      value: string;
      description?: string;
      category_id?: string | null;
    }>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const formattedKeys = keysData.map(key => ({
        key_name: key.name,
        encrypted_value: key.value,
        description: key.description,
        created_by: user?.id
      }));
      
      const { data, error } = await supabase
        .from('api_keys')
        .insert(formattedKeys)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast({
        title: "API Keys Imported",
        description: "API keys have been imported successfully.",
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
      });
    },
  });
};
