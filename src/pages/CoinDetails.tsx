
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Clock, DollarSign, Info, Award, ArrowLeft, ChevronLeft, ChevronRight, Heart, Share2, Flag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Sample coin data
const coinData = {
  '1': {
    id: '1',
    name: '10 Drachmai',
    year: 1959,
    grade: 'MS66',
    error: 'None',
    price: 55.00,
    startingBid: 40.00,
    currentBid: 52.00,
    bidCount: 5,
    rarity: 'Uncommon',
    metal: 'Nickel',
    weight: '10.000g',
    diameter: '30mm',
    ruler: 'Paul I',
    description: 'Beautiful example of a 10 Drachmai coin from 1959. This is in exceptional condition with minimal wear and excellent strike. The obverse features King Paul I of Greece, while the reverse shows the Greek coat of arms.',
    isAuction: true,
    timeLeft: '2d 5h',
    images: [
      'https://www.karamitsos.com/img/lots/559/127028.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/10_Drachmai_-_Greece_%281959%29_-_Reverse.jpg/1200px-10_Drachmai_-_Greece_%281959%29_-_Reverse.jpg',
      'https://en.numista.com/catalogue/photos/grece/g1062.jpg'
    ],
    sellerName: 'CoinCollector123',
    sellerRating: 4.8,
    sellerSales: 87
  },
  '2': {
    id: '2',
    name: 'Morgan Dollar',
    year: 1879,
    grade: 'MS67',
    error: 'None',
    price: 1250.00,
    startingBid: null,
    currentBid: null,
    bidCount: 0,
    rarity: 'Rare',
    metal: 'Silver',
    weight: '26.73g',
    diameter: '38.1mm',
    ruler: 'United States',
    description: 'Rare and highly sought-after Morgan Dollar in exceptional MS67 condition. This coin exhibits a sharp strike with beautiful luster and minimal contact marks. The 1879 date makes this a valuable addition to any collection.',
    isAuction: false,
    timeLeft: null,
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/d/d9/1879S_Morgan_Dollar_NGC_MS67plus_Obverse.png',
      'https://upload.wikimedia.org/wikipedia/commons/7/70/1879S_Morgan_Dollar_NGC_MS67plus_Reverse.png',
      'https://www.pcgs.com/coinfacts/coin/morgan-dollar-1879-s/7092'
    ],
    sellerName: 'RareCoinsDealer',
    sellerRating: 4.9,
    sellerSales: 342
  }
};

const CoinDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [bidAmount, setBidAmount] = useState('');
  
  // If no id is provided or coin is not found, show error
  if (!id || !coinData[id]) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold text-coin-blue mb-4">Coin Not Found</h1>
            <p className="text-gray-600 mb-6">The coin you're looking for does not exist or has been removed.</p>
            <a href="/marketplace" className="coin-button-outline inline-flex items-center">
              <ArrowLeft size={20} className="mr-2" /> Return to Marketplace
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const coin = coinData[id];
  
  const nextImage = () => {
    setActiveImageIndex((prevIndex) => 
      prevIndex === coin.images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setActiveImageIndex((prevIndex) => 
      prevIndex === 0 ? coin.images.length - 1 : prevIndex - 1
    );
  };
  
  const handleBid = () => {
    const amount = parseFloat(bidAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Bid Amount",
        description: "Please enter a valid bid amount.",
        variant: "destructive",
      });
      return;
    }
    
    if (coin.currentBid && amount <= coin.currentBid) {
      toast({
        title: "Bid Too Low",
        description: `Your bid must be higher than the current bid of $${coin.currentBid.toFixed(2)}.`,
        variant: "destructive",
      });
      return;
    }
    
    if (coin.startingBid && amount < coin.startingBid) {
      toast({
        title: "Bid Too Low",
        description: `Your bid must be at least the starting bid of $${coin.startingBid.toFixed(2)}.`,
        variant: "destructive",
      });
      return;
    }
    
    // In a real application, this would submit the bid to a server
    toast({
      title: "Bid Placed!",
      description: `You have successfully placed a bid of $${amount.toFixed(2)}.`,
    });
    
    setBidAmount('');
  };
  
  const handleBuy = () => {
    toast({
      title: "Purchase Initiated",
      description: "You are being redirected to complete your purchase.",
    });
    
    // In a real application, this would redirect to a checkout page or initiate the payment process
  };
  
  const handleWatchlist = () => {
    toast({
      title: "Added to Watchlist",
      description: "This coin has been added to your watchlist.",
    });
  };
  
  const handleShare = () => {
    // In a real application, this would open a share dialog
    toast({
      title: "Share",
      description: "Sharing functionality would be implemented here.",
    });
  };
  
  const handleReport = () => {
    toast({
      title: "Report Submitted",
      description: "Thank you for your report. Our team will review this listing.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <a href="/marketplace" className="text-gray-600 hover:text-coin-blue flex items-center">
              <ArrowLeft size={18} className="mr-2" /> Back to Marketplace
            </a>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* Image Section */}
              <div className="col-span-1 lg:col-span-2 p-6">
                <div className="bg-gray-100 rounded-lg overflow-hidden relative">
                  <div className="aspect-w-4 aspect-h-3 relative">
                    <img 
                      src={coin.images[activeImageIndex]} 
                      alt={`${coin.name} ${coin.year}`} 
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <button 
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
                  >
                    <ChevronLeft size={20} className="text-gray-700" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
                  >
                    <ChevronRight size={20} className="text-gray-700" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {coin.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === activeImageIndex ? 'bg-coin-gold' : 'bg-gray-300'
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex space-x-3">
                    {coin.images.slice(0, 3).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                          index === activeImageIndex ? 'border-coin-gold' : 'border-transparent'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`Thumbnail ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                    {coin.images.length > 3 && (
                      <button className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium">
                        +{coin.images.length - 3}
                      </button>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleWatchlist}
                      className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                    >
                      <Heart size={20} />
                    </button>
                    <button 
                      onClick={handleShare}
                      className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                    >
                      <Share2 size={20} />
                    </button>
                    <button 
                      onClick={handleReport}
                      className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                    >
                      <Flag size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="mt-8 border-t pt-6">
                  <h2 className="text-xl font-semibold text-coin-blue mb-4">Description</h2>
                  <p className="text-gray-600">{coin.description}</p>
                  
                  <h2 className="text-xl font-semibold text-coin-blue mt-6 mb-4">Specifications</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Metal</p>
                      <p className="font-medium">{coin.metal}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-medium">{coin.weight}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Diameter</p>
                      <p className="font-medium">{coin.diameter}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ruler/Authority</p>
                      <p className="font-medium">{coin.ruler}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Grade</p>
                      <p className="font-medium">{coin.grade}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Error</p>
                      <p className="font-medium">{coin.error}</p>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-coin-blue mt-6 mb-4">Seller Information</h2>
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-coin-blue text-white rounded-full flex items-center justify-center font-medium">
                      {coin.sellerName.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{coin.sellerName}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(coin.sellerRating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span>{coin.sellerRating}/5 • {coin.sellerSales} sales</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Purchase Section */}
              <div className="col-span-1 border-t md:border-t-0 md:border-l border-gray-200 p-6">
                <h1 className="text-2xl font-serif font-bold text-coin-blue">{coin.name}</h1>
                <p className="text-lg text-gray-600 mt-1">{coin.year} • {coin.grade}</p>
                
                <div className="mt-4 flex items-center">
                  <span className={`${getRarityClass(coin.rarity)}`}>{coin.rarity}</span>
                </div>
                
                {coin.isAuction ? (
                  <div className="mt-6">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600">Starting bid</p>
                      <p className="font-medium">${coin.startingBid?.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-gray-600">Current bid</p>
                      <p className="font-semibold text-lg">${coin.currentBid?.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <p className="text-gray-500">{coin.bidCount} bids</p>
                      <p className="text-coin-blue flex items-center">
                        <Clock size={14} className="mr-1" />
                        {coin.timeLeft} remaining
                      </p>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Place your bid
                      </label>
                      <div className="flex">
                        <div className="relative flex-grow">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign size={16} className="text-gray-400" />
                          </div>
                          <input
                            type="number"
                            className="coin-input pl-8 w-full"
                            placeholder={`${(coin.currentBid || coin.startingBid)! + 1}`}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            min={(coin.currentBid || coin.startingBid)! + 1}
                            step="0.01"
                          />
                        </div>
                        <button
                          onClick={handleBid}
                          className="ml-2 coin-button"
                        >
                          Bid
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Enter ${((coin.currentBid || coin.startingBid)! + 1).toFixed(2)} or more
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6">
                    <p className="text-gray-600">Buy now price</p>
                    <p className="text-3xl font-semibold text-coin-gold">${coin.price.toFixed(2)}</p>
                    
                    <button
                      onClick={handleBuy}
                      className="mt-4 coin-button w-full"
                    >
                      Buy Now
                    </button>
                  </div>
                )}
                
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-lg font-medium text-coin-blue mb-4">AI Recognition Details</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start mb-4">
                      <Info size={16} className="text-coin-gold mt-1 mr-2" />
                      <p className="text-sm text-gray-600">
                        This coin has been analyzed by our AI system with 98% confidence in the identification and grading.
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">AI Confidence</span>
                      <span className="font-medium">98%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-gray-600">Human verified</span>
                      <span className="text-green-600 font-medium flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Yes
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 border-t pt-6 text-sm text-gray-500">
                  <div className="flex items-center mb-3">
                    <Award size={16} className="text-coin-gold mr-2" />
                    <span>Authentication guaranteed</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <Shield size={16} className="text-coin-gold mr-2" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign size={16} className="text-coin-gold mr-2" />
                    <span>14-day return policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Helper function to get rarity class
const getRarityClass = (rarity: string) => {
  switch (rarity) {
    case 'Common':
      return 'rarity-common';
    case 'Uncommon':
      return 'rarity-uncommon';
    case 'Rare':
      return 'rarity-rare';
    case 'Ultra Rare':
      return 'rarity-ultra-rare';
    default:
      return 'rarity-common';
  }
};

export default CoinDetails;
