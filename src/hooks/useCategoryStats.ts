
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CategoryStats {
  // Regional categories
  us: number;
  world: number;
  ancient: number;
  modern: number;
  american: number;
  european: number;
  asian: number;
  african: number;
  australian: number;
  south_american: number;
  
  // Metal-based categories
  gold: number;
  silver: number;
  platinum: number;
  
  // Type-based categories
  paper: number;
  graded: number;
  commemorative: number;
  proof: number;
  uncirculated: number;
  tokens: number;
  bullion: number;
  
  // Error categories
  error: number;
  double_die: number;
  off_center: number;
  clipped: number;
  broadstrike: number;
  die_crack: number;
  lamination: number;
  wrong_planchet: number;
  rotated_die: number;
  cud_error: number;
  
  // Legacy categories (for backward compatibility)
  trending: number;
  rare: number;
  auctions: number;
}

export const useCategoryStats = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['category-stats'],
    queryFn: async () => {
      // Get counts for each category from the coins table
      const { data: coinCounts, error: countError } = await supabase
        .from('coins')
        .select('category, tags, name, description, rarity');
      
      if (countError) throw countError;

      // Initialize all categories with 0
      const categoryCounts: CategoryStats = {
        us: 0,
        world: 0,
        ancient: 0,
        modern: 0,
        american: 0,
        european: 0,
        asian: 0,
        african: 0,
        australian: 0,
        south_american: 0,
        gold: 0,
        silver: 0,
        platinum: 0,
        paper: 0,
        graded: 0,
        commemorative: 0,
        proof: 0,
        uncirculated: 0,
        tokens: 0,
        bullion: 0,
        error: 0,
        double_die: 0,
        off_center: 0,
        clipped: 0,
        broadstrike: 0,
        die_crack: 0,
        lamination: 0,
        wrong_planchet: 0,
        rotated_die: 0,
        cud_error: 0,
        trending: 0,
        rare: 0,
        auctions: 0
      };

      // Count coins by category and tags
      coinCounts?.forEach(coin => {
        const category = coin.category || 'unclassified';
        const tags = coin.tags || [];
        const name = coin.name?.toLowerCase() || '';
        const description = coin.description?.toLowerCase() || '';
        const rarity = coin.rarity?.toLowerCase() || '';
        
        // Map existing categories to our stats
        switch (category) {
          case 'ancient':
            categoryCounts.ancient++;
            break;
          case 'modern':
            categoryCounts.modern++;
            break;
          case 'error_coin':
            categoryCounts.error++;
            break;
          case 'american':
            categoryCounts.american++;
            break;
          case 'european':
            categoryCounts.european++;
            break;
          case 'asian':
            categoryCounts.asian++;
            break;
          case 'gold':
            categoryCounts.gold++;
            break;
          case 'silver':
            categoryCounts.silver++;
            break;
          case 'commemorative':
            categoryCounts.commemorative++;
            break;
        }

        // Check tags for additional categorization
        tags.forEach((tag: string) => {
          const tagLower = tag.toLowerCase();
          
          if (tagLower.includes('us') || tagLower.includes('united states') || tagLower.includes('usa')) {
            categoryCounts.us++;
          }
          if (tagLower.includes('world') || tagLower.includes('international') || tagLower.includes('foreign')) {
            categoryCounts.world++;
          }
          if (tagLower.includes('platinum')) {
            categoryCounts.platinum++;
          }
          if (tagLower.includes('paper') || tagLower.includes('banknote') || tagLower.includes('currency note')) {
            categoryCounts.paper++;
          }
          if (tagLower.includes('graded') || tagLower.includes('pcgs') || tagLower.includes('ngc')) {
            categoryCounts.graded++;
          }
          if (tagLower.includes('commemorative') || tagLower.includes('special edition')) {
            categoryCounts.commemorative++;
          }
          if (tagLower.includes('proof')) {
            categoryCounts.proof++;
          }
          if (tagLower.includes('uncirculated') || tagLower.includes('unc') || tagLower.includes('mint state')) {
            categoryCounts.uncirculated++;
          }
          if (tagLower.includes('token') || tagLower.includes('medal') || tagLower.includes('medallion')) {
            categoryCounts.tokens++;
          }
          if (tagLower.includes('bullion') || tagLower.includes('bar') || tagLower.includes('ingot')) {
            categoryCounts.bullion++;
          }
          if (tagLower.includes('african') || tagLower.includes('africa')) {
            categoryCounts.african++;
          }
          if (tagLower.includes('australian') || tagLower.includes('oceania') || tagLower.includes('australia')) {
            categoryCounts.australian++;
          }
          if (tagLower.includes('south american') || tagLower.includes('latin american')) {
            categoryCounts.south_american++;
          }
          if (tagLower.includes('error') || tagLower.includes('mistake') || tagLower.includes('misprint')) {
            categoryCounts.error++;
          }
          if (tagLower.includes('double die') || tagLower.includes('doubled die')) {
            categoryCounts.double_die++;
          }
          if (tagLower.includes('off-center') || tagLower.includes('off center') || tagLower.includes('misaligned')) {
            categoryCounts.off_center++;
          }
          if (tagLower.includes('clipped') || tagLower.includes('clip')) {
            categoryCounts.clipped++;
          }
          if (tagLower.includes('broadstrike') || tagLower.includes('broad strike')) {
            categoryCounts.broadstrike++;
          }
          if (tagLower.includes('die crack') || tagLower.includes('cracked die')) {
            categoryCounts.die_crack++;
          }
          if (tagLower.includes('lamination') || tagLower.includes('peeling')) {
            categoryCounts.lamination++;
          }
          if (tagLower.includes('wrong planchet') || tagLower.includes('planchet error')) {
            categoryCounts.wrong_planchet++;
          }
          if (tagLower.includes('rotated die') || tagLower.includes('rotation error')) {
            categoryCounts.rotated_die++;
          }
          if (tagLower.includes('cud error') || tagLower.includes('cud')) {
            categoryCounts.cud_error++;
          }
          if (tagLower.includes('trending') || tagLower.includes('popular') || tagLower.includes('hot')) {
            categoryCounts.trending++;
          }
        });

        // Check name and description for additional clues
        const fullText = `${name} ${description}`;
        
        if (rarity.includes('rare') || fullText.includes('rare') || fullText.includes('scarce')) {
          categoryCounts.rare++;
        }
        
        if (fullText.includes('ancient') || fullText.includes('roman') || fullText.includes('greek')) {
          categoryCounts.ancient++;
        }
        
        if (fullText.includes('modern') || fullText.includes('contemporary')) {
          categoryCounts.modern++;
        }
      });

      // Get auction count
      const { count: auctionCount, error: auctionError } = await supabase
        .from('coins')
        .select('*', { count: 'exact', head: true })
        .eq('is_auction', true)
        .gt('auction_end', new Date().toISOString());
      
      if (auctionError) throw auctionError;

      categoryCounts.auctions = auctionCount || 0;

      return categoryCounts;
    }
  });

  return { 
    stats: stats || {
      us: 0,
      world: 0,
      ancient: 0,
      modern: 0,
      american: 0,
      european: 0,
      asian: 0,
      african: 0,
      australian: 0,
      south_american: 0,
      gold: 0,
      silver: 0,
      platinum: 0,
      paper: 0,
      graded: 0,
      commemorative: 0,
      proof: 0,
      uncirculated: 0,
      tokens: 0,
      bullion: 0,
      error: 0,
      double_die: 0,
      off_center: 0,
      clipped: 0,
      broadstrike: 0,
      die_crack: 0,
      lamination: 0,
      wrong_planchet: 0,
      rotated_die: 0,
      cud_error: 0,
      trending: 0,
      rare: 0,
      auctions: 0
    } as CategoryStats, 
    loading: isLoading, 
    error: error?.message || null 
  };
};
