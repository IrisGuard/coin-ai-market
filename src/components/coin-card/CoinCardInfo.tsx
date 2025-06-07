
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface CoinCardInfoProps {
  coin: {
    id: string;
    name: string;
    year: number;
    country?: string;
    condition?: string;
    rarity?: string;
  };
}

const CoinCardInfo: React.FC<CoinCardInfoProps> = ({ coin }) => {
  return (
    <div>
      <Link to={`/coin/${coin.id}`}>
        <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-orange-600 transition-colors">
          {coin.name}
        </h3>
      </Link>
      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
        <span>{coin.year}</span>
        {coin.country && (
          <>
            <span>•</span>
            <span>{coin.country}</span>
          </>
        )}
      </div>
      
      {/* Condition and Rarity */}
      <div className="flex items-center gap-2 flex-wrap mt-2">
        {coin.condition && (
          <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
            {coin.condition}
          </Badge>
        )}
        {coin.rarity && (
          <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
            {coin.rarity}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default CoinCardInfo;
