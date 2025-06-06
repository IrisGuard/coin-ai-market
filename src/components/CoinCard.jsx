
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Clock, Tag, Award, Eye, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CoinCard = ({ 
  id, 
  name, 
  year, 
  image, 
  price, 
  isAuction, 
  timeLeft, 
  rarity, 
  grade,
  views,
  favorites,
  featured
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Helper function to get color based on rarity
  const getRarityColor = () => {
    switch(rarity) {
      case 'Ultra Rare': return 'bg-red-500';
      case 'Rare': return 'bg-brand-primary';
      case 'Uncommon': return 'bg-electric-blue';
      case 'Common': return 'bg-electric-emerald';
      default: return 'bg-gray-500';
    }
  };
  
  // Format price with commas and decimal points
  const formatPrice = (value) => {
    return new Intl.NumberFormat('el-GR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <motion.div 
      className="group h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
    >
      <Link to={`/coins/${id}`} className="block h-full">
        <div className="relative h-full glass-card overflow-hidden flex flex-col transition-all duration-300 group-hover:shadow-xl">
          {featured && (
            <div className="absolute -right-12 top-5 bg-gradient-to-r from-electric-orange to-coin-gold px-10 py-1 rotate-45 z-10">
              <span className="text-white text-xs font-bold">Προτεινόμενο</span>
            </div>
          )}
          
          {/* Image container */}
          <div className="relative pt-[100%] overflow-hidden bg-gray-200">
            <motion.img
              src={image}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out"
              animate={{ scale: isHovered ? 1.05 : 1 }}
            />
            
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <Badge variant="outline" className={`${getRarityColor()} text-white border-0 font-semibold`}>{rarity}</Badge>
              {isAuction && (
                <Badge variant="outline" className="bg-electric-orange text-white border-0 font-semibold">Δημοπρασία</Badge>
              )}
            </div>
            
            {isAuction && timeLeft && (
              <div className="absolute bottom-3 left-3 bg-black/75 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>{timeLeft}</span>
              </div>
            )}
            
            <motion.div 
              className="absolute inset-0 bg-black/0 transition-all duration-300"
              animate={{ 
                opacity: isHovered ? 1 : 0,
                backgroundColor: isHovered ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0)' 
              }}
            />
          </div>
          
          {/* Content */}
          <div className="p-4 flex-grow flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800 group-hover:text-brand-primary transition-colors text-lg truncate">
                  {name}
                </h3>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{year}</span>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Βαθμός: <span className="font-medium">{grade}</span>
              </p>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <div>
                  {isAuction ? (
                    <div className="text-gray-800">
                      <span className="text-xs text-gray-500">Τρέχουσα προσφορά</span>
                      <p className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-electric-blue">
                        {formatPrice(price)}
                      </p>
                    </div>
                  ) : (
                    <div className="text-gray-800">
                      <span className="text-xs text-gray-500">Τιμή</span>
                      <p className="font-bold text-lg text-brand-primary">{formatPrice(price)}</p>
                    </div>
                  )}
                </div>
                
                <motion.div 
                  className="flex items-center space-x-1 text-xs text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {views !== undefined && (
                    <span className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" /> {views}
                    </span>
                  )}
                  {favorites !== undefined && (
                    <span className="flex items-center ml-2">
                      <Heart className="w-3 h-3 mr-1" /> {favorites}
                    </span>
                  )}
                </motion.div>
              </div>
              
              <motion.div 
                className="mt-3 text-brand-primary font-medium text-sm flex items-center justify-center py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ y: 10 }}
                animate={isHovered ? { y: 0 } : { y: 10 }}
              >
                <span>Προβολή λεπτομερειών</span>
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CoinCard;
