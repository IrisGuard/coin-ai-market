
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface PriceRange {
  min: number;
  max: number;
  average: number;
}

interface PriceAnalysisCardProps {
  priceRange: PriceRange;
}

const PriceAnalysisCard: React.FC<PriceAnalysisCardProps> = ({ priceRange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Price Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">
                ${priceRange.min.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600">Minimum</p>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                ${priceRange.average.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600">Average</p>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">
                ${priceRange.max.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600">Maximum</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 via-blue-500 to-red-500 h-2 rounded-full"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceAnalysisCard;
