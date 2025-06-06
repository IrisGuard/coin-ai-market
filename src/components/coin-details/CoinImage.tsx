
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CoinImageProps {
  coin: {
    name: string;
    image?: string;
  };
}

const CoinImage = ({ coin }: CoinImageProps) => {
  return (
    <Card className="glass-card border-2 border-purple-200 overflow-hidden">
      <CardContent className="p-0">
        {coin.image ? (
          <img 
            src={coin.image}
            alt={coin.name}
            className="w-full h-96 object-cover"
          />
        ) : (
          <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoinImage;
