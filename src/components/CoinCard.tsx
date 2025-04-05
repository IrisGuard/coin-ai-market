
import { Link } from 'react-router-dom';
import { Clock, DollarSign, Award } from 'lucide-react';

type CoinCardProps = {
  id: string;
  name: string;
  year: number;
  grade: string;
  price: number;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare';
  image: string;
  isAuction?: boolean;
  timeLeft?: string;
};

const CoinCard = ({
  id,
  name,
  year,
  grade,
  price,
  rarity,
  image,
  isAuction = false,
  timeLeft,
}: CoinCardProps) => {
  const getRarityClass = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return 'rarity-common';
      case 'Uncommon':
        return 'rarity-uncommon';
      case 'Rare':
        return 'rarity-rare';
      case 'Ultra Rare':
        return 'rarity-ultra-rare';
      default:
        return 'rarity-common';
    }
  };

  return (
    <Link to={`/coins/${id}`} className="coin-card group">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={`${name} ${year}`} 
          className="w-full h-48 object-contain p-4 bg-gradient-to-b from-gray-100 to-white transition-transform duration-300 group-hover:scale-105"
        />
        {isAuction && (
          <div className="absolute top-2 right-2 bg-coin-blue text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
            <Clock size={12} className="mr-1" />
            <span>{timeLeft}</span>
          </div>
        )}
        {rarity && (
          <div className="absolute top-2 left-2">
            <span className={getRarityClass(rarity)}>{rarity}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-coin-blue truncate">{name}</h3>
        <div className="text-sm text-gray-500 mt-1 flex items-center">
          <span>{year}</span>
          <span className="mx-2">•</span>
          <span className="font-medium text-coin-blue">{grade}</span>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <div className="text-lg font-semibold text-coin-gold flex items-center">
            <DollarSign size={16} className="mr-1" />
            {price.toFixed(2)}
          </div>
          <button className="text-xs font-medium bg-coin-blue text-white px-3 py-1 rounded-full hover:bg-opacity-90">
            {isAuction ? 'Bid Now' : 'Buy Now'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CoinCard;
