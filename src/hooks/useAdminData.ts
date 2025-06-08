
export const useAdminData = () => {
  return {
    stats: {
      totalUsers: 0,
      totalCoins: 0,
      totalRevenue: 0,
      revenueToday: 0,
      newUsersToday: 0,
      pendingVerification: 0
    },
    isLoading: false
  };
};
