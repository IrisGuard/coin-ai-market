
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useEnhancedCategories = () => {
  return useQuery({
    queryKey: ['enhanced-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          category_usage_stats (
            coins_count,
            views_count,
            last_updated
          )
        `)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useCategoryImageUpload = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ categoryId, file }: { categoryId: string; file: File }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${categoryId}-${Date.now()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('category-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('category-images')
        .getPublicUrl(fileName);
      
      // Update category with new image URL
      const { error: updateError } = await supabase
        .from('categories')
        .update({ image_url: publicUrl })
        .eq('id', categoryId);
      
      if (updateError) throw updateError;
      
      return { publicUrl, fileName };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-categories'] });
      toast({
        title: "Success",
        description: "Category image uploaded successfully"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    },
  });
};

export const useCategoryUsageStats = () => {
  return useQuery({
    queryKey: ['category-usage-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('category_usage_stats')
        .select(`
          *,
          categories (
            name,
            icon
          )
        `)
        .order('coins_count', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useUpdateCategoryUsageStats = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('update_category_usage_stats');
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category-usage-stats'] });
      queryClient.invalidateQueries({ queryKey: ['enhanced-categories'] });
      toast({
        title: "Success",
        description: "Category usage statistics updated"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    },
  });
};
