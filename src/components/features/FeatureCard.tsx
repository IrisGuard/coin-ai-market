
import { motion } from 'framer-motion';

interface FeatureCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  index: number;
}

const FeatureCard = ({ name, description, icon, color, index }: FeatureCardProps) => {
  // Map colors to text colors for better readability
  const getTextColor = (color: string) => {
    if (color.includes('blue')) return 'text-blue-700';
    if (color.includes('green')) return 'text-green-700';
    if (color.includes('purple')) return 'text-purple-700';
    if (color.includes('orange')) return 'text-orange-700';
    if (color.includes('red')) return 'text-red-700';
    if (color.includes('cyan')) return 'text-cyan-700';
    return 'text-gray-700';
  };

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
      <h3 className={`text-2xl font-bold mb-4 ${getTextColor(color)}`}>
        {name}
      </h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
