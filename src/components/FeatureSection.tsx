
import { Camera, Search, DollarSign, Globe, ShoppingCart, CheckCircle, Zap, Shield, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    name: 'AI Coin Recognition',
    description: 'Upload 2-5 images and our AI will identify the coin type, year, grade, and any errors with 99% accuracy.',
    icon: <Camera className="h-8 w-8" />,
    color: 'from-electric-blue to-brand-primary'
  },
  {
    name: 'Real-time Valuation',
    description: 'Get accurate market valuation based on current prices from NGC, PCGS, NumisMaster, and eBay.',
    icon: <DollarSign className="h-8 w-8" />,
    color: 'from-coin-gold to-electric-orange'
  },
  {
    name: 'Global Marketplace',
    description: 'Buy and sell coins with collectors worldwide through secure auctions or direct sales.',
    icon: <ShoppingCart className="h-8 w-8" />,
    color: 'from-brand-accent to-electric-pink'
  },
  {
    name: 'Secure Trading',
    description: 'All transactions are protected with advanced encryption and buyer/seller protection.',
    icon: <Shield className="h-8 w-8" />,
    color: 'from-electric-emerald to-electric-teal'
  },
  {
    name: 'Expert Verification',
    description: 'Professional numismatists verify high-value coins for authenticity and grading.',
    icon: <Award className="h-8 w-8" />,
    color: 'from-electric-purple to-electric-indigo'
  },
  {
    name: 'Market Analytics',
    description: 'Track price trends, market movements, and investment opportunities in real-time.',
    icon: <TrendingUp className="h-8 w-8" />,
    color: 'from-electric-cyan to-electric-blue'
  },
];

const steps = [
  {
    step: 1,
    title: 'Upload Photos',
    description: 'Take clear photos of your coin from multiple angles',
    icon: <Camera className="h-6 w-6" />
  },
  {
    step: 2,
    title: 'AI Analysis',
    description: 'Our AI instantly identifies and evaluates your coin',
    icon: <Zap className="h-6 w-6" />
  },
  {
    step: 3,
    title: 'Get Valuation',
    description: 'Receive detailed information and market value',
    icon: <DollarSign className="h-6 w-6" />
  },
  {
    step: 4,
    title: 'List or Trade',
    description: 'Connect with buyers or add to your collection',
    icon: <ShoppingCart className="h-6 w-6" />
  },
];

const FeatureSection = () => {
  return (
    <div className="section-spacing bg-gradient-to-br from-brand-light via-white to-brand-light relative overflow-hidden">
      <div className="mesh-bg"></div>
      
      <div className="max-w-7xl mx-auto container-padding relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="section-title mb-6">Powered by Advanced Technology</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our platform combines cutting-edge AI image recognition with real-time market data to provide 
            the most comprehensive coin identification and trading service available.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={feature.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="feature-card group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 text-white shadow-xl group-hover:shadow-2xl transition-all duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.name}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* How It Works Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass-card rounded-[3rem] overflow-hidden shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 lg:p-16 flex flex-col justify-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="uppercase tracking-wider text-sm text-brand-primary font-bold mb-4"
              >
                How It Works
              </motion.div>
              <motion.h3 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight"
              >
                Simple Process, Powerful Results
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-xl text-gray-600 mb-10 leading-relaxed"
              >
                Our AI-driven platform makes coin identification, valuation, and trading accessible to everyone, 
                from beginners to professional collectors.
              </motion.p>
              
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <motion.div 
                    key={step.step}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/50 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-brand-primary to-electric-blue rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="relative bg-gradient-to-br from-brand-primary via-electric-blue to-brand-accent flex items-center justify-center p-12">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img 
                  className="w-full max-w-md rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                  src="https://images.unsplash.com/photo-1620428268482-cf1851a36764?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Coin collecting showcase" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/20 to-transparent rounded-3xl"></div>
              </motion.div>
              
              {/* Floating elements */}
              <motion.div 
                animate={{ y: [-10, 10, -10], rotate: [0, 180, 360] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-8 right-8 w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center"
              >
                <Zap className="w-10 h-10 text-white" />
              </motion.div>
              
              <motion.div 
                animate={{ y: [10, -10, 10], rotate: [360, 180, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute bottom-8 left-8 w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center"
              >
                <Award className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
        >
          {[
            { number: '50K+', label: 'Coins Analyzed', color: 'text-brand-primary' },
            { number: '99%', label: 'Accuracy Rate', color: 'text-electric-emerald' },
            { number: '25K+', label: 'Active Users', color: 'text-brand-accent' },
            { number: '$2M+', label: 'Trading Volume', color: 'text-coin-gold' }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center stats-card"
            >
              <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FeatureSection;
