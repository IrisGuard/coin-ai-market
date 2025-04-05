
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CoinCard from './CoinCard';

// Sample coin data for preview
const previewCoins = [
  {
    id: '1',
    name: '10 Drachmai',
    year: 1959,
    grade: 'MS66',
    price: 55.00,
    rarity: 'Uncommon' as const,
    image: 'https://www.karamitsos.com/img/lots/559/127028.jpg',
    isAuction: true,
    timeLeft: '2d 5h',
  },
  {
    id: '2',
    name: 'Morgan Dollar',
    year: 1879,
    grade: 'MS67',
    price: 1250.00,
    rarity: 'Rare' as const,
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/1879S_Morgan_Dollar_NGC_MS67plus_Obverse.png',
  },
  {
    id: '3',
    name: 'British Sovereign',
    year: 1817,
    grade: 'AU58',
    price: 525.00,
    rarity: 'Uncommon' as const,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Great_Britain_1817_Half_Sovereign.jpg/1200px-Great_Britain_1817_Half_Sovereign.jpg',
    isAuction: true,
    timeLeft: '6h 15m',
  },
  {
    id: '4',
    name: '1 Lepton',
    year: 1857,
    grade: 'VF30',
    price: 35.00,
    rarity: 'Common' as const,
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/57/One_lepton_of_Greece_1857_%28reverse%29.jpg',
  },
];

const MarketplacePreview = () => {
  return (
    <div className="coin-section bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-heading">Featured Coins</h2>
          <Link to="/marketplace" className="flex items-center text-coin-blue hover:text-coin-gold">
            View all marketplace <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {previewCoins.map((coin) => (
            <CoinCard key={coin.id} {...coin} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/upload" className="coin-button inline-flex items-center px-6 py-3">
            Upload and Sell Your Coins <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePreview;
