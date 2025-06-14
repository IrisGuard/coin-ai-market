
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Zap, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden">
      {/* Pure white background */}
      <div className="absolute inset-0 bg-white"></div>
      
      {/* Very subtle floating elements - much more transparent */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-electric-blue to-electric-purple rounded-full opacity-5 blur-xl"
      />
      <motion.div 
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-32 right-32 w-40 h-40 bg-gradient-to-br from-electric-green to-electric-blue rounded-full opacity-5 blur-xl"
      />
      <motion.div 
        animate={{ 
          y: [-10, 10, -10],
          x: [-5, 5, -5]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-br from-electric-orange to-electric-red rounded-full opacity-5 blur-lg"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Main heading with logo-based blue/purple colors */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
          >
            <span className="text-electric-blue">
              AI-Powered
            </span>
            <br />
            <span className="text-electric-purple">
              Coin Recognition
            </span>
          </motion.h1>

          {/* Subtitle with dark gray instead of black */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Upload photos of your coins and get instant{' '}
            <span className="font-semibold text-electric-blue">
              AI identification
            </span>
            , accurate{' '}
            <span className="font-semibold text-electric-green">
              valuations
            </span>
            , and access to a global{' '}
            <span className="font-semibold text-electric-purple">
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
              className="group relative px-8 py-4 bg-gradient-to-r from-electric-blue to-electric-purple text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
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
              className="px-8 py-4 border-2 border-electric-purple text-electric-purple rounded-xl font-semibold text-lg hover:border-electric-blue hover:text-electric-blue transition-all duration-300 hover:shadow-lg flex items-center gap-3"
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
                color: 'from-electric-orange to-electric-red',
                textColor: 'text-electric-orange'
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Real-time Pricing',
                description: 'Live market valuations',
                color: 'from-electric-green to-electric-emerald',
                textColor: 'text-electric-green'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Secure Trading',
                description: 'Protected transactions',
                color: 'from-electric-blue to-electric-cyan',
                textColor: 'text-electric-blue'
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
                <h3 className={`text-xl font-bold mb-2 ${feature.textColor}`}>
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
