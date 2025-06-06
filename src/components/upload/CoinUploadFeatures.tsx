
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Zap, TrendingUp } from 'lucide-react';

const CoinUploadFeatures = () => {
  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: 'Multi-Image Upload',
      description: 'Upload up to 5 high-quality photos from different angles',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'AI Analysis',
      description: 'Automatic identification and market valuation',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Smart Pricing',
      description: 'Get optimal pricing recommendations based on market data',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
    >
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 hover:bg-white/80 transition-all duration-300 text-center"
        >
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 text-white shadow-xl mx-auto`}>
            {feature.icon}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CoinUploadFeatures;
