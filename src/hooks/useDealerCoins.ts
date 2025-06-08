
import { Coin } from '@/types/coin';

export const useAllDealerCoins = () => {
  // Mock data για testing - replace με real Supabase call
  const mockCoins: Coin[] = [
    {
      id: '1',
      name: 'Ancient Roman Denarius',
      price: 150,
      year: 200,
      grade: 'Fine',
      image: '/placeholder.svg',
      user_id: 'mock-user-1',
      country: 'Roman Empire',
      rarity: 'Rare',
      condition: 'Good',
      featured: true,
      is_auction: false,
      authentication_status: 'verified',
      views: 45,
      created_at: '2024-01-01T00:00:00Z',
      description: 'Beautiful ancient Roman silver denarius featuring Emperor portrait',
      pcgs_grade: '',
      ngc_grade: '',
      composition: 'Silver',
      diameter: 18,
      weight: 3.5,
      mint: 'Rome',
      mintage: 1000000
    },
    {
      id: '2', 
      name: 'Morgan Silver Dollar',
      price: 85,
      year: 1921,
      grade: 'VF-30',
      image: '/placeholder.svg',
      user_id: 'mock-user-2',
      country: 'United States',
      rarity: 'Common',
      condition: 'Excellent',
      featured: false,
      is_auction: false,
      authentication_status: 'verified',
      views: 32,
      created_at: '2024-01-02T00:00:00Z',
      description: 'Classic Morgan Silver Dollar in Very Fine condition',
      pcgs_grade: '',
      ngc_grade: '',
      composition: '90% Silver',
      diameter: 38.1,
      weight: 26.73,
      mint: 'Philadelphia',
      mintage: 44690000
    }
  ];

  return {
    data: mockCoins,
    isLoading: false,
    error: null
  };
};

export const useDealerCoins = (dealerId: string) => {
  // Mock data για testing - replace με real Supabase call
  const mockCoins: Coin[] = [
    {
      id: '1',
      name: 'Ancient Roman Denarius',
      price: 150,
      year: 200,
      grade: 'Fine',
      image: '/placeholder.svg',
      user_id: dealerId,
      country: 'Roman Empire',
      rarity: 'Rare',
      condition: 'Good',
      featured: true,
      is_auction: false,
      authentication_status: 'verified',
      views: 45,
      created_at: '2024-01-01T00:00:00Z',
      description: 'Beautiful ancient Roman silver denarius featuring Emperor portrait',
      pcgs_grade: '',
      ngc_grade: '',
      composition: 'Silver',
      diameter: 18,
      weight: 3.5,
      mint: 'Rome',
      mintage: 1000000
    }
  ];

  return {
    data: mockCoins,
    isLoading: false,
    error: null
  };
};
