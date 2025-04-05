
import { CoinData } from '@/components/CoinUploader';

interface CoinResultCardProps {
  coinData: CoinData | null;
}

const CoinResultCard = ({ coinData }: CoinResultCardProps) => {
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
        
        <div className="mt-6">
          <button className="coin-button w-full">
            List for Sale / Auction
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoinResultCard;
