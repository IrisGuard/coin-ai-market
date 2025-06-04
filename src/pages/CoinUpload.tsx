
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CoinUploadForm from '@/components/upload/CoinUploadForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Upload, Zap, Camera, TrendingUp } from 'lucide-react';

const CoinUpload = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-light">
      <Navbar />
      
      <div className="relative overflow-hidden">
        <div className="mesh-bg"></div>
        
        <div className="max-w-7xl mx-auto container-padding section-spacing relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 glass-card rounded-full border border-brand-primary/20 mb-6">
              <Zap className="w-5 h-5 mr-3 text-brand-primary animate-pulse" />
              <span className="text-sm font-semibold text-brand-primary">AI-Powered Recognition</span>
            </div>
            
            <h1 className="section-title mb-6">
              Upload Your Coin
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get instant AI-powered identification, valuation, and market insights for your coins. 
              Our advanced technology analyzes every detail with professional precision.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {[
              {
                icon: <Camera className="w-8 h-8" />,
                title: 'Multi-Angle Analysis',
                description: 'Upload 2-5 photos from different angles for comprehensive analysis',
                color: 'from-electric-blue to-brand-primary'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Instant Results',
                description: 'Get identification and valuation results in under 3 seconds',
                color: 'from-electric-emerald to-electric-teal'
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Market Insights',
                description: 'Receive current market trends and investment potential analysis',
                color: 'from-brand-accent to-electric-pink'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
                className="feature-card text-center"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 text-white shadow-xl mx-auto`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Upload Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <div className="glass-card p-8 md:p-12 rounded-3xl border-2 border-white/30 shadow-2xl">
              <CoinUploadForm />
            </div>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16"
          >
            <div className="glass-card p-8 rounded-3xl border border-brand-primary/20">
              <h3 className="text-2xl font-bold gradient-text mb-6 text-center">
                Tips for Best Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  'Use good lighting conditions',
                  'Keep camera steady and focused',
                  'Include both sides of the coin',
                  'Avoid shadows and reflections'
                ].map((tip, index) => (
                  <div key={tip} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-brand-primary to-electric-blue flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 font-medium">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CoinUpload;
