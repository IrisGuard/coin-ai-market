
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
        // Ancient coins (pre-1800)
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .lte('year', 1800)
          .eq('authentication_status', 'verified'),
        
        // Modern coins (post-1800)
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .gt('year', 1800)
          .eq('authentication_status', 'verified'),
        
        // Error coins (category = 'error')
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .eq('category', 'error')
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
        
        // European coins
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .in('country', ['Germany', 'France', 'Italy', 'Spain', 'United Kingdom', 'Netherlands', 'Austria', 'Switzerland', 'Belgium', 'Greece'])
          .eq('authentication_status', 'verified'),
        
        // American coins
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .in('country', ['United States', 'Canada', 'Mexico'])
          .eq('authentication_status', 'verified'),
        
        // Asian coins
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .in('country', ['China', 'Japan', 'India', 'Korea', 'Thailand', 'Singapore'])
          .eq('authentication_status', 'verified'),
        
        // Gold coins (composition contains gold)
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .ilike('composition', '%gold%')
          .eq('authentication_status', 'verified'),
        
        // Silver coins (composition contains silver)
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .ilike('composition', '%silver%')
          .eq('authentication_status', 'verified'),
        
        // Rare coins (rarity = 'rare' or 'extremely_rare')
        supabase
          .from('coins')
          .select('*', { count: 'exact', head: true })
          .in('rarity', ['rare', 'extremely_rare'])
          .eq('authentication_status', 'verified')
      ]);

      // Get trending coins (featured coins or high view count)
      const trendingResult = await supabase
        .from('coins')
        .select('*', { count: 'exact', head: true })
        .or('featured.eq.true,views.gt.100')
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
