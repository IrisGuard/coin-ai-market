
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
      <h2 className="text-4xl md:text-5xl font-bold mb-6">
        <span className="text-blue-600">Powered by </span>
        <span className="text-purple-600">Advanced </span>
        <span className="text-green-600">Technology</span>
      </h2>
      <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
        Our platform combines cutting-edge{' '}
        <span className="font-semibold text-orange-500">
          AI image recognition
        </span>
        {' '}with{' '}
        <span className="font-semibold text-cyan-500">
          real-time market data
        </span>
        {' '}to provide the most comprehensive coin identification and trading service available.
      </p>
    </motion.div>
  );
};

export default FeatureSectionHeader;
