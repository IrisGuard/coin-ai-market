
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface RelatedCoin {
  id: string;
  name: string;
  year?: number; // Make year optional to match the actual data
  price: number;
  image?: string;
  grade?: string;
}

interface RelatedCoinsProps {
  relatedCoins: RelatedCoin[];
}

const RelatedCoins = ({ relatedCoins }: RelatedCoinsProps) => {
  const navigate = useNavigate();

  if (relatedCoins.length === 0) return null;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Related Coins</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedCoins.map((relatedCoin) => (
          <Card 
            key={relatedCoin.id} 
            className="glass-card cursor-pointer hover:shadow-xl transition-all duration-300"
            onClick={() => navigate(`/coin/${relatedCoin.id}`)}
          >
            <CardContent className="p-6">
              <img 
                src={relatedCoin.image || '/placeholder-coin.png'}
                alt={relatedCoin.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-lg mb-2">{relatedCoin.name}</h3>
              <div className="flex justify-between items-center">
                {relatedCoin.year && <Badge>{relatedCoin.year}</Badge>}
                <div className="text-lg font-bold text-green-600">${Number(relatedCoin.price).toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedCoins;
