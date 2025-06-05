
import { ArrowRight, Camera, Search, Upload, Sparkles, TrendingUp, Users, Star, Zap, CheckCircle, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const features = [
    'Instant AI recognition in under 2 seconds',
    'Professional-grade authentication & grading',
    'Real-time market value estimation',
    'Global marketplace with 50K+ collectors'
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden brand-gradient">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 25, repeat: Infinity, delay: 5 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white/15 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto container-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-8"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 glass-card-dark rounded-full border border-white/30"
            >
              <Sparkles className="w-5 h-5 mr-3 text-coin-gold animate-pulse" />
              <span className="text-sm font-semibold">Powered by Advanced AI Technology</span>
              <Zap className="w-4 h-4 ml-3 text-electric-cyan animate-pulse" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-display leading-tight"
            >
              Discover the{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-coin-gold via-white to-coin-gold">
                True Value
              </span>{' '}
              of Your Coins
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-body-large opacity-95 leading-relaxed max-w-2xl"
            >
              Upload a photo and let CoinVision AI instantly identify your coin, assess its grade, 
              estimate market value, and connect you with collectors worldwide through our premium marketplace.
            </motion.p>

            {/* Features List */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-coin-gold flex-shrink-0" />
                  <span className="text-body text-white/90">{feature}</span>
                </div>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/upload" className="coinvision-button group focus-ring" aria-label="Start coin recognition">
                  <Upload className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                  Start Recognition
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/marketplace" className="coinvision-button-outline group focus-ring" aria-label="Explore coin marketplace">
                  <Search className="mr-3 h-6 w-6" />
                  Explore Marketplace
                </Link>
              </motion.div>
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="grid grid-cols-3 gap-8 pt-8"
            >
              <div className="text-center">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl font-bold text-coin-gold mb-2"
                >
                  500K+
                </motion.div>
                <div className="text-body-small text-white/80 font-medium">Coins Identified</div>
              </div>
              <div className="text-center">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="text-4xl font-bold text-coin-gold mb-2"
                >
                  99.7%
                </motion.div>
                <div className="text-body-small text-white/80 font-medium">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="text-4xl font-bold text-coin-gold mb-2"
                >
                  &lt;2s
                </motion.div>
                <div className="text-body-small text-white/80 font-medium">Analysis Time</div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative lg:justify-self-end"
          >
            <div className="glass-card-dark p-10 rounded-[2rem] backdrop-blur-2xl border-2 border-white/30 shadow-2xl">
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="flex items-center justify-center mb-10"
              >
                <div className="w-40 h-40 bg-gradient-to-br from-coin-gold via-coin-platinum to-white rounded-full flex items-center justify-center shadow-2xl animate-glow">
                  <Camera className="w-20 h-20 text-brand-dark" />
                </div>
              </motion.div>
              
              <h3 className="text-subsection text-center mb-8 text-white">
                Advanced AI Recognition
              </h3>
              
              <p className="text-center text-white/90 mb-10 text-body leading-relaxed">
                Our cutting-edge AI analyzes every detail of your coin with professional-grade precision and accuracy.
              </p>
              
              <div className="space-y-5">
                {[
                  { text: "Real-time image analysis", delay: 0 },
                  { text: "Instant market valuation", delay: 0.5 },
                  { text: "Global marketplace access", delay: 1 }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 + item.delay }}
                    className="flex items-center gap-4 p-4 glass-card-dark rounded-2xl border border-white/10"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: item.delay }}
                      className="w-3 h-3 bg-gradient-to-r from-brand-accent to-electric-cyan rounded-full"
                    />
                    <span className="text-white/90 font-medium text-body">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Enhanced Floating elements */}
            <motion.div 
              animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-coin-gold to-coin-platinum rounded-full shadow-xl"
            />
            <motion.div 
              animate={{ y: [20, -20, 20], rotate: [360, 180, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute -bottom-8 -left-8 w-12 h-12 bg-gradient-to-br from-brand-accent to-electric-pink rounded-full shadow-xl"
            />
            <motion.div 
              animate={{ x: [-10, 10, -10], y: [-5, 5, -5] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute top-1/2 -left-12 w-8 h-8 bg-gradient-to-br from-electric-cyan to-brand-secondary rounded-full shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
