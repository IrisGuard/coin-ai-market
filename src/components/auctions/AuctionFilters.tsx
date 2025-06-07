
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface AuctionFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: 'all' | 'ending_soon' | 'just_started' | 'hot';
  setFilterStatus: (status: 'all' | 'ending_soon' | 'just_started' | 'hot') => void;
  sortBy: 'ending_soon' | 'highest_bid' | 'most_bids' | 'newest';
  setSortBy: (sort: 'ending_soon' | 'highest_bid' | 'most_bids' | 'newest') => void;
}

const AuctionFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy
}: AuctionFiltersProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search auctions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

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
      </CardContent>
    </Card>
  );
};

export default AuctionFilters;
