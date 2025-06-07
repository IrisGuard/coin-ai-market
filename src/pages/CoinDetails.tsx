
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCoinDetails } from '@/hooks/useCoinDetails';
import Navbar from '@/components/Navbar';
import CoinDetailsContent from '@/components/coin-details/CoinDetailsContent';
import { LoadingState, ErrorState, InvalidIdState } from '@/components/coin-details/CoinDetailsStates';

const CoinDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const {
    coin,
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
