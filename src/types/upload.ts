
export interface UploadedImage {
  file?: File;
  preview: string;
  uploaded: boolean;
  uploading: boolean;
  url?: string;
}

export interface CoinData {
  title: string;
  description: string;
  structured_description?: string;
  price: string;
  startingBid: string;
  isAuction: boolean;
  condition: string;
  year: string;
  country: string;
  denomination: string;
  grade: string;
  rarity: string;
  mint: string;
  composition: string;
  diameter: string;
  weight: string;
  auctionDuration: string;
  category?: string;
}

export type ItemType = 'coin' | 'banknote';
