
export const useCoinDetails = (id: string) => {
  return {
    coin: null,
    isLoading: false,
    error: null,
    bidsData: [],
    relatedCoins: [],
    isFavorited: false,
    bidAmount: '',
    setBidAmount: () => {},
    isPurchasing: false,
    isBidding: false,
    toggleFavorite: () => {},
    handlePurchase: () => {},
    handleBid: () => {}
  };
};
