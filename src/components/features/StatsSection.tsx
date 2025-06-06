
import { motion } from 'framer-motion';

const stats = [
  { number: '50K+', label: 'Coins Analyzed', color: 'text-blue-600' },
  { number: '99%', label: 'Accuracy Rate', color: 'text-green-500' },
  { number: '25K+', label: 'Active Users', color: 'text-purple-500' },
  { number: '$2M+', label: 'Trading Volume', color: 'text-orange-500' }
];

const StatsSection = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
      className="grid grid-cols-2 md:grid-cols-4 gap-8"
    >
      {stats.map((stat, index) => (
        <motion.div 
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="text-center bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
        >
          <div className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}>
            {stat.number}
          </div>
          <div className="text-gray-600 font-medium">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsSection;
