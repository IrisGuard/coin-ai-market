
import { Search } from 'lucide-react';

interface MarketplaceSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const MarketplaceSearch = ({ searchTerm, setSearchTerm }: MarketplaceSearchProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search coins..."
        className="coin-input pl-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default MarketplaceSearch;
