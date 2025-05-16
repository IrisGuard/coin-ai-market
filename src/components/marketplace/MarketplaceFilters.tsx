
import { Filter } from 'lucide-react';
import { Rarity } from '@/types/coin';

interface MarketplaceFiltersProps {
  isAuctionOnly: boolean;
  setIsAuctionOnly: (value: boolean) => void;
  selectedRarity: string | null;
  setSelectedRarity: (value: string | null) => void;
}

const MarketplaceFilters = ({
  isAuctionOnly,
  setIsAuctionOnly,
  selectedRarity,
  setSelectedRarity,
}: MarketplaceFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center">
        <Filter size={18} className="text-gray-500 mr-2" />
        <span className="text-gray-700 font-medium">Filters:</span>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="auctionOnly"
          className="mr-2"
          checked={isAuctionOnly}
          onChange={() => setIsAuctionOnly(!isAuctionOnly)}
        />
        <label htmlFor="auctionOnly" className="text-gray-600">Auctions only</label>
      </div>
      
      <div className="flex items-center space-x-2">
        <label className="text-gray-600">Rarity:</label>
        <select
          className="border border-gray-300 rounded-md p-1 text-sm"
          value={selectedRarity || ''}
          onChange={(e) => setSelectedRarity(e.target.value || null)}
        >
          <option value="">All</option>
          <option value="Common">Common</option>
          <option value="Uncommon">Uncommon</option>
          <option value="Rare">Rare</option>
          <option value="Ultra Rare">Ultra Rare</option>
        </select>
      </div>
    </div>
  );
};

export default MarketplaceFilters;
