
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, DollarSign, Award, Rotate3d, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

type CoinCardProps = {
  id: string;
  name: string;
  year: number;
  grade: string;
  price: number;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Ultra Rare';
  image: string;
  isAuction?: boolean;
  timeLeft?: string;
  model3d?: string;
  obverseImage?: string;
  reverseImage?: string;
  favorites?: number;
};

const CoinCard = ({
  id,
  name,
  year,
  grade,
  price,
  rarity,
  image,
  isAuction = false,
  timeLeft,
  model3d,
  obverseImage,
  reverseImage,
  favorites = 0,
}: CoinCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(favorites);
  
  const { isAuthenticated, user } = useAuth();

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to add coins to your favorites",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (isFavorite) {
        setFavoritesCount(prev => Math.max(0, prev - 1));
        setIsFavorite(false);
        
        toast({
          title: "Removed from Favorites",
          description: `${name} has been removed from your favorites`,
        });
      } else {
        setFavoritesCount(prev => prev + 1);
        setIsFavorite(true);
        
        toast({
          title: "Added to Favorites",
          description: `${name} has been added to your favorites`,
        });
      }
        
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    }
  };

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
  
  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return 'shadow-sm shadow-green-200';
      case 'Uncommon':
        return 'shadow-md shadow-blue-200';
      case 'Rare':
        return 'shadow-lg shadow-purple-300';
      case 'Ultra Rare':
        return 'shadow-xl shadow-red-300 animate-pulse-glow';
      default:
        return '';
    }
  };

  // Use the most appropriate image for display
  const displayImage = obverseImage || image;
  const backImage = reverseImage || image;

  return (
    <Link to={`/coins/${id}`} className={`coin-card group ${getRarityGlow(rarity)}`}>
      <motion.div 
        className="flip-card"
        onClick={(e) => { 
          e.preventDefault(); 
          if (!isRotating) setIsFlipped(!isFlipped); 
        }}
        initial={false}
        animate={isRotating ? { rotateY: 360 } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        onAnimationComplete={() => {
          if (isRotating) setIsRotating(false);
        }}
      >
        <div className={`flip-card-inner ${isFlipped ? 'rotate-y-180' : ''}`}>
          <div className="flip-card-front">
            <div className="relative overflow-hidden">
              <motion.img 
                src={displayImage} 
                alt={`${name} ${year}`} 
                className="w-full h-48 object-contain p-4 bg-gradient-to-b from-gray-100 to-white transition-transform duration-300 group-hover:scale-105"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              {isAuction && (
                <div className="absolute top-2 right-2 bg-coin-orange text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                  <Clock size={12} className="mr-1" />
                  <span>{timeLeft}</span>
                </div>
              )}
              {rarity && (
                <div className="absolute top-2 left-2">
                  <span className={getRarityClass(rarity)}>{rarity}</span>
                </div>
              )}
              
              <div className="absolute bottom-2 right-2 flex space-x-2">
                <motion.button 
                  className="bg-white/80 p-1 rounded-full backdrop-blur-sm"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation();
                    setIsRotating(true);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Rotate3d size={16} className="text-coin-purple" />
                </motion.button>
                
                <motion.button 
                  className="bg-white/80 p-1 rounded-full backdrop-blur-sm"
                  onClick={toggleFavorite}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart 
                    size={16} 
                    className={`transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                  />
                </motion.button>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg text-coin-blue truncate">{name}</h3>
              <p className="text-gray-600 text-sm mb-2">{year} • Grade: {grade}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <DollarSign size={16} className="text-coin-purple" />
                  <span className="font-bold text-coin-purple">${price.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Heart size={14} className="text-red-400" />
                  <span className="text-xs text-gray-500">{favoritesCount}</span>
                </div>
              </div>
              
              {isAuction && (
                <div className="mt-2 text-xs text-coin-orange font-medium">
                  Auction ends in {timeLeft}
                </div>
              )}
            </div>
          </div>
          
          <div className="flip-card-back">
            <div className="relative overflow-hidden">
              <motion.img 
                src={backImage} 
                alt={`${name} ${year} reverse`} 
                className="w-full h-48 object-contain p-4 bg-gradient-to-b from-gray-100 to-white"
              />
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg text-coin-blue">Reverse Side</h3>
              <p className="text-gray-600 text-sm">{name} ({year})</p>
              
              <div className="mt-2">
                <span className={getRarityClass(rarity)}>{rarity}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CoinCard;
