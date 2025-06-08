
export const useAdminData = () => {
  return {
    stats: {
      totalUsers: 0,
      totalCoins: 0,
      totalRevenue: 0,
      revenueToday: 0,
      newUsersToday: 0,
      pendingVerification: 0,
      averageAccuracy: 94
    },
    systemHealth: {
      status: 'healthy',
      uptime: '99.9%'
    },
    isLoading: false
  };
};

// Admin Users hooks
export const useAdminUsers = () => {
  return {
    data: [],
    isLoading: false,
    error: null
  };
};

export const useUpdateUserStatus = () => {
  return {
    mutate: () => {},
    isPending: false
  };
};

// Admin Coins hooks  
export const useAdminCoins = () => {
  return {
    data: [],
    isLoading: false,
    error: null
  };
};

export const useUpdateCoinStatus = () => {
  return {
    mutate: () => {},
    isPending: false
  };
};

// API Keys hooks
export const useApiKeys = () => {
  return {
    data: [],
    isLoading: false
  };
};

export const useApiKeyCategories = () => {
  return {
    data: [],
    isLoading: false
  };
};

export const useCreateApiKey = () => {
  return {
    mutate: () => {},
    isPending: false
  };
};

export const useBulkCreateApiKeys = () => {
  return {
    mutate: () => {},
    isPending: false
  };
};

// Notifications hook
export const useNotifications = () => {
  return {
    data: [],
    isLoading: false
  };
};

// Transactions hook
export const useTransactions = () => {
  return {
    data: [],
    isLoading: false
  };
};

// Error monitoring hooks
export const useErrorLogs = () => {
  return {
    data: [],
    isLoading: false
  };
};

export const useConsoleErrors = () => {
  return {
    data: [],
    isLoading: false
  };
};

// Scraping jobs hook
export const useScrapingJobs = () => {
  return {
    data: [],
    isLoading: false
  };
};
