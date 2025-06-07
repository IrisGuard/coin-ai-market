
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FilterStatus = 'all' | 'ending_soon' | 'just_started' | 'hot';
type SortBy = 'ending_soon' | 'highest_bid' | 'most_bids' | 'newest';

interface AuctionFiltersProps {
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
}

const AuctionFilters = ({
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy
}: AuctionFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Select value={filterStatus} onValueChange={(value: FilterStatus) => setFilterStatus(value)}>
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

      <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
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
