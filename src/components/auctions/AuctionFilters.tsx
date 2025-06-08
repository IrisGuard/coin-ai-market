
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AuctionFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: any) => void;
  sortBy: string;
  setSortBy: (sortBy: any) => void;
}

const AuctionFilters: React.FC<AuctionFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy
}) => {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-sm">
      <Input
        placeholder="Search auctions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 min-w-[200px]"
      />
      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Auctions</SelectItem>
          <SelectItem value="ending_soon">Ending Soon</SelectItem>
          <SelectItem value="just_started">Just Started</SelectItem>
          <SelectItem value="hot">Hot Auctions</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Sort by" />
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
