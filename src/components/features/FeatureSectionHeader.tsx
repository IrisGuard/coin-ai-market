
import { motion } from 'framer-motion';

const FeatureSectionHeader = () => {
  return (
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
  );
};

export default FeatureSectionHeader;
