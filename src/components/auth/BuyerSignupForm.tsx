
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BuyerSignupFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const BuyerSignupForm = ({ isOpen, onClose }: BuyerSignupFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    username: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!signupData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!signupData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!signupData.email) {
      newErrors.email = 'Email is required';
    }

    if (!signupData.password) {
      newErrors.password = 'Password is required';
    } else if (signupData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: signupData.fullName,
            name: signupData.fullName,
            username: signupData.username,
            role: 'buyer'
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Welcome to CoinAI!",
        description: "Please check your email to confirm your account.",
      });
      
      onClose();
      
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup Failed",
        description: error.message || 'An error occurred during signup',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
              Join as Buyer
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Start buying coins from verified dealers worldwide
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Input
                    placeholder="Full Name"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                    className={errors.fullName ? 'border-red-300' : ''}
                  />
                  {errors.fullName && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle size={14} />
                      <span>{errors.fullName}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <Input
                    placeholder="Username"
                    value={signupData.username}
                    onChange={(e) => setSignupData(prev => ({ ...prev, username: e.target.value }))}
                    className={errors.username ? 'border-red-300' : ''}
                  />
                  {errors.username && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle size={14} />
                      <span>{errors.username}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={signupData.email}
                  onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                  className={errors.email ? 'border-red-300' : ''}
                />
                {errors.email && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle size={14} />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={signupData.password}
                    onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                    className={errors.password ? 'border-red-300 pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle size={14} />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={errors.confirmPassword ? 'border-red-300 pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle size={14} />
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-electric-blue to-electric-purple hover:from-electric-purple hover:to-electric-pink"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Join as Buyer'
                )}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={onClose}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BuyerSignupForm;
