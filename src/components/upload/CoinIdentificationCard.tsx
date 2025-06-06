
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CoinIdentificationCardProps {
  identification: {
    name?: string;
    year?: number;
    country?: string;
    denomination?: string;
    mint?: string;
  };
  confidence: number;
}

const CoinIdentificationCard = ({ identification, confidence }: CoinIdentificationCardProps) => {
  return (
    <div>
      <h3 className="text-2xl font-bold gradient-text mb-4 flex items-center justify-between">
        {identification?.name || 'Unknown Coin'}
        <Badge className="bg-green-600 text-white">
          {(confidence * 100).toFixed(1)}% Confidence
        </Badge>
      </h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Year:</span>
          <span className="ml-2 font-semibold">{identification?.year || 'Unknown'}</span>
        </div>
        <div>
          <span className="text-gray-600">Country:</span>
          <span className="ml-2 font-semibold">{identification?.country || 'Unknown'}</span>
        </div>
        <div>
          <span className="text-gray-600">Denomination:</span>
          <span className="ml-2 font-semibold">{identification?.denomination || 'N/A'}</span>
        </div>
        <div>
          <span className="text-gray-600">Mint:</span>
          <span className="ml-2 font-semibold">{identification?.mint || 'Unknown'}</span>
        </div>
      </div>
    </div>
  );
};

export default CoinIdentificationCard;
