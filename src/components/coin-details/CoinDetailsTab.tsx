
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CoinDetailsTabProps {
  coin: {
    denomination?: string;
    mint?: string;
    composition?: string;
    weight?: number;
    diameter?: number;
    grade?: string;
    description?: string;
  };
}

const CoinDetailsTab = ({ coin }: CoinDetailsTabProps) => {
  return (
    <Card className="glass-card">
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">Denomination</span>
            <div className="font-semibold">{coin.denomination || 'Not specified'}</div>
          </div>
          <div>
            <span className="text-sm text-gray-600">Mint</span>
            <div className="font-semibold">{coin.mint || 'Not specified'}</div>
          </div>
          <div>
            <span className="text-sm text-gray-600">Composition</span>
            <div className="font-semibold">{coin.composition || 'Not specified'}</div>
          </div>
          <div>
            <span className="text-sm text-gray-600">Weight</span>
            <div className="font-semibold">{coin.weight ? `${coin.weight}g` : 'Not specified'}</div>
          </div>
          <div>
            <span className="text-sm text-gray-600">Diameter</span>
            <div className="font-semibold">{coin.diameter ? `${coin.diameter}mm` : 'Not specified'}</div>
          </div>
          <div>
            <span className="text-sm text-gray-600">Grade</span>
            <div className="font-semibold">{coin.grade || 'Not graded'}</div>
          </div>
        </div>
        
        {coin.description && (
          <div className="pt-4 border-t">
            <span className="text-sm text-gray-600">Description</span>
            <p className="mt-2 text-gray-800">{coin.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoinDetailsTab;
