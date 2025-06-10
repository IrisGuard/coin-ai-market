
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// API Keys Hook
export const useApiKeys = () => {
  return useQuery({
    queryKey: ['admin-api-keys'],
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

// API Key Categories Hook
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

// Create API Key Mutation
export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (keyData: { 
      key_name: string; 
      encrypted_value: string; 
      description?: string; 
      category_id?: string 
    }) => {
      const { error } = await supabase
        .from('api_keys')
        .insert([keyData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-api-keys'] });
      toast({
        title: "Success",
        description: "API key created successfully.",
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

// Bulk Create API Keys Mutation
export const useBulkCreateApiKeys = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (keysData: Array<{ 
      key_name: string; 
      encrypted_value: string; 
      description?: string; 
      category_id?: string 
    }>) => {
      const { error } = await supabase
        .from('api_keys')
        .insert(keysData);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-api-keys'] });
      toast({
        title: "Success",
        description: "API keys imported successfully.",
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
