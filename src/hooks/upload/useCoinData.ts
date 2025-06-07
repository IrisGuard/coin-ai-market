
import { useState, useCallback } from 'react';
import type { CoinData } from '@/types/upload';

const initialCoinData: CoinData = {
  title: '',
  description: '',
  price: '',
  startingBid: '',
  isAuction: false,
  condition: '',
  year: '',
  country: '',
  denomination: '',
  grade: '',
  rarity: '',
  mint: '',
  composition: '',
  diameter: '',
  weight: '',
  auctionDuration: '7'
};

export const useCoinData = () => {
  const [coinData, setCoinData] = useState<CoinData>(initialCoinData);

  const updateCoinData = useCallback((data: CoinData) => {
    setCoinData(data);
  }, []);

  return {
    coinData,
    updateCoinData
  };
};
