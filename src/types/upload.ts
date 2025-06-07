
export interface UploadedImage {
  file: File;
  preview: string;
  uploaded: boolean;
  uploading?: boolean;
  url?: string;
  uploadProgress?: number;
  error?: string;
}

export interface CoinData {
  title: string;
  description: string;
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
}
