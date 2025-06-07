
export const filterAndSortAuctions = (
  auctions: any[],
  searchTerm: string,
  filterStatus: 'all' | 'ending_soon' | 'just_started' | 'hot',
  sortBy: 'ending_soon' | 'highest_bid' | 'most_bids' | 'newest'
) => {
  // Filter by search term
  let filtered = auctions.filter(auction =>
    auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    auction.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter by status
  const now = new Date().getTime();
  
  switch (filterStatus) {
    case 'ending_soon':
      filtered = filtered.filter(auction => {
        const end = new Date(auction.auction_end).getTime();
        const hoursRemaining = (end - now) / (1000 * 60 * 60);
        return hoursRemaining <= 24 && hoursRemaining > 0;
      });
      break;
    case 'just_started':
      filtered = filtered.filter(auction => {
        const start = new Date(auction.created_at || auction.auction_end).getTime();
        const hoursAgo = (now - start) / (1000 * 60 * 60);
        return hoursAgo <= 24;
      });
      break;
    case 'hot':
      filtered = filtered.filter(auction => 
        auction.bid_count >= 5 || auction.watchers >= 10
      );
      break;
  }

  // Sort auctions
  switch (sortBy) {
    case 'ending_soon':
      filtered.sort((a, b) => {
        const aEnd = new Date(a.auction_end).getTime();
        const bEnd = new Date(b.auction_end).getTime();
        return aEnd - bEnd;
      });
      break;
    case 'highest_bid':
      filtered.sort((a, b) => b.current_bid - a.current_bid);
      break;
    case 'most_bids':
      filtered.sort((a, b) => b.bid_count - a.bid_count);
      break;
    case 'newest':
      filtered.sort((a, b) => {
        const aCreated = new Date(a.created_at || a.auction_end).getTime();
        const bCreated = new Date(b.created_at || b.auction_end).getTime();
        return bCreated - aCreated;
      });
      break;
  }

  return filtered;
};

export const getTimeRemaining = (endTime: string) => {
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  const remaining = end - now;

  if (remaining <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, expired: false };
};
