
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useEnhancedCategories = () => {
  return useQuery({
    queryKey: ['enhanced-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
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
      
      // For now, we'll just update the image_url field directly
      // In a real implementation, you'd upload to Supabase Storage first
      const imageUrl = `https://via.placeholder.com/400x300?text=${fileName}`;
      
      // Update category with new image URL
      const { error: updateError } = await supabase
        .from('categories')
        .update({ image_url: imageUrl })
        .eq('id', categoryId);
      
      if (updateError) throw updateError;
      
      return { publicUrl: imageUrl, fileName };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-categories'] });
      toast({
        title: "Success",
        description: "Category image updated successfully"
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
      // Get categories and count coins for each
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*');
      
      if (categoriesError) throw categoriesError;
      
      // Create a mapping of category names to valid coin category values with proper typing
      const categoryMapping: { [key: string]: 'ancient' | 'modern' | 'error_coin' | 'greek' | 'american' | 'british' | 'european' | 'asian' | 'gold' | 'silver' | 'commemorative' | 'unclassified' } = {
        'Ancient Coins': 'ancient',
        'Modern Coins': 'modern',
        'Error Coins': 'error_coin',
        'Greek Coins': 'greek',
        'American Coins': 'american',
        'British Coins': 'british',
        'European Coins': 'european',
        'Asian Coins': 'asian',
        'Gold Coins': 'gold',
        'Silver Coins': 'silver',
        'Commemorative Coins': 'commemorative'
      };
      
      // Get coin counts for each category
      const categoriesWithStats = await Promise.all(
        (categories || []).map(async (category) => {
          // Map category name to valid coin category enum value
          const coinCategory = categoryMapping[category.name] || 'unclassified' as const;
          
          const { count } = await supabase
            .from('coins')
            .select('*', { count: 'exact', head: true })
            .eq('category', coinCategory);
          
          return {
            id: category.id,
            category_id: category.id,
            coins_count: count || 0,
            views_count: 0, // Placeholder since we don't have view tracking yet
            last_updated: new Date().toISOString(),
            categories: {
              name: category.name,
              icon: category.icon
            }
          };
        })
      );
      
      return categoriesWithStats;
    },
  });
};

export const useUpdateCategoryUsageStats = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // This is a placeholder - in a real implementation you'd call the database function
      console.log('Updating category usage statistics...');
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
