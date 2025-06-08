
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Coins, 
  Clock, 
  TrendingUp, 
  Star, 
  Globe, 
  Zap,
  Shield,
  Award,
  Target,
  Sparkles,
  Eye,
  ArrowRight
} from 'lucide-react';

interface CategoryData {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  count: number;
  trending?: boolean;
  featured?: boolean;
  gradient: string;
  hoverGradient: string;
  bgColor: string;
}

const categories: CategoryData[] = [
  {
    id: 'ancient',
    title: 'Ancient Coins',
    description: 'Discover coins from ancient civilizations and empires',
    icon: Clock,
    count: 1247,
    trending: true,
    gradient: 'from-amber-500 to-orange-600',
    hoverGradient: 'from-amber-600 to-orange-700',
    bgColor: 'bg-amber-50'
  },
  {
    id: 'modern',
    title: 'Modern Coins',
    description: 'Contemporary coins from 1900 onwards',
    icon: TrendingUp,
    count: 3891,
    featured: true,
    gradient: 'from-blue-500 to-cyan-600',
    hoverGradient: 'from-blue-600 to-cyan-700',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'error',
    title: 'Error Coins',
    description: 'Rare minting mistakes and production errors',
    icon: Zap,
    count: 567,
    trending: true,
    gradient: 'from-red-500 to-pink-600',
    hoverGradient: 'from-red-600 to-pink-700',
    bgColor: 'bg-red-50'
  },
  {
    id: 'graded',
    title: 'Graded Coins',
    description: 'Professionally authenticated and graded coins',
    icon: Shield,
    count: 2134,
    featured: true,
    gradient: 'from-green-500 to-emerald-600',
    hoverGradient: 'from-green-600 to-emerald-700',
    bgColor: 'bg-green-50'
  },
  {
    id: 'rare',
    title: 'Rare Coins',
    description: 'Exceptionally rare and valuable collectibles',
    icon: Award,
    count: 892,
    gradient: 'from-purple-500 to-indigo-600',
    hoverGradient: 'from-purple-600 to-indigo-700',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'trending',
    title: 'Trending Now',
    description: 'Popular coins gaining collector interest',
    icon: Star,
    count: 445,
    trending: true,
    gradient: 'from-yellow-500 to-amber-600',
    hoverGradient: 'from-yellow-600 to-amber-700',
    bgColor: 'bg-yellow-50'
  }
];

const EnhancedCategoriesGrid: React.FC = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Explore by Category
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover authentic coins from every era and region, carefully categorized for collectors of all levels
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onHoverStart={() => setHoveredCategory(category.id)}
            onHoverEnd={() => setHoveredCategory(null)}
          >
            <Link to={`/category/${category.id}`} className="block">
              <Card className={`h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 overflow-hidden ${category.bgColor}`}>
                <CardContent className="p-0 relative">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    hoveredCategory === category.id ? category.hoverGradient : category.gradient
                  } opacity-10 transition-all duration-300`} />
                  
                  <div className="relative p-6">
                    {/* Header with Icon and Badges */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${category.gradient} text-white shadow-lg`}>
                        <category.icon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex gap-2">
                        {category.trending && (
                          <Badge className="bg-electric-red/10 text-electric-red border-electric-red/20 text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                        {category.featured && (
                          <Badge className="bg-electric-purple/10 text-electric-purple border-electric-purple/20 text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {category.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {category.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Coins className="w-4 h-4 text-electric-blue" />
                          <span className="font-medium text-gray-700">
                            {category.count.toLocaleString()} coins
                          </span>
                        </div>

                        <motion.div
                          animate={{ x: hoveredCategory === category.id ? 5 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-1 text-electric-blue font-medium text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Explore
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredCategory === category.id ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-5`}
                  />
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center pt-8"
      >
        <Link 
          to="/marketplace"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-electric-blue to-electric-purple text-white rounded-lg hover:from-electric-purple hover:to-electric-pink transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
        >
          <Globe className="w-5 h-5" />
          View All Categories
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
};

export default EnhancedCategoriesGrid;
