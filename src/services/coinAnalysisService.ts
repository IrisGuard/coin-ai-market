
import { CoinData } from '@/components/CoinUploader';
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';
import { supabase } from '@/integrations/supabase/client';

/**
 * Analyzes coin images and returns identification data
 */
export const analyzeCoinImages = async (imageFiles: File[]): Promise<CoinData> => {
  // For demo purposes, return mock data
  // In a real application, this would call the AI backend
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
 * Lists a coin for sale or auction
 */
export const listCoinForSale = async (
  coinData: CoinData, 
  isAuction: boolean = false, 
  price: number = 0,
  imageUrls: string[] = []
): Promise<{ success: boolean; message: string; coinId?: string }> => {
  try {
    // Check if we have a valid Supabase session
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      return {
        success: false,
        message: "You must be logged in to list a coin"
      };
    }
    
    const userId = sessionData.session.user.id;
    
    // Prepare coin data for storage
    const newCoin = {
      name: coinData.coin,
      year: coinData.year,
      grade: coinData.grade,
      price: price,
      rarity: coinData.rarity,
      image: imageUrls[0] || '', // Use the first uploaded image URL
      description: `${coinData.year} ${coinData.coin} - ${coinData.grade}`,
      condition: coinData.grade,
      country: "United States", // Default for mock data
      composition: coinData.metal,
      diameter: parseFloat(coinData.diameter),
      weight: parseFloat(coinData.weight),
      user_id: userId,
      is_auction: isAuction,
      auction_end: isAuction ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null, // 7 days from now
      obverse_image: imageUrls[0] || '',
      reverse_image: imageUrls[1] || ''
    };

    // For demo purposes, we'll simulate successful listing
    // In a real app, we'd insert into the Supabase database
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Return success with mock coin ID
    const mockCoinId = Math.random().toString(36).substring(2, 15);
    
    return {
      success: true,
      message: isAuction ? "Coin listed for auction successfully!" : "Coin listed for sale successfully!",
      coinId: mockCoinId
    };
  } catch (error) {
    console.error("Error listing coin for sale:", error);
    return {
      success: false,
      message: "Failed to list coin. Please try again later."
    };
  }
};
