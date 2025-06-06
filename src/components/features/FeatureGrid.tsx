
import { Camera, DollarSign, ShoppingCart, Shield, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import FeatureCard from './FeatureCard';

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

const FeatureGrid = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
    >
      {features.map((feature, index) => (
        <FeatureCard
          key={feature.name}
          name={feature.name}
          description={feature.description}
          icon={feature.icon}
          color={feature.color}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default FeatureGrid;
