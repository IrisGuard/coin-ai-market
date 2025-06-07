
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, ShoppingCart, Hammer } from 'lucide-react';

const QuickActionsSection = () => {
  const quickActions = [
    {
      title: 'Browse Coins',
      description: 'Explore our vast marketplace of coins from collectors worldwide',
      icon: <ShoppingCart className="w-8 h-8" />,
      href: '/marketplace',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      title: 'Sell Coins',
      description: 'Upload and sell your coins with AI-powered identification',
      icon: <Camera className="w-8 h-8" />,
      href: '/upload',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      title: 'Live Auctions',
      description: 'Participate in real-time auctions for rare and valuable coins',
      icon: <Hammer className="w-8 h-8" />,
      href: '/auctions',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-blue-600">Get Started </span>
            <span className="text-purple-600">Today</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose your path in the world of numismatics
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                to={action.href}
                className={`block bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group`}
              >
                <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  {action.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {action.description}
                </p>
                <div className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${action.color} ${action.hoverColor} text-white rounded-xl font-semibold transition-all duration-300 group-hover:scale-105`}>
                  Get Started →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickActionsSection;
