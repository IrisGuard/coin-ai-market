
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, DollarSign, Award, Rotate3d } from 'lucide-react';

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
  const [isFlipped, setIsFlipped] = useState(false);

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
  
  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return 'shadow-sm shadow-green-200';
      case 'Uncommon':
        return 'shadow-md shadow-blue-200';
      case 'Rare':
        return 'shadow-lg shadow-purple-300';
      case 'Ultra Rare':
        return 'shadow-xl shadow-red-300 animate-pulse-glow';
      default:
        return '';
    }
  };

  return (
    <Link to={`/coins/${id}`} className={`coin-card group ${getRarityGlow(rarity)}`}>
      <div className="flip-card" onClick={(e) => { e.preventDefault(); setIsFlipped(!isFlipped); }}>
        <div className={`flip-card-inner ${isFlipped ? 'rotate-y-180' : ''}`}>
          <div className="flip-card-front">
            <div className="relative overflow-hidden">
              <img 
                src={image} 
                alt={`${name} ${year}`} 
                className="w-full h-48 object-contain p-4 bg-gradient-to-b from-gray-100 to-white transition-transform duration-300 group-hover:scale-105"
              />
              {isAuction && (
                <div className="absolute top-2 right-2 bg-coin-purple text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                  <Clock size={12} className="mr-1" />
                  <span>{timeLeft}</span>
                </div>
              )}
              {rarity && (
                <div className="absolute top-2 left-2">
                  <span className={getRarityClass(rarity)}>{rarity}</span>
                </div>
              )}
              
              <button 
                className="absolute bottom-2 right-2 bg-white/80 p-1 rounded-full backdrop-blur-sm"
                onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }}
              >
                <Rotate3d size={16} className="text-coin-purple" />
              </button>
            </div>
            <div className="p-4 glassmorphism mt-[-1px] rounded-t-none">
              <h3 className="text-lg font-medium text-coin-dark truncate">{name}</h3>
              <div className="text-sm text-gray-500 mt-1 flex items-center">
                <span>{year}</span>
                <span className="mx-2">•</span>
                <span className="font-medium text-coin-blue">{grade}</span>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <div className="text-lg font-semibold text-coin-purple flex items-center">
                  <DollarSign size={16} className="mr-1" />
                  {price.toFixed(2)}
                </div>
                <button className="text-xs font-medium bg-gradient-to-r from-coin-purple to-coin-skyblue text-white px-3 py-1 rounded-full hover:bg-opacity-90 transition-all">
                  {isAuction ? 'Bid Now' : 'Buy Now'}
                </button>
              </div>
            </div>
          </div>
          <div className="flip-card-back rounded-xl">
            <div className="h-full flex flex-col justify-between p-4 bg-gradient-to-br from-coin-darkpurple/90 to-coin-skyblue/90 text-white rounded-xl">
              <div>
                <h3 className="text-xl font-bold mb-2">{name} ({year})</h3>
                <p className="text-sm opacity-90">Grade: <span className="font-semibold">{grade}</span></p>
                <div className="mt-3 flex items-center">
                  <Award size={16} className="mr-1" />
                  <span className="text-sm">{rarity} Rarity</span>
                </div>
              </div>
              
              <div className="mt-auto">
                {isAuction ? (
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-sm font-medium">Auction ending in:</p>
                    <p className="text-lg font-bold">{timeLeft}</p>
                    <div className="mt-2 text-center">
                      <button className="w-full bg-white text-coin-darkpurple font-medium py-1.5 px-3 rounded-full text-sm hover:bg-opacity-90 transition-all">
                        Place a Bid
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-sm font-medium">Buy it now:</p>
                    <p className="text-lg font-bold">${price.toFixed(2)}</p>
                    <div className="mt-2 text-center">
                      <button className="w-full bg-white text-coin-darkpurple font-medium py-1.5 px-3 rounded-full text-sm hover:bg-opacity-90 transition-all">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CoinCard;
