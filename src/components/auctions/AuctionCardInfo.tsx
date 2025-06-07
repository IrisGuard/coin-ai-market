
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { AuctionCoin } from '@/types/auction';

interface AuctionCardInfoProps {
  auction: AuctionCoin;
}

const AuctionCardInfo = ({ auction }: AuctionCardInfoProps) => {
  return (
    <div className="space-y-3">
      <div>
        <Link to={`/coin/${auction.id}`}>
          <h3 className="font-semibold text-lg hover:text-brand-primary transition-colors truncate">
            {auction.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600">{auction.year}</p>
      </div>

      {/* Bidding Info */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Τρέχουσα Προσφορά:</span>
          <span className="text-xl font-bold text-green-600">€{auction.current_bid}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Προσφορές: {auction.bid_count || 0}</span>
          <span className="text-gray-600">Παρακολουθούν: {auction.watchers || 0}</span>
        </div>

        {auction.reserve_price && auction.reserve_price > auction.current_bid && (
          <div className="text-sm text-orange-600">
            Δεν έχει φτάσει το όριο (€{auction.reserve_price})
          </div>
        )}
      </div>

      {/* Seller Info */}
      {auction.profiles && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <p className="text-sm font-medium">{auction.profiles.name}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="text-xs">{auction.profiles.reputation}/100</span>
              </div>
              {auction.profiles.verified_dealer && (
                <Badge variant="outline" className="text-xs">
                  Πιστοποιημένος
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionCardInfo;
