import React from 'react';
import { Loader2, Store } from 'lucide-react';
import DealerStoreCard from './DealerStoreCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDealerStores } from '@/hooks/useDealerStores';

interface DealerStoresGridProps {
  searchTerm: string;
}

const DealerStoresGrid: React.FC<DealerStoresGridProps> = ({ searchTerm }) => {
  const { data: stores = [], isLoading } = useDealerStores();

  const { data: storeCounts = {} } = useQuery({
    queryKey: ['store-coin-counts'],
    queryFn: async () => {
      console.log('🔍 [DealerStoresGrid] Fetching coin counts for stores...');
      
      const { data: coins, error } = await supabase
        .from('coins')
        .select('id, store_id, user_id');

      if (error) {
        console.error('❌ [DealerStoresGrid] Error fetching coin counts:', error);
        return {};
      }
      
      // FIXED: Proper coin counting logic to prevent duplicates
      const counts: Record<string, number> = {};
      const countedCoins = new Set<string>(); // Track counted coin IDs to prevent duplicates
      
      coins?.forEach(coin => {
        // Skip if we've already counted this coin
        if (countedCoins.has(coin.id)) return;
        
        // Count by user_id (store owner) - this is the correct approach
        if (coin.user_id) {
          counts[coin.user_id] = (counts[coin.user_id] || 0) + 1;
          countedCoins.add(coin.id);
        }
      });
      
      console.log('📊 [DealerStoresGrid] Coin counts calculated:', counts);
      return counts;
    }
  });

  const filteredStores = stores.filter(store => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const profile = store.profiles;
    return (
      profile?.username?.toLowerCase().includes(searchLower) ||
      profile?.full_name?.toLowerCase().includes(searchLower) ||
      profile?.bio?.toLowerCase().includes(searchLower) ||
      profile?.location?.toLowerCase().includes(searchLower) ||
      store.name?.toLowerCase().includes(searchLower) ||
      store.description?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          <span className="text-brand-primary">Loading dealer stores...</span>
        </div>
      </div>
    );
  }

  if (filteredStores.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-brand-primary to-electric-purple rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-brand-primary mb-2">
            No dealer stores found
          </h2>
          <p className="text-brand-medium mb-6">
            {searchTerm 
              ? "Try adjusting your search criteria."
              : "No verified dealers are currently available."
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredStores.map((store) => {
        const profile = store.profiles;
        return (
          <DealerStoreCard
            key={store.id}
            id={profile?.id || store.user_id}
            avatar_url={profile?.avatar_url}
            username={profile?.username}
            full_name={profile?.full_name}
            bio={profile?.bio}
            rating={profile?.rating}
            location={profile?.location}
            verified_dealer={profile?.verified_dealer}
            totalCoins={storeCounts[store.user_id] || 0}
            storeName={store.name}
            storeDescription={store.description}
            created_at={store.created_at}
            storeAddress={store.address}
          />
        );
      })}
    </div>
  );
};

export default DealerStoresGrid;
