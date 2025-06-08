
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Star, Globe, Coins } from 'lucide-react';

interface CategoryHeaderProps {
  category: string;
  title: string;
  description: string;
  coinCount: number;
  isLoading: boolean;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  category,
  title,
  description,
  coinCount,
  isLoading
}) => {
  const getCategoryIcon = (cat: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      'ancient': Clock,
      'modern': TrendingUp,
      'trending': Star,
      'european': Globe,
      'american': Globe,
      'asian': Globe,
      'auctions': TrendingUp,
      'default': Coins
    };
    const IconComponent = icons[cat] || icons.default;
    return <IconComponent className="w-6 h-6" />;
  };

  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      'ancient': 'from-amber-500 to-orange-600',
      'modern': 'from-blue-500 to-cyan-600',
      'error': 'from-red-500 to-pink-600',
      'graded': 'from-green-500 to-emerald-600',
      'trending': 'from-purple-500 to-indigo-600',
      'european': 'from-blue-600 to-purple-700',
      'american': 'from-red-600 to-blue-700',
      'asian': 'from-yellow-500 to-red-600',
      'gold': 'from-yellow-400 to-amber-500',
      'silver': 'from-gray-400 to-gray-600',
      'rare': 'from-purple-600 to-pink-700',
      'auctions': 'from-orange-500 to-red-600'
    };
    return colors[cat] || 'from-electric-blue to-electric-purple';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden"
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(category)} opacity-10`} />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${getCategoryColor(category)} text-white shadow-lg`}>
            {getCategoryIcon(category)}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                {isLoading ? 'Loading...' : `${coinCount} coins`}
              </Badge>
              <Badge className={`bg-gradient-to-r ${getCategoryColor(category)} text-white border-0`}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
        
        <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default CategoryHeader;
