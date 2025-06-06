
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Flag } from 'lucide-react';

interface CoinActionButtonsProps {
  isFavorited: boolean;
  onToggleFavorite: () => void;
}

const CoinActionButtons = ({ isFavorited, onToggleFavorite }: CoinActionButtonsProps) => {
  return (
    <div className="flex gap-4">
      <Button
        variant="outline"
        size="lg"
        onClick={onToggleFavorite}
        className={`flex-1 ${isFavorited ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
      >
        <Heart className={`w-5 h-5 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
        {isFavorited ? 'Favorited' : 'Add to Favorites'}
      </Button>
      
      <Button variant="outline" size="lg">
        <Share2 className="w-5 h-5 mr-2" />
        Share
      </Button>
      
      <Button variant="outline" size="lg">
        <Flag className="w-5 h-5 mr-2" />
        Report
      </Button>
    </div>
  );
};

export default CoinActionButtons;
