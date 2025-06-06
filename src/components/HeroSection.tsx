
import { ArrowRight, Camera, Search, Upload, Sparkles, TrendingUp, Users, Star, Zap, CheckCircle, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const features = [
    'Instant AI coin identification in seconds',
    'Professional authentication & grading',
    'Real-time market value estimates',
    'Connect with verified collectors worldwide'
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-blue-50 to-yellow-50">
      {/* Enhanced background elements with colorful gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-blue/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 25, repeat: Infinity, delay: 5 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-electric-orange/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -180, -360],
            opacity: [0.15, 0.35, 0.15]
          }}
          transition={{ duration: 30, repeat: Infinity, delay: 10 }}
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-electric-emerald/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto container-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-gray-900 space-y-8"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 glass-card rounded-full border border-electric-blue/30"
            >
              <Sparkles className="w-5 h-5 mr-3 text-electric-yellow animate-pulse" />
              <span className="text-sm font-semibold text-electric-blue">AI-Powered Coin Recognition</span>
              <Zap className="w-4 h-4 ml-3 text-electric-orange animate-pulse" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-display leading-tight"
            >
              Discover Your{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric-blue via-electric-yellow to-electric-orange">
                Coin's True Value
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-body-large text-gray-700 leading-relaxed max-w-2xl"
            >
              Upload a photo and let our advanced AI instantly identify your coin, assess its condition, 
              estimate market value, and connect you with collectors worldwide through our trusted marketplace.
            </motion.p>

            {/* Features List with colorful icons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className={`w-5 h-5 flex-shrink-0 ${
                    index % 4 === 0 ? 'text-electric-blue' :
                    index % 4 === 1 ? 'text-electric-green' :
                    index % 4 === 2 ? 'text-electric-orange' : 'text-electric-yellow'
                  }`} />
                  <span className="text-body text-gray-700">{feature}</span>
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
                  Get Started
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/marketplace" className="coinvision-button-outline group focus-ring" aria-label="Explore coin marketplace">
                  <Search className="mr-3 h-6 w-6" />
                  Browse Marketplace
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Indicators with colorful numbers */}
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
                  className="text-4xl font-bold text-electric-blue mb-2"
                >
                  500K+
                </motion.div>
                <div className="text-body-small text-gray-600 font-medium">Coins Identified</div>
              </div>
              <div className="text-center">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="text-4xl font-bold text-electric-green mb-2"
                >
                  99.7%
                </motion.div>
                <div className="text-body-small text-gray-600 font-medium">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="text-4xl font-bold text-electric-orange mb-2"
                >
                  &lt;2s
                </motion.div>
                <div className="text-body-small text-gray-600 font-medium">Analysis Time</div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative lg:justify-self-end"
          >
            <div className="glass-card p-10 rounded-[2rem] backdrop-blur-2xl border-2 border-electric-blue/30 shadow-2xl">
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="flex items-center justify-center mb-10"
              >
                <div className="w-40 h-40 bg-gradient-to-br from-electric-blue via-electric-yellow to-electric-orange rounded-full flex items-center justify-center shadow-2xl animate-glow">
                  <Camera className="w-20 h-20 text-white" />
                </div>
              </motion.div>
              
              <h3 className="text-subsection text-center mb-8 text-gray-900">
                Advanced AI Recognition
              </h3>
              
              <p className="text-center text-gray-700 mb-10 text-body leading-relaxed">
                Our cutting-edge AI analyzes every detail of your coin with professional-grade precision.
              </p>
              
              <div className="space-y-5">
                {[
                  { text: "Instant identification", delay: 0, color: "electric-blue" },
                  { text: "Market value estimation", delay: 0.5, color: "electric-green" },
                  { text: "Global marketplace access", delay: 1, color: "electric-orange" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 + item.delay }}
                    className="flex items-center gap-4 p-4 glass-card rounded-2xl border border-gray-200"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: item.delay }}
                      className={`w-3 h-3 bg-${item.color} rounded-full`}
                    />
                    <span className="text-gray-700 font-medium text-body">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Floating colorful elements */}
            <motion.div 
              animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-electric-yellow to-electric-orange rounded-full shadow-xl"
            />
            <motion.div 
              animate={{ y: [20, -20, 20], rotate: [360, 180, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute -bottom-8 -left-8 w-12 h-12 bg-gradient-to-br from-electric-green to-electric-blue rounded-full shadow-xl"
            />
            <motion.div 
              animate={{ x: [-10, 10, -10], y: [-5, 5, -5] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute top-1/2 -left-12 w-8 h-8 bg-gradient-to-br from-electric-orange to-electric-yellow rounded-full shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
