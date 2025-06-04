
import { ArrowRight, Camera, Search, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="coin-section bg-gradient-to-br from-coin-blue via-coin-purple to-coin-skyblue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Discover the Value of Your <span className="text-coin-gold">Coins</span>
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Upload a photo and let our AI instantly identify your coin, estimate its value, 
              and connect you with collectors worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/upload" className="coin-button inline-flex items-center justify-center">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Coin
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/marketplace" className="coin-button-outline inline-flex items-center justify-center">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Market
                </Link>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="glassmorphism p-8 rounded-2xl">
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 bg-coin-gold rounded-full flex items-center justify-center">
                  <Camera className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold text-center mb-4 text-white">
                AI-Powered Recognition
              </h3>
              <p className="text-center text-white/80">
                Our advanced AI can identify over 50,000 coins from around the world with 95% accuracy.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-coin-gold">50K+</div>
                  <div className="text-sm text-white/70">Coins in Database</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-coin-gold">95%</div>
                  <div className="text-sm text-white/70">Accuracy Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-coin-gold">&lt;3s</div>
                  <div className="text-sm text-white/70">Analysis Time</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
