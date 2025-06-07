
import { useState, useCallback } from 'react';
import type { CoinData } from '@/types/upload';

const getInitialCoinData = (): CoinData => ({
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
  auctionDuration: '7'  // Now string to match CoinData type
});

export const useCoinData = () => {
  const [coinData, setCoinData] = useState<CoinData>(getInitialCoinData());

  const updateCoinData = useCallback((updates: Partial<CoinData>) => {
    setCoinData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetCoinData = useCallback(() => {
    setCoinData(getInitialCoinData());
  }, []);

  return {
    coinData,
    setCoinData,
    updateCoinData,
    resetCoinData
  };
};
