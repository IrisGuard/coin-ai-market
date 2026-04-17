import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import AuthForm from '@/components/auth/AuthForm';

const Auth = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 14, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] rounded-full bg-primary/15 blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1.15, 1, 1.15], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 18, repeat: Infinity, delay: 4 }}
          className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] rounded-full bg-accent/15 blur-[140px]"
        />
      </div>

      <div className="relative z-10 grid place-items-center min-h-[calc(100vh-4rem)] container-padding pt-12 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <AuthForm />
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
