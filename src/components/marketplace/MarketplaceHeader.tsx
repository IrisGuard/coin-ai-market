
import MarketplaceSearch from './MarketplaceSearch';

interface MarketplaceHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const MarketplaceHeader = ({ searchTerm, setSearchTerm }: MarketplaceHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-coin-blue">Coin Marketplace</h1>
        <p className="mt-2 text-gray-600">
          Browse and bid on collectible coins from around the world
        </p>
      </div>
      <div className="mt-4 md:mt-0">
        <MarketplaceSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
    </div>
  );
};

export default MarketplaceHeader;
