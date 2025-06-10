
import React from 'react';
import AuctionStatsCards from '../auctions/AuctionStatsCards';
import ActiveAuctionsCard from '../auctions/ActiveAuctionsCard';
import RecentBidsCard from '../auctions/RecentBidsCard';
import {
  useAuctionDashboardData,
  useAuctionStats,
  useActiveAuctions,
  useRecentBids,
  useBidderProfiles
} from '../auctions/useAuctionData';

const AdminAuctionsTab = () => {
  // Get dashboard data for auction stats
  const { data: dashboardDataRaw, isLoading } = useAuctionDashboardData();

  // Get auction-specific stats
  const { data: auctionStats } = useAuctionStats();

  // Get active auctions
  const { data: activeAuctions, isLoading: auctionsLoading } = useActiveAuctions();

  // Get recent bids
  const { data: recentBids, isLoading: bidsLoading } = useRecentBids();

  // Get bidder profiles separately
  const { data: bidderProfiles } = useBidderProfiles(recentBids);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Auction Management</h3>
          <p className="text-sm text-muted-foreground">Monitor auction activity, bids, and performance</p>
        </div>
      </div>

      <AuctionStatsCards auctionStats={auctionStats} />
      <ActiveAuctionsCard 
        activeAuctions={activeAuctions} 
        auctionsLoading={auctionsLoading} 
      />
      <RecentBidsCard 
        recentBids={recentBids} 
        bidsLoading={bidsLoading} 
        bidderProfiles={bidderProfiles} 
      />
    </div>
  );
};

export default AdminAuctionsTab;
