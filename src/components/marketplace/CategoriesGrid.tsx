
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Coins, Clock, Star, Globe, TrendingUp, Shield } from 'lucide-react';

const categories = [
  {
    name: 'Ancient Coins',
    icon: <Globe className="w-8 h-8" />,
    count: '245',
    color: 'from-amber-500 to-orange-600',
    href: '/marketplace?category=ancient'
  },
  {
    name: 'Modern Coins',
    icon: <Coins className="w-8 h-8" />,
    count: '1,245',
    color: 'from-blue-500 to-blue-600',
    href: '/marketplace?category=modern'
  },
  {
    name: 'Error Coins',
    icon: <Star className="w-8 h-8" />,
    count: '89',
    color: 'from-purple-500 to-purple-600',
    href: '/marketplace?category=error'
  },
  {
    name: 'Live Auctions',
    icon: <Clock className="w-8 h-8" />,
    count: '126',
    color: 'from-red-500 to-red-600',
    href: '/marketplace?auctions=true'
  },
  {
    name: 'Graded Coins',
    icon: <Shield className="w-8 h-8" />,
    count: '567',
    color: 'from-green-500 to-green-600',
    href: '/marketplace?graded=true'
  },
  {
    name: 'Trending',
    icon: <TrendingUp className="w-8 h-8" />,
    count: '89',
    color: 'from-pink-500 to-pink-600',
    href: '/marketplace?trending=true'
  }
];

const CategoriesGrid = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Shop by Category
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link
              to={category.href}
              className="group block p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600">
                {category.count} items
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesGrid;
