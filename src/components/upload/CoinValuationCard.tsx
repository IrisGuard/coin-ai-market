
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp } from 'lucide-react';

interface CoinValuationCardProps {
  valuation: {
    current_value?: number;
    low_estimate?: number;
    high_estimate?: number;
    market_trend?: string;
  };
}

const CoinValuationCard = ({ valuation }: CoinValuationCardProps) => {
  return (
    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-green-600" />
        Market Valuation
      </h4>
      <div className="text-3xl font-bold text-green-600 mb-1">
        ${valuation?.current_value || '0'}
      </div>
      <div className="text-sm text-gray-600 mb-2">
        Range: ${valuation?.low_estimate || '0'} - ${valuation?.high_estimate || '0'}
      </div>
      <Badge variant="secondary" className="text-xs">
        <TrendingUp className="w-3 h-3 mr-1" />
        {valuation?.market_trend || 'Stable'}
      </Badge>
    </div>
  );
};

export default CoinValuationCard;
