
export const filterAndSortAuctions = (auctions: any[], searchTerm: string, filterStatus: string, sortBy: string) => {
  if (!auctions) return [];
  
  let filtered = [...auctions];

  // Filter by search term
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter(auction =>
      auction.name?.toLowerCase().includes(searchLower) ||
      auction.description?.toLowerCase().includes(searchLower) ||
      auction.country?.toLowerCase().includes(searchLower)
    );
  }

  // Filter by status
  if (filterStatus !== 'all') {
    const now = new Date().getTime();
    
    filtered = filtered.filter(auction => {
      const endTime = new Date(auction.auction_end).getTime();
      const hoursRemaining = (endTime - now) / (1000 * 60 * 60);
      const bidCount = auction.bid_count || 0;
      const watchers = auction.watchers || 0;
      
      switch (filterStatus) {
        case 'ending_soon':
          return hoursRemaining <= 24 && hoursRemaining > 0;
        case 'just_started':
          return hoursRemaining > 120; // More than 5 days
        case 'hot':
          return bidCount >= 5 || watchers >= 10;
        default:
          return true;
      }
    });
  }

  // Sort auctions
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'ending_soon':
        return new Date(a.auction_end).getTime() - new Date(b.auction_end).getTime();
      case 'highest_bid':
        const aBid = a.current_bid || a.starting_bid || a.price || 0;
        const bBid = b.current_bid || b.starting_bid || b.price || 0;
        return bBid - aBid;
      case 'most_bids':
        const aBidCount = a.bid_count || 0;
        const bBidCount = b.bid_count || 0;
        return bBidCount - aBidCount;
      case 'newest':
      default:
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
    }
  });

  return filtered;
};

export const getTimeRemaining = (endDate: string) => {
  const now = new Date().getTime();
  const end = new Date(endDate).getTime();
  const remaining = end - now;

  if (remaining <= 0) {
    return { days: 0, hours: 0, minutes: 0, expired: true };
  }

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, expired: false };
};
