
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AuctionFiltersProps {
  filterStatus: 'all' | 'ending_soon' | 'just_started' | 'hot';
  setFilterStatus: (status: 'all' | 'ending_soon' | 'just_started' | 'hot') => void;
  sortBy: 'ending_soon' | 'highest_bid' | 'most_bids' | 'newest';
  setSortBy: (sort: 'ending_soon' | 'highest_bid' | 'most_bids' | 'newest') => void;
}

const AuctionFilters = ({
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy
}: AuctionFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Auctions</SelectItem>
          <SelectItem value="ending_soon">Ending Soon</SelectItem>
          <SelectItem value="just_started">Just Started</SelectItem>
          <SelectItem value="hot">Hot Auctions</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ending_soon">Ending Soon</SelectItem>
          <SelectItem value="highest_bid">Highest Bid</SelectItem>
          <SelectItem value="most_bids">Most Bids</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AuctionFilters;
