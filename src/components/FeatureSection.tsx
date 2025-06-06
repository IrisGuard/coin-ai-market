
import { Camera, Search, DollarSign, Globe, ShoppingCart, CheckCircle, Zap, Shield, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    name: 'AI Coin Recognition',
    description: 'Upload 2-5 images and our AI will identify the coin type, year, grade, and any errors with 99% accuracy.',
    icon: <Camera className="h-8 w-8" />,
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'Real-time Valuation',
    description: 'Get accurate market valuation based on current prices from NGC, PCGS, NumisMaster, and eBay.',
    icon: <DollarSign className="h-8 w-8" />,
    color: 'from-green-500 to-green-600'
  },
  {
    name: 'Global Marketplace',
    description: 'Buy and sell coins with collectors worldwide through secure auctions or direct sales.',
    icon: <ShoppingCart className="h-8 w-8" />,
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: 'Secure Trading',
    description: 'All transactions are protected with advanced encryption and buyer/seller protection.',
    icon: <Shield className="h-8 w-8" />,
    color: 'from-orange-500 to-orange-600'
  },
  {
    name: 'Expert Verification',
    description: 'Professional numismatists verify high-value coins for authenticity and grading.',
    icon: <Award className="h-8 w-8" />,
    color: 'from-red-500 to-red-600'
  },
  {
    name: 'Market Analytics',
    description: 'Track price trends, market movements, and investment opportunities in real-time.',
    icon: <TrendingUp className="h-8 w-8" />,
    color: 'from-cyan-500 to-cyan-600'
  },
];

const FeatureSection = () => {
  return (
    <div className="section-spacing bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto container-padding relative z-10">
        {/* Header with colorful gradient text */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Powered by Advanced Technology
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Our platform combines cutting-edge{' '}
            <span className="font-semibold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              AI image recognition
            </span>
            {' '}with{' '}
            <span className="font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              real-time market data
            </span>
            {' '}to provide the most comprehensive coin identification and trading service available.
          </p>
        </motion.div>

        {/* Features Grid with colorful cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={feature.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-gray-200"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {feature.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section with colorful numbers */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: '50K+', label: 'Coins Analyzed', color: 'from-blue-600 to-blue-700' },
            { number: '99%', label: 'Accuracy Rate', color: 'from-green-500 to-green-600' },
            { number: '25K+', label: 'Active Users', color: 'from-purple-500 to-purple-600' },
            { number: '$2M+', label: 'Trading Volume', color: 'from-orange-500 to-red-500' }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className={`text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FeatureSection;
