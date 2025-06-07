
import React from 'react';

interface ActiveMarketplaceStatsProps {
  filteredCount: number;
  totalCount: number;
}

const ActiveMarketplaceStats: React.FC<ActiveMarketplaceStatsProps> = ({
  filteredCount,
  totalCount
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <p className="text-electric-green">
        Showing <span className="font-semibold text-electric-blue">{filteredCount}</span> of <span className="font-semibold text-electric-purple">{totalCount}</span> coins
      </p>
    </div>
  );
};

export default ActiveMarketplaceStats;
