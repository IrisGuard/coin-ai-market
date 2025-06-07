
import React from 'react';
import { useParams } from 'react-router-dom';
import { useCoinDetails } from '@/hooks/useCoinDetails';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CoinDetailsStates from '@/components/coin-details/CoinDetailsStates';
import CoinImage from '@/components/coin-details/CoinImage';
import CoinHeader from '@/components/coin-details/CoinHeader';
import EnhancedCoinActionButtons from '@/components/coin-details/EnhancedCoinActionButtons';
import CoinDetailsContent from '@/components/coin-details/CoinDetailsContent';

const CoinDetails = () => {
  const { id } = useParams<{ id: string }>();
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
    onToggleFavorite,
    handlePurchase,
    handleBid,
    user
  } = useCoinDetails(id!);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <CoinDetailsStates 
        isLoading={isLoading} 
        error={error} 
        coin={coin}
      />

      {coin && (
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Images */}
              <div className="lg:col-span-2">
                <CoinImage coin={coin as any} />
                <CoinDetailsContent 
                  coin={coin as any} 
                  bidsData={bidsData} 
                  relatedCoins={relatedCoins}
                  isFavorited={isFavorited}
                  bidAmount={bidAmount}
                  setBidAmount={setBidAmount}
                  isPurchasing={isPurchasing}
                  isBidding={isBidding}
                  onToggleFavorite={onToggleFavorite}
                  onPurchase={handlePurchase}
                  onBid={handleBid}
                  isOwner={user?.id === coin.user_id}
                />
              </div>

              {/* Right Column - Actions */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <CoinHeader coin={coin as any} />
                  <EnhancedCoinActionButtons coin={coin as any} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CoinDetails;
