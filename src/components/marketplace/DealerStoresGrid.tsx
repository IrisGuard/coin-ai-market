
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
      const { data, error } = await supabase
        .from('coins')
        .select('user_id')
        .eq('authentication_status', 'verified');
      
      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data?.forEach(coin => {
        counts[coin.user_id] = (counts[coin.user_id] || 0) + 1;
      });
      
      return counts;
    }
  });

  const filteredStores = stores.filter(store => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      store.profiles?.username?.toLowerCase().includes(searchLower) ||
      store.profiles?.full_name?.toLowerCase().includes(searchLower) ||
      store.profiles?.bio?.toLowerCase().includes(searchLower) ||
      store.profiles?.location?.toLowerCase().includes(searchLower) ||
      store.name?.toLowerCase().includes(searchLower) ||
      store.description?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-primary">Loading dealer stores...</span>
        </div>
      </div>
    );
  }

  if (filteredStores.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-primary mb-2">
            No dealer stores found
          </h2>
          <p className="text-muted-foreground mb-6">
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
      {filteredStores.map((store) => (
        <DealerStoreCard
          key={store.id}
          id={store.profiles?.id || store.user_id}
          avatar_url={store.profiles?.avatar_url}
          username={store.profiles?.username}
          full_name={store.profiles?.full_name}
          bio={store.profiles?.bio}
          rating={store.profiles?.rating}
          location={store.profiles?.location}
          verified_dealer={store.profiles?.verified_dealer}
          totalCoins={storeCounts[store.user_id] || 0}
          storeName={store.name}
          storeDescription={store.description}
        />
      ))}
    </div>
  );
};

export default DealerStoresGrid;
