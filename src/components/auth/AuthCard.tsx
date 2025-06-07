
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from './LoginForm';
import SocialLogin from './SocialLogin';
import { motion } from 'framer-motion';

const AuthCard = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  // Check URL params for mode
  const urlParams = new URLSearchParams(location.search);
  const mode = urlParams.get('mode');
  
  // Set initial state based on URL
  useState(() => {
    if (mode === 'signup') {
      setIsLogin(false);
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50"
    >
      <div className="p-6 sm:p-8">
        <div className="text-center mb-8">
          <motion.h1 
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-serif font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent mb-2"
          >
            {isLogin ? 'Welcome Back' : 'Join CoinVision'}
          </motion.h1>
          <motion.p 
            key={isLogin ? 'login-desc' : 'signup-desc'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-electric-green"
          >
            {isLogin 
              ? 'Sign in to access your collection and continue your coin journey'
              : 'Create your account and start discovering the world of numismatics'
            }
          </motion.p>
        </div>
        
        <LoginForm isLogin={isLogin} setIsLogin={setIsLogin} />
        <SocialLogin />
      </div>
    </motion.div>
  );
};

export default AuthCard;
