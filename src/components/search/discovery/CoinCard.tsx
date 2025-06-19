import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye } from 'lucide-react';
import { validateComponentProps } from '@/utils/mockDataBlocker';

interface CoinCardProps {
  id: string;
  name: string;
  imageUrl: string;
  year: number;
  mint: string;
  grade?: string;
  price?: number;
  onViewDetails: (id: string) => void;
  onAddToWatchlist: (id: string) => void;
}

const CoinCard: React.FC<CoinCardProps> = ({
  id,
  name,
  imageUrl,
  year,
  mint,
  grade,
  price,
  onViewDetails,
  onAddToWatchlist
}) => {
  // Validate props
  validateComponentProps({ id, name, imageUrl, year, mint, grade, price }, 'CoinCard');

  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden">
      <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600">{year} {mint}</p>
        {grade && <Badge className="mt-2">{grade}</Badge>}
        {price && <p className="text-md font-medium text-green-600 mt-2">${price.toFixed(2)}</p>}
        <div className="flex justify-between mt-4">
          <Button variant="outline" size="sm" onClick={() => onViewDetails(id)}>
            <Eye className="w-4 h-4 mr-2" />
            Details
          </Button>
          <Button size="sm" onClick={() => onAddToWatchlist(id)}>
            <Heart className="w-4 h-4 mr-2" />
            Watch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinCard;
