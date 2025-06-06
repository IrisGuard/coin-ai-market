
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, User, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginFormProps {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
}

const LoginForm = ({ isLogin, setIsLogin }: LoginFormProps) => {
  const { toast } = useToast();
  const { login, signup, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!name.trim()) {
        newErrors.name = 'Full name is required';
      }
      if (!username.trim()) {
        newErrors.username = 'Username is required';
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Form Validation Failed",
        description: "Please fix the errors and try again.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      if (isLogin) {
        await login(email, password);
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } else {
        await signup(email, password, {
          fullName: name,
          username: username
        });
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and confirm your account before signing in.';
      } else if (error.message?.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Try signing in instead.';
      } else if (error.message?.includes('Password should be at least 6 characters')) {
        errorMessage = 'Password must be at least 6 characters long.';
      }
      
      toast({
        title: isLogin ? "Sign In Failed" : "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ 
    id, 
    type, 
    icon: Icon, 
    placeholder, 
    value, 
    onChange, 
    error,
    showPasswordToggle = false,
    showPassword = false,
    onTogglePassword = () => {}
  }: {
    id: string;
    type: string;
    icon: any;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    showPasswordToggle?: boolean;
    showPassword?: boolean;
    onTogglePassword?: () => void;
  }) => (
    <div className="space-y-1">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon size={16} className={`${error ? 'text-red-400' : 'text-gray-400'}`} />
        </div>
        <input
          id={id}
          type={type}
          className={`w-full pl-10 ${showPasswordToggle ? 'pr-10' : 'pr-3'} py-3 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors ${
            error 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300 bg-white hover:border-gray-400 focus:border-brand-primary'
          }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={onTogglePassword}
          >
            {showPassword ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1 text-sm text-red-600"
          >
            <AlertCircle size={14} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  
  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <AnimatePresence mode="wait">
        {!isLogin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <InputField
              id="name"
              type="text"
              icon={User}
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            <InputField
              id="username"
              type="text"
              icon={User}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <InputField
        id="email"
        type="email"
        icon={Mail}
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      
      <InputField
        id="password"
        type={showPassword ? "text" : "password"}
        icon={Lock}
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        showPasswordToggle={true}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
      />

      <AnimatePresence>
        {!isLogin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <InputField
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              icon={Lock}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              showPasswordToggle={true}
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {isLogin && (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <div>
            <a href="/reset-password" className="text-sm text-brand-primary hover:text-brand-primary/80 transition-colors">
              Forgot password?
            </a>
          </div>
        </div>
      )}
      
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 px-4 rounded-lg font-medium hover:from-brand-primary/90 hover:to-brand-secondary/90 focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
        disabled={isSubmitting || loading}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="mr-2 animate-spin" />
            {isLogin ? 'Signing In...' : 'Creating Account...'}
          </>
        ) : (
          <>
            {isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight size={18} className="ml-2" />
          </>
        )}
      </button>
      
      <div className="text-center">
        <p className="text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-brand-primary hover:text-brand-primary/80 font-medium transition-colors"
          >
            {isLogin ? 'Sign up now' : 'Sign in'}
          </button>
        </p>
      </div>
    </motion.form>
  );
};

export default LoginForm;
