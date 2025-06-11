
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import InputField from './InputField';

const SignupTab: React.FC = () => {
  const { toast } = useToast();
  const { signUp } = useAuth();
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateSignup = () => {
    const newErrors: Record<string, string> = {};

    if (!signupData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!signupData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (signupData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!signupData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(signupData.email)) {
      newErrors.email = 'Please enter a valid email';
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
    if (!validateSignup()) return;
    
    setIsLoading(true);
    try {
      const { error } = await signUp(signupData.email, signupData.password, {
        fullName: signupData.fullName,
        username: signupData.username
      });
      
      if (error) throw error;
      
      toast({
        title: "Welcome to CoinAI!",
        description: "Please check your email to confirm your account. Create your store, upload your first coin and start selling globally!",
      });
      
      // Reset form
      setSignupData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        username: ''
      });
      
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

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="signup-fullname"
          type="text"
          icon={User}
          placeholder="Full Name"
          value={signupData.fullName}
          onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
          error={errors.fullName}
        />
        <InputField
          id="signup-username"
          type="text"
          icon={User}
          placeholder="Username"
          value={signupData.username}
          onChange={(e) => setSignupData(prev => ({ ...prev, username: e.target.value }))}
          error={errors.username}
        />
      </div>
      
      <InputField
        id="signup-email"
        type="email"
        icon={Mail}
        placeholder="your@email.com"
        value={signupData.email}
        onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
        error={errors.email}
      />
      
      <InputField
        id="signup-password"
        type={showPassword ? "text" : "password"}
        icon={Lock}
        placeholder="••••••••"
        value={signupData.password}
        onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
        error={errors.password}
        showPasswordToggle={true}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
      />
      
      <InputField
        id="signup-confirm-password"
        type={showConfirmPassword ? "text" : "password"}
        icon={Lock}
        placeholder="Confirm password"
        value={signupData.confirmPassword}
        onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
        error={errors.confirmPassword}
        showPasswordToggle={true}
        showPassword={showConfirmPassword}
        onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
      />
      
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
          'Create Account'
        )}
      </Button>
    </form>
  );
};

export default SignupTab;
