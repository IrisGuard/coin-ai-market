import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCoinDetails } from '@/hooks/useCoinDetails';
import { updateMetaTags } from '@/utils/seoUtils';
import Navbar from '@/components/Navbar';
import CoinDetailsContent from '@/components/coin-details/CoinDetailsContent';
import { LoadingState, ErrorState, InvalidIdState } from '@/components/coin-details/CoinDetailsStates';

const CoinDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const {
    coin,
    dealerStore,
    isLoading,
    error,
    bidsData,
    relatedCoins,
    isFavorited,
    bidAmount,
    setBidAmount,
    isPurchasing,
    isBidding,
    toggleFavorite,
    handlePurchase,
    handleBid
  } = useCoinDetails(id || '');

  // 🔍 DYNAMIC SEO META TAGS
  useEffect(() => {
    if (coin) {
      const coinTitle = `${coin.name} (${coin.year}) - ${coin.country || 'Unknown Origin'}`;
      const coinDescription = `${coin.name} from ${coin.year} available for ${coin.is_auction ? 'auction' : 'purchase'}. ${coin.description || ''} Authenticated coin from verified dealer.`;
      const coinKeywords = `${coin.name}, ${coin.year}, ${coin.country}, ${coin.category}, coin collecting, numismatics, ${coin.rarity}`;
      
      updateMetaTags({
        title: `${coinTitle} | CoinAI Marketplace`,
        description: coinDescription.substring(0, 160), // Limit to 160 chars for SEO
        keywords: coinKeywords,
        image: coin.image || coin.obverse_image,
        type: 'product',
        url: window.location.href
      });
    }
  }, [coin]);

  if (!id) {
    return <InvalidIdState />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !coin) {
    return <ErrorState />;
  }

  const isOwner = user?.id === coin.user_id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <CoinDetailsContent
          coin={coin}
          dealerStore={dealerStore}
          bidsData={bidsData || []}
          relatedCoins={relatedCoins || []}
          isFavorited={isFavorited}
          bidAmount={bidAmount}
          setBidAmount={setBidAmount}
          isPurchasing={isPurchasing}
          isBidding={isBidding}
          onToggleFavorite={toggleFavorite}
          onPurchase={handlePurchase}
          onBid={handleBid}
          isOwner={isOwner}
        />
      </div>
    </div>
  );
};

export default CoinDetails;
