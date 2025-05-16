
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, DollarSign, Award, Rotate3d, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
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

  // Check if the coin is in the user's favorites
  const checkFavoriteStatus = async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      const { data } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('coin_id', id)
        .single();
      
      setIsFavorite(!!data);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

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
        // Remove from favorites
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user!.id)
          .eq('coin_id', id);
        
        setFavoritesCount(prev => Math.max(0, prev - 1));
        setIsFavorite(false);
        
        toast({
          title: "Removed from Favorites",
          description: `${name} has been removed from your favorites`,
        });
      } else {
        // Add to favorites
        await supabase
          .from('user_favorites')
          .insert({
            user_id: user!.id,
            coin_id: id,
            created_at: new Date().toISOString()
          });
        
        setFavoritesCount(prev => prev + 1);
        setIsFavorite(true);
        
        toast({
          title: "Added to Favorites",
          description: `${name} has been added to your favorites`,
        });
      }
      
      // Update the favorites count in the coins table
      await supabase
        .from('coins')
        .update({ favorites: favoritesCount })
        .eq('id', id);
        
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
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation();
                    setIsFlipped(!isFlipped); 
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Rotate3d size={16} className="text-coin-purple" />
                </motion.button>
              </div>
              
              <motion.button 
                className="absolute top-2 right-14 p-1 rounded-full"
                onClick={toggleFavorite}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart 
                  size={16} 
                  className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                />
              </motion.button>
            </div>
            <div className="p-4 glassmorphism mt-[-1px] rounded-t-none">
              <h3 className="text-lg font-medium text-coin-dark truncate">{name}</h3>
              <div className="text-sm text-gray-500 mt-1 flex items-center">
                <span>{year}</span>
                <span className="mx-2">•</span>
                <span className="font-medium text-coin-blue">{grade}</span>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <div className="text-lg font-semibold text-coin-purple flex items-center">
                  <DollarSign size={16} className="mr-1" />
                  {price.toFixed(2)}
                </div>
                <motion.button 
                  className="text-xs font-medium bg-gradient-to-r from-coin-purple to-coin-skyblue text-white px-3 py-1 rounded-full hover:bg-opacity-90 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isAuction ? 'Bid Now' : 'Buy Now'}
                </motion.button>
              </div>
            </div>
          </div>
          <div className="flip-card-back rounded-xl">
            <div className="h-full flex flex-col justify-between p-4 bg-gradient-to-br from-coin-darkpurple/90 to-coin-skyblue/90 text-white rounded-xl">
              <div>
                <h3 className="text-xl font-bold mb-2">{name} ({year})</h3>
                <p className="text-sm opacity-90">Grade: <span className="font-semibold">{grade}</span></p>
                <div className="mt-3 flex items-center">
                  <Award size={16} className="mr-1" />
                  <span className="text-sm">{rarity} Rarity</span>
                </div>
                
                {/* Back image */}
                {backImage && (
                  <div className="mt-3 bg-white/30 rounded-lg p-2 backdrop-blur-sm">
                    <img 
                      src={backImage} 
                      alt={`${name} reverse`}
                      className="w-full h-24 object-contain mix-blend-darken"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-auto">
                {isAuction ? (
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-sm font-medium">Auction ending in:</p>
                    <p className="text-lg font-bold">{timeLeft}</p>
                    <div className="mt-2 text-center">
                      <motion.button 
                        className="w-full bg-white text-coin-darkpurple font-medium py-1.5 px-3 rounded-full text-sm hover:bg-opacity-90 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Place a Bid
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-sm font-medium">Buy it now:</p>
                    <p className="text-lg font-bold">${price.toFixed(2)}</p>
                    <div className="mt-2 text-center">
                      <motion.button 
                        className="w-full bg-white text-coin-darkpurple font-medium py-1.5 px-3 rounded-full text-sm hover:bg-opacity-90 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Add to Cart
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CoinCard;
