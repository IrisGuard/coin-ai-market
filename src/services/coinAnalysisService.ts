
import { CoinData } from '@/components/CoinUploader';

export const analyzeCoinImages = async (imageFiles: File[]): Promise<CoinData> => {
  // TODO: Replace with your AI API when provided
  
  // Temporary mock response for development
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
  
  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return mockResponse;
};

export const listCoinForSale = async (
  coinData: CoinData, 
  isAuction: boolean = false, 
  price: number = 0,
  imageUrls: string[] = []
): Promise<{ success: boolean; message: string; coinId?: string }> => {
  try {
    // TODO: Replace with real API call when backend is connected
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockCoinId = Math.random().toString(36).substring(2, 15);
    
    return {
      success: true,
      message: "Coin listed successfully",
      coinId: mockCoinId
    };
  } catch (error) {
    console.error("Error listing coin:", error);
    return {
      success: false,
      message: "Failed to list coin"
    };
  }
};
