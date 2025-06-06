
import { TimeRemaining } from '@/types/auction';

// Calculate time remaining for each auction
export const getTimeRemaining = (endTime: string): TimeRemaining => {
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  const remaining = end - now;

  if (remaining <= 0) {
    return { 
      days: 0, 
      hours: 0, 
      minutes: 0, 
      seconds: 0, 
      expired: true 
    };
  }

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, expired: false };
};

// Filter and sort auctions
export const filterAndSortAuctions = (
  auctions: any[],
  searchTerm: string,
  filterStatus: string,
  sortBy: string
) => {
  return auctions
    .filter(auction => {
      const matchesSearch = auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          auction.country.toLowerCase().includes(searchTerm.toLowerCase());
      
      const timeRemaining = getTimeRemaining(auction.auction_end);
      const hoursRemaining = timeRemaining.days * 24 + timeRemaining.hours;
      
      let matchesFilter = true;
      switch (filterStatus) {
        case 'ending_soon':
          matchesFilter = hoursRemaining <= 24;
          break;
        case 'just_started':
          matchesFilter = auction.bid_count <= 2;
          break;
        case 'hot':
          matchesFilter = auction.bid_count >= 5 || auction.watchers >= 10;
          break;
      }

      return matchesSearch && matchesFilter && !timeRemaining.expired;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'highest_bid':
          return b.current_bid - a.current_bid;
        case 'most_bids':
          return b.bid_count - a.bid_count;
        case 'newest':
          return new Date(b.auction_end).getTime() - new Date(a.auction_end).getTime();
        default: // ending_soon
          return new Date(a.auction_end).getTime() - new Date(b.auction_end).getTime();
      }
    });
};
