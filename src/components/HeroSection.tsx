
import { ArrowRight, Camera, Search, Upload, Sparkles, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="coin-section bg-gradient-to-br from-vibrant-purple via-vibrant-blue to-vibrant-cyan relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="mesh-bg"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-vibrant-orange/20 rounded-full blur-3xl animate-floating"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-vibrant-pink/20 rounded-full blur-3xl animate-floating" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-vibrant-emerald/20 rounded-full blur-3xl animate-floating" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto container-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 mr-2 text-coin-gold" />
              <span className="text-sm font-medium">AI-Powered Coin Recognition</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
              Discover the{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-coin-gold via-white to-coin-gold animate-gradient-shift bg-[length:200%_auto]">
                True Value
              </span>{' '}
              of Your Coins
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 opacity-90 text-balance leading-relaxed">
              Upload a photo and let our advanced AI instantly identify your coin, estimate its market value, 
              and connect you with collectors worldwide through our premium marketplace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/upload" className="coin-button inline-flex items-center justify-center group">
                  <Upload className="mr-3 h-5 w-5 group-hover:animate-bounce" />
                  Start Recognition
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/marketplace" className="coin-button-outline inline-flex items-center justify-center group">
                  <Search className="mr-3 h-5 w-5" />
                  Explore Marketplace
                </Link>
              </motion.div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-coin-gold">50K+</div>
                <div className="text-sm text-white/80">Coins Identified</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-coin-gold">95%</div>
                <div className="text-sm text-white/80">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-coin-gold">&lt;3s</div>
                <div className="text-sm text-white/80">Analysis Time</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:justify-self-end"
          >
            <div className="glassmorphism p-8 rounded-3xl backdrop-blur-xl border-2 border-white/20 shadow-2xl">
              <div className="flex items-center justify-center mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-coin-gold via-vibrant-orange to-vibrant-pink rounded-full flex items-center justify-center shadow-2xl animate-pulse-glow">
                  <Camera className="w-16 h-16 text-white" />
                </div>
              </div>
              
              <h3 className="text-3xl font-serif font-bold text-center mb-6 text-white">
                Advanced AI Recognition
              </h3>
              
              <p className="text-center text-white/90 mb-8 text-lg">
                Our cutting-edge AI analyzes every detail of your coin with professional-grade precision.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="w-2 h-2 bg-vibrant-emerald rounded-full animate-ping"></div>
                  <span className="text-white/90">Real-time image analysis</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="w-2 h-2 bg-vibrant-cyan rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                  <span className="text-white/90">Instant market valuation</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="w-2 h-2 bg-vibrant-orange rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                  <span className="text-white/90">Global marketplace access</span>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-coin-gold rounded-full animate-floating"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-vibrant-pink rounded-full animate-floating" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 -left-8 w-4 h-4 bg-vibrant-cyan rounded-full animate-floating" style={{animationDelay: '2s'}}></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
