
import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Coin } from '@/types/coin';
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import MarketplaceFilterPanel from '@/components/marketplace/MarketplaceFilterPanel';
import MarketplaceGrid from '@/components/marketplace/MarketplaceGrid';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useCoins, useFeaturedCoins } from '@/hooks/use-coins';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuctionOnly, setIsAuctionOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'year'>('price');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

  // Fetch coins with filters
  const { data: coins = [], isLoading, isError } = useCoins({
    rarity: selectedRarity,
    isAuctionOnly,
    searchTerm,
    sortBy,
    sortDirection,
  });

  // Fetch featured coins
  const { data: featuredCoins = [], isLoading: featuredLoading } = useFeaturedCoins();

  const handleSort = useCallback((field: 'price' | 'year') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  }, [sortBy, sortDirection]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setIsAuctionOnly(false);
    setSelectedRarity(null);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <motion.main 
        className="flex-grow py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MarketplaceHeader 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
          
          {featuredCoins.length > 0 && !featuredLoading && (
            <motion.div 
              variants={itemVariants}
              className="mb-12"
            >
              <h2 className="text-2xl font-serif font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-coin-orange to-coin-purple">
                Featured Collectibles
              </h2>
              <div className="relative">
                <Carousel 
                  opts={{ align: "start", loop: true }}
                  className="w-full"
                >
                  <CarouselContent>
                    {featuredCoins.map((coin) => (
                      <CarouselItem key={coin.id} className="md:basis-1/2 lg:basis-1/3">
                        <Link to={`/coins/${coin.id}`} className="block p-1">
                          <div className="relative h-80 rounded-xl overflow-hidden">
                            <img 
                              src={coin.image} 
                              alt={coin.name}
                              className="w-full h-full object-contain bg-gradient-to-b from-coin-purple/5 to-coin-skyblue/5 p-6"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                              <div className="glassmorphism bg-black/30 p-4 rounded-xl">
                                <h3 className="font-bold text-xl">{coin.name}</h3>
                                <p className="text-white/80">{coin.year} • {coin.grade}</p>
                                <div className="mt-2 flex justify-between items-center">
                                  <span className="font-semibold text-lg">${coin.price.toFixed(2)}</span>
                                  <span className={`${coin.isAuction ? 'bg-coin-orange' : 'bg-coin-purple'} px-3 py-1 rounded-full text-xs`}>
                                    {coin.isAuction ? 'Auction' : 'Buy Now'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 md:left-4 bg-white/80 border-none hover:bg-white text-coin-purple" />
                  <CarouselNext className="right-2 md:right-4 bg-white/80 border-none hover:bg-white text-coin-purple" />
                </Carousel>
              </div>
            </motion.div>
          )}
          
          {featuredLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-coin-purple" />
            </div>
          )}
          
          <motion.div variants={itemVariants}>
            <MarketplaceFilterPanel 
              isAuctionOnly={isAuctionOnly}
              setIsAuctionOnly={setIsAuctionOnly}
              selectedRarity={selectedRarity}
              setSelectedRarity={setSelectedRarity}
              sortBy={sortBy}
              sortDirection={sortDirection}
              handleSort={handleSort}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-coin-purple" />
              </div>
            ) : isError ? (
              <div className="text-center py-12 glassmorphism">
                <h2 className="text-2xl font-semibold text-coin-purple mb-2">Error loading coins</h2>
                <p className="text-gray-600 mb-6">
                  We couldn't load the coin data. Please try again later.
                </p>
                <button 
                  className="px-6 py-2 bg-gradient-to-r from-coin-purple to-coin-skyblue text-white rounded-full hover:shadow-lg transition-shadow"
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </button>
              </div>
            ) : (
              <MarketplaceGrid 
                filteredCoins={coins}
                searchTerm={searchTerm}
                isAuctionOnly={isAuctionOnly}
                selectedRarity={selectedRarity}
                clearFilters={clearFilters}
              />
            )}
          </motion.div>
        </div>
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default Marketplace;
