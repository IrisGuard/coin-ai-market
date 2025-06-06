
import { motion } from 'framer-motion';

interface FeatureCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  index: number;
}

const FeatureCard = ({ name, description, icon, color, index }: FeatureCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-gray-200"
    >
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
        {name}
      </h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
