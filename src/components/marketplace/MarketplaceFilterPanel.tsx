
import MarketplaceFilters from './MarketplaceFilters';
import MarketplaceSorting from './MarketplaceSorting';

interface MarketplaceFilterPanelProps {
  isAuctionOnly: boolean;
  setIsAuctionOnly: (value: boolean) => void;
  selectedRarity: string | null;
  setSelectedRarity: (value: string | null) => void;
  sortBy: 'price' | 'year';
  sortDirection: 'asc' | 'desc';
  handleSort: (field: 'price' | 'year') => void;
}

const MarketplaceFilterPanel = ({
  isAuctionOnly,
  setIsAuctionOnly,
  selectedRarity,
  setSelectedRarity,
  sortBy,
  sortDirection,
  handleSort,
}: MarketplaceFilterPanelProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <div className="flex flex-wrap items-center justify-between">
        <MarketplaceFilters
          isAuctionOnly={isAuctionOnly}
          setIsAuctionOnly={setIsAuctionOnly}
          selectedRarity={selectedRarity}
          setSelectedRarity={setSelectedRarity}
        />
        <MarketplaceSorting
          sortBy={sortBy}
          sortDirection={sortDirection}
          handleSort={handleSort}
        />
      </div>
    </div>
  );
};

export default MarketplaceFilterPanel;
