
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Award, Shield, DollarSign } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      title: 'AI Coin Identification',
      description: 'Upload photos and get instant AI-powered identification with 99% accuracy',
      icon: <Camera className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Professional Grading',
      description: 'Expert numismatists grade your coins according to industry standards',
      icon: <Award className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Authentication Services',
      description: 'Verify authenticity with advanced imaging and expert analysis',
      icon: <Shield className="w-8 h-8" />,
      color: 'from-purple-500 to-violet-500'
    },
    {
      title: 'Market Valuation',
      description: 'Get real-time market values based on current auction and sales data',
      icon: <DollarSign className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-green-600">Professional </span>
            <span className="text-orange-500">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert numismatic services powered by cutting-edge technology
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
