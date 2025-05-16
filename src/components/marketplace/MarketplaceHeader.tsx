
import { useState, useEffect } from 'react';
import MarketplaceSearch from './MarketplaceSearch';
import { motion } from 'framer-motion';

interface MarketplaceHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const MarketplaceHeader = ({ searchTerm, setSearchTerm }: MarketplaceHeaderProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="mb-8"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <motion.div variants={itemVariants} className="relative">
          <h1 className="text-4xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-coin-purple to-coin-skyblue">
            Coin Marketplace
          </h1>
          <div className="w-full h-1 bg-gradient-to-r from-coin-purple via-coin-orange to-coin-skyblue rounded-full mt-2 animate-gradient-shift" style={{ backgroundSize: '200% auto' }}></div>
          <motion.p 
            variants={itemVariants}
            className="mt-2 text-gray-600 max-w-md"
          >
            Explore and collect rare coins from around the world. Bid on auctions or buy directly from sellers.
          </motion.p>
        </motion.div>
        <motion.div variants={itemVariants} className="mt-4 md:mt-0">
          <MarketplaceSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </motion.div>
      </div>
      
      <motion.div 
        variants={itemVariants}
        className="mt-6 p-4 rounded-xl bg-gradient-to-r from-coin-purple/10 to-coin-skyblue/10 backdrop-blur-sm border border-white/20"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <p className="text-coin-purple text-2xl font-bold">1,245+</p>
            <p className="text-gray-600 text-sm">Active Listings</p>
          </div>
          <div className="p-3">
            <p className="text-coin-orange text-2xl font-bold">126</p>
            <p className="text-gray-600 text-sm">Live Auctions</p>
          </div>
          <div className="p-3">
            <p className="text-coin-skyblue text-2xl font-bold">45,729</p>
            <p className="text-gray-600 text-sm">Collectors</p>
          </div>
          <div className="p-3">
            <p className="text-coin-darkpurple text-2xl font-bold">$1.2M+</p>
            <p className="text-gray-600 text-sm">Trading Volume</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MarketplaceHeader;
