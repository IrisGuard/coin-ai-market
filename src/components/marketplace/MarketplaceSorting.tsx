
import { ArrowDown, ArrowUp } from 'lucide-react';

interface MarketplaceSortingProps {
  sortBy: 'price' | 'year';
  sortDirection: 'asc' | 'desc';
  handleSort: (field: 'price' | 'year') => void;
}

const MarketplaceSorting = ({
  sortBy,
  sortDirection,
  handleSort,
}: MarketplaceSortingProps) => {
  return (
    <div className="ml-auto flex space-x-4">
      <button
        onClick={() => handleSort('price')}
        className={`flex items-center text-sm ${sortBy === 'price' ? 'text-coin-gold font-medium' : 'text-gray-600'}`}
      >
        Price
        {sortBy === 'price' && (
          sortDirection === 'asc' ? 
          <ArrowUp size={16} className="ml-1" /> : 
          <ArrowDown size={16} className="ml-1" />
        )}
      </button>
      <button
        onClick={() => handleSort('year')}
        className={`flex items-center text-sm ${sortBy === 'year' ? 'text-coin-gold font-medium' : 'text-gray-600'}`}
      >
        Year
        {sortBy === 'year' && (
          sortDirection === 'asc' ? 
          <ArrowUp size={16} className="ml-1" /> : 
          <ArrowDown size={16} className="ml-1" />
        )}
      </button>
    </div>
  );
};

export default MarketplaceSorting;
