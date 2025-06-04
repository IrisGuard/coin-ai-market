
import { CoinData } from '@/components/CoinUploader';

/**
 * Analyzes coin images and returns identification data
 */
export const analyzeCoinImages = async (imageFiles: File[]): Promise<CoinData> => {
  // Mock response για development
  const mockResponse: CoinData = {
    coin: "1794 Liberty Silver Dollar",
    year: 1794,
    grade: "SP66",
    error: "None",
    value_usd: 10016875,
    rarity: "Ultra Rare",
    metal: "Silver",
    weight: "26.96g",
    diameter: "39-40mm",
    ruler: "Liberty"
  };
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return mockResponse;
};

/**
 * Lists a coin for sale or auction - Mock version
 */
export const listCoinForSale = async (
  coinData: CoinData, 
  isAuction: boolean = false, 
  price: number = 0,
  imageUrls: string[] = []
): Promise<{ success: boolean; message: string; coinId?: string }> => {
  try {
    console.log('Listing coin: Waiting for new Supabase connection');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Return mock success
    const mockCoinId = Math.random().toString(36).substring(2, 15);
    
    return {
      success: true,
      message: "Mock listing - waiting for new database connection",
      coinId: mockCoinId
    };
  } catch (error) {
    console.error("Mock error listing coin:", error);
    return {
      success: false,
      message: "Mock error - waiting for new database connection"
    };
  }
};
