
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Eye, TrendingUp, Shield, Zap, Target } from 'lucide-react';

const capabilities = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI Brain Recognition",
    description: "Advanced neural networks identify coins with 99.2% accuracy",
    stats: "50K+ coins analyzed",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Eye className="w-8 h-8" />,
    title: "Computer Vision",
    description: "Multi-angle analysis detects mint errors and varieties",
    stats: "15+ detection algorithms",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Market Intelligence",
    description: "Real-time pricing from multiple auction houses",
    stats: "$2M+ data processed",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Authentication AI",
    description: "Detect counterfeits and altered coins instantly",
    stats: "99.8% accuracy rate",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Instant Processing",
    description: "Get results in under 3 seconds",
    stats: "< 3sec response time",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Grade Estimation",
    description: "Professional grade estimates matching PCGS/NGC",
    stats: "±1 grade accuracy",
    color: "from-indigo-500 to-purple-500"
  }
];

const AICapabilitiesShowcase = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-blue-600">AI-Powered </span>
            <span className="text-purple-600">Capabilities</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Our advanced artificial intelligence combines computer vision, machine learning, 
            and market intelligence to provide the most comprehensive coin analysis available.
          </p>
          
          {/* Live Stats Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center bg-white px-6 py-3 rounded-full shadow-lg border border-gray-200"
          >
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">Live</div>
                <div className="text-sm text-gray-500">System Status</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">99.2%</div>
                <div className="text-sm text-gray-500">Accuracy</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">2.8s</div>
                <div className="text-sm text-gray-500">Avg Response</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${capability.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 mb-6`}>
                {capability.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {capability.title}
              </h3>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {capability.description}
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-semibold text-gray-700">Performance:</div>
                <div className="text-lg font-bold text-blue-600">{capability.stats}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AICapabilitiesShowcase;
