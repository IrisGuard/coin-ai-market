
export const useDashboardData = () => {
  return {
    stats: {
      totalCoins: 0,
      totalValue: 0,
      watchlistItems: 0,
      recentActivity: 0
    },
    watchlistItems: [],
    recentTransactions: [],
    favorites: []
  };
};
