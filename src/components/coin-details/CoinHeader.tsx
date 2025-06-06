
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

interface CoinHeaderProps {
  coin: {
    name: string;
    year: number;
    country?: string;
    rarity: string;
    grade: string;
    featured?: boolean;
    views?: number;
  };
}

const CoinHeader = ({ coin }: CoinHeaderProps) => {
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Badge className="bg-purple-600 text-white">{coin.rarity}</Badge>
        <Badge variant="outline">{coin.grade}</Badge>
        {coin.featured && <Badge className="bg-yellow-500 text-white">Featured</Badge>}
        <div className="flex items-center text-gray-500 ml-auto">
          <Eye className="w-4 h-4 mr-1" />
          {coin.views || 0} views
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-gray-800 mb-2">{coin.name}</h1>
      <p className="text-xl text-gray-600">{coin.year} • {coin.country}</p>
    </div>
  );
};

export default CoinHeader;
