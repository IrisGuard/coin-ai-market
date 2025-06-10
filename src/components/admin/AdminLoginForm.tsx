import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Crown, User, ArrowRight, Mail, Lock, Eye, EyeOff, Loader2, AtSign } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSetupForm from './AdminSetupForm';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLoginFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminLoginForm = ({ isOpen, onClose }: AdminLoginFormProps) => {
  const [showSetupForm, setShowSetupForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin, isAdminAuthenticated } = useAdmin();
  const { user, isAuthenticated, login, signup } = useAuth();
  const navigate = useNavigate();

  const handleClose = () => {
    setShowSetupForm(false);
    setEmail('');
    setPassword('');
    setName('');
    setUsername('');
    setIsSubmitting(false);
    onClose();
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, { fullName: name, username });
      }
      // Don't close here - let the useEffect handle the flow
    } catch (error: any) {
      console.error('Auth error:', error);
      setIsSubmitting(false);
    }
  };

  const handleBecomeAdmin = () => {
    setShowSetupForm(true);
  };

  const handleAdminSetupComplete = () => {
    console.log('Admin setup completed, navigating to admin panel');
    setShowSetupForm(false);
    
    // Set admin session with proper timestamp
    localStorage.setItem('adminSession', 'true');
    sessionStorage.setItem('adminSessionTime', Date.now().toString());
    sessionStorage.setItem('adminAuthenticated', 'true');
    
    onClose();
    // Navigate to admin panel after a short delay to ensure modal closes
    setTimeout(() => {
      navigate('/admin');
    }, 100);
  };

  // Handle automatic flow progression
  React.useEffect(() => {
    if (isAuthenticated && !isAdmin && !showSetupForm) {
      // User just logged in, show become admin option
      setIsSubmitting(false);
    }
  }, [isAuthenticated, isAdmin, showSetupForm]);

  // Handle navigation when user becomes admin
  React.useEffect(() => {
    if (isAdminAuthenticated && !showSetupForm) {
      console.log('User is now admin authenticated, closing modal and navigating');
      handleClose();
      setTimeout(() => {
        navigate('/admin');
      }, 100);
    }
  }, [isAdminAuthenticated, showSetupForm, navigate]);

  if (showSetupForm) {
    return (
      <AdminSetupForm 
        isOpen={true} 
        onClose={handleAdminSetupComplete}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center justify-center text-xl">
            <Shield className="h-6 w-6 text-blue-600" />
            Admin Panel Access
          </DialogTitle>
        </DialogHeader>
        
        <AnimatePresence mode="wait">
          {isAdmin ? (
            <motion.div
              key="admin-access"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6"
            >
              <Crown className="h-16 w-16 mx-auto text-yellow-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-2">
                  You already have Admin access!
                </h3>
                <p className="text-sm text-gray-600">
                  You can proceed to the admin panel
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Session will expire after 10 minutes of inactivity
                </p>
              </div>
              <Button 
                onClick={() => {
                  // Set admin session with proper timestamp
                  localStorage.setItem('adminSession', 'true');
                  sessionStorage.setItem('adminSessionTime', Date.now().toString());
                  sessionStorage.setItem('adminAuthenticated', 'true');
                  
                  handleClose();
                  navigate('/admin');
                }}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium"
              >
                Continue to Admin Panel
              </Button>
            </motion.div>
          ) : isAuthenticated ? (
            <motion.div
              key="become-admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6"
            >
              <User className="h-16 w-16 mx-auto text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Become Administrator
                </h3>
                <p className="text-sm text-gray-600">
                  Click below to gain administrator access
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Admin sessions expire after 10 minutes of inactivity
                </p>
              </div>
              
              <Button 
                onClick={handleBecomeAdmin}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium flex items-center justify-center gap-2"
              >
                <Crown className="h-4 w-4" />
                Become Admin
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <Shield className="h-12 w-12 mx-auto text-blue-600 mb-3" />
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 p-1 rounded-lg flex">
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        isLogin 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsLogin(false)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        !isLogin 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {isLogin ? 'Sign in to access admin panel' : 'Create account to become admin'}
                </p>
              </div>
              
              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter username"
                          className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleClose}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !email || !password || (!isLogin && (!name || !username))}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isLogin ? 'Signing In...' : 'Creating Account...'}
                      </>
                    ) : (
                      <>
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginForm;
