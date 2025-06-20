
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AICapabilitiesShowcase from '@/components/showcase/AICapabilitiesShowcase';
import { Brain, Sparkles } from 'lucide-react';

const AIFeatures = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200 mb-6">
              <Brain className="w-5 h-5 mr-3 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">AI-Powered Technology</span>
              <Sparkles className="w-4 h-4 ml-3 text-purple-600" />
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Advanced AI Features
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our cutting-edge artificial intelligence transforms coin identification, 
              grading, and valuation with unprecedented accuracy and speed.
            </p>
          </motion.div>
        </div>
      </div>

      {/* AI Components */}
      <AICapabilitiesShowcase />
      
      <Footer />
    </div>
  );
};

export default AIFeatures;
