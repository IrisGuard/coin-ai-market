
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Zap, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden">
      {/* Subtle white background with minimal gradients */}
      <div className="absolute inset-0 bg-white"></div>
      
      {/* Very subtle floating elements - much more transparent */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-5 blur-xl"
      />
      <motion.div 
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-32 right-32 w-40 h-40 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-5 blur-xl"
      />
      <motion.div 
        animate={{ 
          y: [-10, 10, -10],
          x: [-5, 5, -5]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-5 blur-lg"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Main heading with colorful gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              AI-Powered
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Coin Recognition
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Upload photos of your coins and get instant{' '}
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              AI identification
            </span>
            , accurate{' '}
            <span className="font-semibold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              valuations
            </span>
            , and access to a global{' '}
            <span className="font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              marketplace
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Link 
              to="/upload" 
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
            >
              <Camera className="w-6 h-6" />
              Start Identifying Coins
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-2"
              >
                →
              </motion.div>
            </Link>
            
            <Link 
              to="/marketplace" 
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:border-purple-500 hover:text-purple-600 transition-all duration-300 hover:shadow-lg flex items-center gap-3"
            >
              <TrendingUp className="w-6 h-6" />
              Explore Marketplace
            </Link>
          </motion.div>

          {/* Feature highlights with white backgrounds */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Instant Recognition',
                description: '99% accuracy in seconds',
                color: 'from-yellow-500 to-orange-500'
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Real-time Pricing',
                description: 'Live market valuations',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Secure Trading',
                description: 'Protected transactions',
                color: 'from-blue-500 to-cyan-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
