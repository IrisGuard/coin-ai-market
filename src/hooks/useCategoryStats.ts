
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CategoryStats {
  [key: string]: number;
}

export const useCategoryStats = () => {
  const [stats, setStats] = useState<CategoryStats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch counts for different categories from the coins table
      const [
        ancientResult,
        modernResult,
        errorResult,
        auctionsResult,
        gradedResult,
        europeanResult,
        americanResult,
        asianResult,
        goldResult,
        silverResult,
        rareResult
      ] = await Promise.all([
        // Ancient coins (pre-1000)
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .lt('year', 1000)
          .eq('authentication_status', 'verified'),
        
        // Modern coins (1900+)
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .gte('year', 1900)
          .eq('authentication_status', 'verified'),
        
        // Error coins (category = 'error_coin' OR contains error/doubled in name/description)
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .or('category.eq.error_coin,name.ilike.%error%,name.ilike.%doubled%,description.ilike.%error%,description.ilike.%doubled%')
          .eq('authentication_status', 'verified'),
        
        // Live auctions
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .eq('is_auction', true)
          .eq('authentication_status', 'verified'),
        
        // Graded coins (have either PCGS or NGC grade)
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .or('pcgs_grade.neq.null,ngc_grade.neq.null')
          .eq('authentication_status', 'verified'),
        
        // European coins (expanded list)
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .in('country', [
            'Germany', 'France', 'Italy', 'Spain', 'United Kingdom', 'Netherlands', 
            'Austria', 'Switzerland', 'Belgium', 'Greece', 'Portugal', 'Roman Empire', 
            'Ancient Greece'
          ])
          .eq('authentication_status', 'verified'),
        
        // American coins
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .in('country', ['United States', 'Canada', 'Mexico'])
          .eq('authentication_status', 'verified'),
        
        // Asian coins (expanded list)
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .in('country', [
            'China', 'Japan', 'India', 'Korea', 'Thailand', 'Singapore',
            'Vietnam', 'Philippines', 'Malaysia', 'Indonesia'
          ])
          .eq('authentication_status', 'verified'),
        
        // Gold coins (composition OR name/description contains gold)
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .or('composition.ilike.%gold%,name.ilike.%gold%,description.ilike.%gold%')
          .eq('authentication_status', 'verified'),
        
        // Silver coins (composition OR name/description contains silver)
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .or('composition.ilike.%silver%,name.ilike.%silver%,description.ilike.%silver%')
          .eq('authentication_status', 'verified'),
        
        // Rare coins (rarity = 'rare' or 'extremely_rare' OR price > 1000)
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .or('rarity.eq.rare,rarity.eq.extremely_rare,price.gt.1000')
          .eq('authentication_status', 'verified')
      ]);

      // Get trending coins (featured coins or high view count)
      const trendingResult = await supabase
        .from('coins')
        .select('*', { count: 'exact', head: true })
        .or('featured.eq.true,views.gt.50')
        .eq('authentication_status', 'verified');

      setStats({
        ancient: ancientResult.count || 0,
        modern: modernResult.count || 0,
        error: errorResult.count || 0,
        auctions: auctionsResult.count || 0,
        graded: gradedResult.count || 0,
        trending: trendingResult.count || 0,
        european: europeanResult.count || 0,
        american: americanResult.count || 0,
        asian: asianResult.count || 0,
        gold: goldResult.count || 0,
        silver: silverResult.count || 0,
        rare: rareResult.count || 0
      });

    } catch (error: any) {
      console.error('Error fetching category stats:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryStats();
  }, []);

  return { stats, loading, error, refetch: fetchCategoryStats };
};
