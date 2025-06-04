
import { Loader2, Coins } from 'lucide-react';
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
      
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative w-48 h-48 bg-white rounded-lg shadow-md overflow-hidden flex items-center justify-center">
              {coinData.image_url ? (
                <img 
                  src={coinData.image_url}
                  alt={`${coinData.coin}`} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <Coins size={64} />
                  <p className="text-sm mt-2">No Image</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Coin Type</p>
                <p className="font-medium">{coinData.coin || "1794 Liberty Silver Dollar"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium">{coinData.year || "1794"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Grade</p>
                <p className="font-medium">{coinData.grade || "SP66"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Errors</p>
                <p className="font-medium">{coinData.error || "None"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Metal</p>
                <p className="font-medium">{coinData.metal || "Silver"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rarity</p>
                <p className="font-medium">{coinData.rarity || "Ultra Rare"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Weight</p>
                <p className="font-medium">{coinData.weight || "26.96g"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Diameter</p>
                <p className="font-medium">{coinData.diameter || "39-40mm"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ruler</p>
                <p className="font-medium">{coinData.ruler || "Liberty"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated Value</p>
                <p className="font-medium text-coin-gold">${coinData.value_usd ? coinData.value_usd.toFixed(2) : "10,016,875.00"}</p>
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
      </div>
    </div>
  );
};

export default CoinResultCard;
