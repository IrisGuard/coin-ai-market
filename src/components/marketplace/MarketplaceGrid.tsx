
import CoinCard from '@/components/CoinCard';
import { Coin } from '@/types/coin';

interface MarketplaceGridProps {
  filteredCoins: Coin[];
  searchTerm: string;
  isAuctionOnly: boolean;
  selectedRarity: string | null;
  clearFilters: () => void;
}

const MarketplaceGrid = ({
  filteredCoins,
  searchTerm,
  isAuctionOnly,
  selectedRarity,
  clearFilters,
}: MarketplaceGridProps) => {
  if (filteredCoins.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">No coins found matching your criteria.</p>
        <button 
          className="mt-4 text-coin-gold underline"
          onClick={clearFilters}
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredCoins.map((coin) => (
        <CoinCard key={coin.id} {...coin} />
      ))}
    </div>
  );
};

export default MarketplaceGrid;
