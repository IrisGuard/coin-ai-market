
import React from 'react';
import { Award } from 'lucide-react';

interface CoinGradingCardProps {
  grading: {
    condition?: string;
    grade?: string;
    details?: string;
  };
}

const CoinGradingCard = ({ grading }: CoinGradingCardProps) => {
  return (
    <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Award className="w-5 h-5 text-yellow-600" />
        Professional Grade
      </h4>
      <div className="text-lg font-bold text-yellow-700">
        {grading?.condition || grading?.grade || 'Good'}
      </div>
      <div className="text-sm text-gray-600 mt-1">
        {grading?.details || 'Professional grading assessment'}
      </div>
    </div>
  );
};

export default CoinGradingCard;
