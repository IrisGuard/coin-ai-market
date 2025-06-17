
export interface UploadedImage {
  file: File;
  preview: string;
  uploaded: boolean;
  uploading: boolean;
}

export interface CoinData {
  title: string;
  description: string;
  year: string;
  country: string;
  denomination: string;
  grade: string;
  composition: string;
  rarity: string;
  mint: string;
  diameter: string;
  weight: string;
  price: string;
  isAuction: boolean;
  startingBid: string;
}

export type ItemType = 'coin' | 'banknote';

export interface ItemTypeProcessingOptions {
  itemType: ItemType;
  backgroundColor: string;
  cropShape: 'circular' | 'rectangular';
  enhanceContrast: boolean;
  resizeToStandard: boolean;
}
