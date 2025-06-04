
import { Coin } from '@/types/coin';
import CoinCard from './CoinCard';

interface CoinGridProps {
  coins: Coin[];
  loading?: boolean;
}

const CoinGrid = ({ coins, loading }: CoinGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!coins || coins.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No coins found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {coins.map((coin) => (
        <CoinCard 
          key={coin.id}
          id={coin.id}
          name={coin.name}
          year={coin.year}
          grade={coin.grade}
          price={coin.price}
          rarity={coin.rarity}
          image={coin.image}
          isAuction={coin.is_auction}
          timeLeft={coin.auction_end ? new Date(coin.auction_end).toLocaleDateString() : undefined}
          model3d={coin.model_3d_url}
          obverseImage={coin.obverse_image}
          reverseImage={coin.reverse_image}
          favorites={coin.favorites}
        />
      ))}
    </div>
  );
};

export default CoinGrid;
