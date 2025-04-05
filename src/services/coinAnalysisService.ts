
import { CoinData } from '@/components/CoinUploader';
import { toast } from '@/hooks/use-toast';
import { API_BASE_URL, API_ENDPOINTS, API_TIMEOUTS } from '@/config/api';

/**
 * Analyzes coin images and returns identification data
 * 
 * @param images Array of image files to be analyzed
 * @returns Promise with the coin data
 */
export const analyzeCoinImages = async (images: File[]): Promise<CoinData | null> => {
  try {
    // Create a FormData instance to send the images
    const formData = new FormData();
    
    // Append each image to the FormData with the same field name
    // The FastAPI backend expects a List[UploadFile] so we use the same field name for each file
    images.forEach((image) => {
      formData.append('images', image);
    });
    
    console.log(`Sending ${images.length} images to ${API_BASE_URL}${API_ENDPOINTS.ANALYZE_COIN}`);
    
    // Set up fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUTS.ANALYZE_COIN);
    
    // Make the actual API call to the FastAPI backend
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ANALYZE_COIN}`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    // Check if the request was successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    // Parse the JSON response
    const data = await response.json();
    
    // Map the response to our CoinData type
    const coinData: CoinData = {
      coin: data.coin,
      year: data.year,
      grade: data.grade,
      error: data.error,
      value_usd: data.value_usd,
      rarity: data.rarity,
      metal: data.metal,
      weight: data.weight,
      diameter: data.diameter,
      ruler: data.ruler
    };
    
    return coinData;
  } catch (error) {
    console.error('Error analyzing coin images:', error);
    
    // Handle timeout errors specifically
    if (error instanceof DOMException && error.name === 'AbortError') {
      toast({
        title: "Analysis Timeout",
        description: "The coin analysis is taking too long. Please try again with clearer images.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Analysis Failed",
        description: `There was an error analyzing your coin images: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
    
    return null;
  }
};

/**
 * Lists a coin for sale or auction
 * 
 * @param coinData The coin data to list
 * @param isAuction Whether to list as auction (true) or direct sale (false)
 * @param price The listing price or starting bid
 * @returns Promise with the listing result
 */
export const listCoinForSale = async (
  coinData: CoinData, 
  isAuction: boolean, 
  price: number
): Promise<{ success: boolean; listingId?: string; message: string }> => {
  try {
    const endpoint = isAuction ? API_ENDPOINTS.AUCTIONS : API_ENDPOINTS.LISTINGS;
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coinData,
        price,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    
    return {
      success: true,
      listingId: result.id || `listing-${Date.now()}`,
      message: "Your coin has been successfully listed for " + 
        (isAuction ? "auction" : "sale") + "."
    };
  } catch (error) {
    console.error('Error listing coin:', error);
    return {
      success: false,
      message: `Failed to list your coin: ${(error as Error).message}`
    };
  }
};
