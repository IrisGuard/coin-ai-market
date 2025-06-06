
import React, { useEffect } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthCard from '@/components/auth/AuthCard';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Shield, Clock } from 'lucide-react';

const Login = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect path from state or default
  const from = location.state?.from?.pathname || '/';

  // If already logged in, redirect
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from, loading]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full"></div>
          <span className="text-gray-600">Checking authentication...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          {/* Login Benefits Card */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white border-0 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-center text-lg font-bold">
                  🚀 Join CoinVision AI
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 flex-shrink-0" />
                    <span>AI-powered coin identification</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 flex-shrink-0" />
                    <span>Professional authentication</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>Instant marketplace listing</span>
                  </div>
                </div>
                
                <div className="flex justify-center gap-2 mt-4">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Free Account
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    No Setup Fees
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AuthCard />
          </motion.div>

          {/* Help Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">Need help?</p>
                  <div className="grid gap-2 text-sm">
                    <Link 
                      to="/auth?mode=signup" 
                      className="flex items-center justify-center gap-2 text-brand-primary hover:text-brand-primary/80 transition-colors font-medium"
                    >
                      ✨ Create new account
                    </Link>
                    <Link 
                      to="/reset-password" 
                      className="flex items-center justify-center gap-2 text-gray-600 hover:text-brand-primary transition-colors"
                    >
                      🔒 Forgot password?
                    </Link>
                    <Link 
                      to="/" 
                      className="flex items-center justify-center gap-2 text-gray-600 hover:text-brand-primary transition-colors"
                    >
                      🏠 Back to homepage
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 text-center"
          >
            <p className="text-xs text-gray-500">
              🔐 Your data is protected with enterprise-grade security
            </p>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
