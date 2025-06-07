
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Trophy, Eye } from 'lucide-react';

interface AuctionCardImageProps {
  auction: {
    id: string;
    name: string;
    image: string;
  };
  isEndingSoon: boolean;
  isMyBid: boolean;
  addToWatchlist: (coinId: string) => void;
}

const AuctionCardImage = ({
  auction,
  isEndingSoon,
  isMyBid,
  addToWatchlist
}: AuctionCardImageProps) => {
  return (
    <div className="relative mb-4">
      <Link to={`/coin/${auction.id}`}>
        {/* Square aspect ratio for auction images */}
        <div className="aspect-square overflow-hidden rounded-lg">
          <img 
            src={auction.image} 
            alt={auction.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </div>
      </Link>
      
      {/* Status Badges */}
      <div className="absolute top-2 left-2">
        {isEndingSoon && (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Ending Soon
          </Badge>
        )}
      </div>
      
      <div className="absolute top-2 right-2">
        {isMyBid && (
          <Badge className="bg-green-100 text-green-800">
            <Trophy className="w-3 h-3 mr-1" />
            Your Bid
          </Badge>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="absolute bottom-2 right-2 flex gap-2">
        <Button 
          size="sm" 
          variant="secondary"
          onClick={() => addToWatchlist(auction.id)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AuctionCardImage;
