
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockApi } from '@/lib/mockApi';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';

interface CoinBidFormProps {
  coinId: string;
  coinName: string;
  currentPrice: number;
  isAuction: boolean;
  timeLeft?: string;
  auctionEndDate?: string;
  bids?: {
    amount: number;
    bidder: string;
    time: string;
  }[];
  onBidPlaced: () => void;
}

const CoinBidForm = ({
  coinId,
  coinName,
  currentPrice,
  isAuction,
  timeLeft,
  auctionEndDate,
  bids = [],
  onBidPlaced
}: CoinBidFormProps) => {
  const { isAuthenticated, user } = useAuth();
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minimumBid, setMinimumBid] = useState(currentPrice);
  const [timeRemaining, setTimeRemaining] = useState(timeLeft || '');
  const [isEnded, setIsEnded] = useState(false);
  
  // Calculate the minimum bid (current highest bid + 5%)
  useEffect(() => {
    if (bids && bids.length > 0) {
      // Find the highest bid
      const highestBid = Math.max(...bids.map(bid => bid.amount));
      setMinimumBid(Math.max(highestBid * 1.05, currentPrice));
    } else {
      setMinimumBid(currentPrice);
    }
  }, [bids, currentPrice]);
  
  // Update the time remaining
  useEffect(() => {
    if (!isAuction || !auctionEndDate) return;
    
    const updateTimeRemaining = () => {
      const now = new Date();
      const endDate = new Date(auctionEndDate);
      const diff = endDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining('Ended');
        setIsEnded(true);
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${seconds}s`);
      }
    };
    
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);
    
    return () => clearInterval(interval);
  }, [isAuction, auctionEndDate]);

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to place a bid",
        variant: "destructive",
      });
      return;
    }
    
    if (isEnded) {
      toast({
        title: "Auction Ended",
        description: "This auction has already ended",
        variant: "destructive",
      });
      return;
    }
    
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < minimumBid) {
      toast({
        title: "Invalid Bid Amount",
        description: `Bid must be at least $${minimumBid.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Place bid using mock API
      await mockApi.placeBid(coinId, user!.id, amount);
      
      toast({
        title: "Bid Placed Successfully",
        description: `Your bid of $${amount.toFixed(2)} has been placed`,
      });
      
      // Reset form
      setBidAmount('');
      
      // Refresh the parent component
      onBidPlaced();
    } catch (error) {
      console.error('Error placing bid:', error);
      toast({
        title: "Error",
        description: "Failed to place bid. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If not an auction, show buy now form
  if (!isAuction) {
    return (
      <div className="glassmorphism p-6">
        <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-coin-purple to-coin-skyblue">
          Buy Now
        </h3>
        <p className="text-gray-600 mb-4">
          This coin is available for immediate purchase.
        </p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-700">Price:</span>
          <span className="text-2xl font-bold text-coin-purple">${currentPrice.toFixed(2)}</span>
        </div>
        <Button 
          className="w-full bg-gradient-to-r from-coin-purple to-coin-skyblue text-white"
          disabled={!isAuthenticated}
          onClick={() => {
            if (isAuthenticated) {
              toast({
                title: "Processing Purchase",
                description: "Your purchase is being processed...",
              });
            } else {
              toast({
                title: "Authentication Required",
                description: "Please login to make a purchase",
                variant: "destructive",
              });
            }
          }}
        >
          Buy Now
        </Button>
        
        {!isAuthenticated && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            Please log in to make a purchase.
          </p>
        )}
      </div>
    );
  }
  
  // For auctions
  return (
    <motion.div 
      className="glassmorphism p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-coin-orange to-coin-skyblue">
        Live Auction
      </h3>
      
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <Clock className="text-coin-orange mr-2" size={18} />
          <span className="font-semibold">Time Left:</span>
        </div>
        <span className={`font-mono ${isEnded || timeRemaining === 'Ended' ? 'text-red-500' : 'text-coin-orange'}`}>
          {timeRemaining}
        </span>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold">Current Bid:</span>
        <span className="text-2xl font-bold text-coin-purple">${currentPrice.toFixed(2)}</span>
      </div>
      
      {isEnded ? (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
          <div className="flex items-center">
            <AlertTriangle className="text-yellow-500 mr-2" size={18} />
            <p className="text-yellow-700">This auction has ended.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitBid} className="space-y-4">
          <div>
            <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Your Bid (minimum ${minimumBid.toFixed(2)})
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <Input
                id="bidAmount"
                type="number"
                step="0.01"
                min={minimumBid}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="pl-7"
                placeholder={minimumBid.toFixed(2)}
                disabled={isSubmitting || !isAuthenticated || isEnded}
              />
            </div>
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-coin-orange to-coin-purple text-white"
            disabled={isSubmitting || !isAuthenticated || isEnded}
          >
            {isSubmitting ? "Placing Bid..." : "Place Bid"}
          </Button>
          
          {!isAuthenticated && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Please log in to place a bid.
            </p>
          )}
        </form>
      )}
      
      {/* Bid History */}
      {bids && bids.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Bid History</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {bids.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).map((bid, index) => (
              <div key={index} className="flex justify-between items-center text-sm bg-white/50 p-2 rounded">
                <span className="font-mono text-gray-600">
                  {new Date(bid.time).toLocaleString()}
                </span>
                <span className="font-bold text-coin-purple">${bid.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CoinBidForm;
