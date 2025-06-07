
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';

interface CoinCardPricingProps {
  coin: {
    price?: number;
    is_auction?: boolean;
  };
}

const CoinCardPricing: React.FC<CoinCardPricingProps> = ({ coin }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-2xl font-bold text-gray-900">
          €{coin.price?.toLocaleString()}
        </div>
        {coin.is_auction && (
          <div className="text-sm text-gray-600">
            Starting at €{coin.price?.toLocaleString()}
          </div>
        )}
      </div>
      
      {!coin.is_auction && (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          <DollarSign className="w-3 h-3 mr-1" />
          Buy Now
        </Badge>
      )}
    </div>
  );
};

export default CoinCardPricing;
