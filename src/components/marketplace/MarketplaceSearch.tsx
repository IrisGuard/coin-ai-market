
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface MarketplaceSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const MarketplaceSearch = ({ searchTerm, setSearchTerm }: MarketplaceSearchProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div 
      className={`relative ${isFocused ? 'scale-105' : 'scale-100'}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all ${isFocused ? 'text-coin-purple' : 'text-gray-400'}`}>
        <Search size={18} />
      </div>
      <input
        type="text"
        placeholder="Search coins, years, grades..."
        className={`pl-10 pr-8 py-2.5 rounded-full border-2 transition-all duration-300 outline-none w-full md:w-64 ${
          isFocused 
            ? 'border-coin-purple shadow-md shadow-coin-purple/20' 
            : 'border-gray-200'
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(4px)'
        }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {searchTerm && (
        <button
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-coin-purple transition-colors"
          onClick={() => setSearchTerm('')}
        >
          <X size={16} />
        </button>
      )}
      
      <div className="hidden md:block absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-coin-purple to-coin-skyblue rounded-full opacity-0 transition-opacity duration-300"
        style={{ opacity: isFocused ? 1 : 0 }}
      ></div>
    </motion.div>
  );
};

export default MarketplaceSearch;
