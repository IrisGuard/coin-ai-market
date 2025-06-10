
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import AuthForm from '@/components/auth/AuthForm';

const Auth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary via-electric-blue to-brand-accent relative overflow-hidden">
      {/* Navigation */}
      <Navbar />

      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 90, 180],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-white/20 to-brand-accent/30 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.3, 1, 1.3],
            rotate: [180, 90, 0],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 25, repeat: Infinity, delay: 5 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-electric-emerald/30 to-electric-pink/30 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <AuthForm />
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
