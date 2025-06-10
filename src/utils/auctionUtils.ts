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
      const views = auction.views || 0;
      
      switch (filterStatus) {
        case 'ending_soon':
          return hoursRemaining <= 24 && hoursRemaining > 0;
        case 'just_started':
          return hoursRemaining > 120; // More than 5 days
        case 'hot':
          return views >= 100; // Use views as proxy for popularity
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
        const aValue = a.price || a.starting_bid || 0;
        const bValue = b.price || b.starting_bid || 0;
        return bValue - aValue;
      case 'most_bids':
        const aViews = a.views || 0;
        const bViews = b.views || 0;
        return bViews - aViews; // Use views as proxy for bid activity
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
