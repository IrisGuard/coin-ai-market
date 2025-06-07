
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Users, TrendingUp } from 'lucide-react';

const trustStats = [
  {
    icon: <Shield className="w-8 h-8" />,
    number: "99.8%",
    label: "Security Rate",
    description: "Bank-level encryption",
    color: "text-green-600"
  },
  {
    icon: <Award className="w-8 h-8" />,
    number: "50K+",
    label: "Coins Verified",
    description: "Expert validation",
    color: "text-blue-600"
  },
  {
    icon: <Users className="w-8 h-8" />,
    number: "25K+",
    label: "Active Users",
    description: "Growing community",
    color: "text-purple-600"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    number: "$2M+",
    label: "Trading Volume",
    description: "Monthly transactions",
    color: "text-orange-600"
  }
];

const testimonials = [
  {
    name: "John Peterson",
    role: "Professional Numismatist",
    comment: "The AI accuracy is remarkable. It identified a rare variety I almost missed.",
    rating: 5
  },
  {
    name: "Sarah Chen",
    role: "Coin Collector",
    comment: "Finally, a platform that combines technology with expertise. Game changer!",
    rating: 5
  },
  {
    name: "Mike Rodriguez",
    role: "Coin Dealer",
    comment: "The market intelligence features have improved my buying decisions significantly.",
    rating: 5
  }
];

const TrustIndicators = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-blue-600">Trusted by </span>
            <span className="text-purple-600">Experts</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Join thousands of collectors, dealers, and numismatists who trust our AI-powered platform
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${stat.color.replace('text-', 'from-')} to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-gray-800 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h3 className="text-3xl font-bold mb-12 text-gray-800">What Experts Say</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <div key={i} className="w-5 h-5 text-yellow-500">⭐</div>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                <div className="text-center">
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustIndicators;
