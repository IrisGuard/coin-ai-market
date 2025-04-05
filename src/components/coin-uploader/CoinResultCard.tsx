
import { Loader2 } from 'lucide-react';
import { CoinData } from '@/components/CoinUploader';

interface CoinResultCardProps {
  coinData: CoinData | null;
  onListForSale: () => void;
  onListForAuction: () => void;
  isListing: boolean;
}

const CoinResultCard = ({ coinData, onListForSale, onListForAuction, isListing }: CoinResultCardProps) => {
  if (!coinData) return null;

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-xl font-semibold text-coin-blue mb-4">Identification Results</h3>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Coin Type</p>
            <p className="font-medium">{coinData.coin}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Year</p>
            <p className="font-medium">{coinData.year}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Grade</p>
            <p className="font-medium">{coinData.grade}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Errors</p>
            <p className="font-medium">{coinData.error}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Metal</p>
            <p className="font-medium">{coinData.metal}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Rarity</p>
            <p className="font-medium">{coinData.rarity}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Weight</p>
            <p className="font-medium">{coinData.weight}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Diameter</p>
            <p className="font-medium">{coinData.diameter}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ruler</p>
            <p className="font-medium">{coinData.ruler}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Estimated Value</p>
            <p className="font-medium text-coin-gold">${coinData.value_usd.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button 
            onClick={onListForSale}
            disabled={isListing}
            className="coin-button w-full disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isListing ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'List for Sale'
            )}
          </button>
          <button 
            onClick={onListForAuction}
            disabled={isListing}
            className="bg-white border-2 border-coin-gold text-coin-gold font-medium py-2 rounded-lg hover:bg-coin-gold hover:text-white transition-colors w-full flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isListing ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'List for Auction'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoinResultCard;
