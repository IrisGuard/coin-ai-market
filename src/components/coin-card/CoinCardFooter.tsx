
import React from 'react';
import { Eye } from 'lucide-react';

interface CoinCardFooterProps {
  coin: {
    views?: number;
    profiles?: {
      name: string;
      verified_dealer?: boolean;
    };
  };
}

const CoinCardFooter: React.FC<CoinCardFooterProps> = ({ coin }) => {
  return (
    <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-200">
      <div className="flex items-center gap-1">
        <Eye className="w-4 h-4" />
        <span>{coin.views || 0} views</span>
      </div>
      
      {coin.profiles && (
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
            {coin.profiles.name?.[0]?.toUpperCase()}
          </div>
          <span className="text-xs">{coin.profiles.name}</span>
          {coin.profiles.verified_dealer && (
            <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoinCardFooter;
