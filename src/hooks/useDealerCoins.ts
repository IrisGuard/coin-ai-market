export const useAllDealerCoins = () => {
  // Mock data για testing - replace με real Supabase call
  return {
    data: [
      {
        id: '1',
        name: 'Ancient Roman Denarius',
        price: 150,
        year: 200,
        country: 'Roman Empire',
        rarity: 'Rare',
        condition: 'Fine',
        featured: true,
        is_auction: false,
        authentication_status: 'verified',
        views: 45,
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '2', 
        name: 'Morgan Silver Dollar',
        price: 85,
        year: 1921,
        country: 'United States',
        rarity: 'Common',
        condition: 'Very Fine',
        featured: false,
        is_auction: false,
        authentication_status: 'verified',
        views: 32,
        created_at: '2024-01-02T00:00:00Z'
      }
    ],
    isLoading: false,
    error: null
  };
};
