
export interface UploadedImage {
  file: File;
  url: string;
  permanentUrl?: string; // Added missing property
  preview?: string;
  uploaded?: boolean;
  id?: string;
}

export interface CoinData {
  title: string;
  description?: string;
  structured_description?: string;
  year: string;
  grade: string;
  price: string;
  rarity?: string;
  country?: string;
  denomination?: string;
  condition?: string;
  composition?: string;
  diameter?: string;
  weight?: string;
  mint?: string;
  category?: string;
  isAuction?: boolean;
  startingBid?: string;
  auctionDuration?: string;
}

export type ItemType = 'coin' | 'banknote';

// Enhanced DualAnalysisResult with missing properties
export interface DualAnalysisResult {
  name?: string;
  confidence?: number;
  grade?: string;
  estimatedValue?: number;
  errors?: string[];
  // Added missing properties
  errorDetected?: boolean;
  category?: string;
  rarity?: string;
  featured?: boolean;
  country?: string;
  denomination?: string;
  year?: number;
  condition?: string;
  composition?: string;
  mint?: string;
}
