
import React from 'react';
import { Loader2, Store } from 'lucide-react';
import DealerStoreCard from './DealerStoreCard';

interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  rating?: number;
  location?: string;
  verified_dealer?: boolean;
}

interface DealerStoresGridProps {
  stores: Profile[];
  isLoading: boolean;
  searchTerm: string;
}

const DealerStoresGrid: React.FC<DealerStoresGridProps> = ({
  stores,
  isLoading,
  searchTerm
}) => {
  // Filter stores based on search term
  const filteredStores = stores.filter(store => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      store.username?.toLowerCase().includes(searchLower) ||
      store.full_name?.toLowerCase().includes(searchLower) ||
      store.bio?.toLowerCase().includes(searchLower) ||
      store.location?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-electric-orange" />
          <span className="text-electric-blue">Loading dealer stores...</span>
        </div>
      </div>
    );
  }

  if (filteredStores.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-electric-blue to-electric-purple rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-electric-blue mb-2">
            No dealer stores found
          </h2>
          <p className="text-gray-600 mb-6">
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
          id={store.id}
          avatar_url={store.avatar_url}
          username={store.username}
          full_name={store.full_name}
          bio={store.bio}
          rating={store.rating}
          location={store.location}
          verified_dealer={store.verified_dealer}
          totalCoins={Math.floor(Math.random() * 500) + 50} // Mock data for now
        />
      ))}
    </div>
  );
};

export default DealerStoresGrid;
