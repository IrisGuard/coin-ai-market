import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
}

const LoginForm = ({ isLogin, setIsLogin }: LoginFormProps) => {
  const { toast } = useToast();
  const { login, signup, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || (!isLogin && (!name || !username))) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, {
          fullName: name,
          username: username
        });
      }
    } catch (error) {
      // Error is already handled in the auth context
      console.error('Authentication error:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {!isLogin && (
        <>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} className="text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                className="coin-input pl-10 w-full"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} className="text-gray-400" />
              </div>
              <input
                id="username"
                type="text"
                className="coin-input pl-10 w-full"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
        </>
      )}
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={16} className="text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            className="coin-input pl-10 w-full"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={16} className="text-gray-400" />
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="coin-input pl-10 pr-10 w-full"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={16} className="text-gray-400" />
            ) : (
              <Eye size={16} className="text-gray-400" />
            )}
          </button>
        </div>
      </div>
      
      {isLogin && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-coin-gold focus:ring-coin-gold border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <div>
            <a href="#" className="text-sm text-coin-gold hover:underline">
              Forgot password?
            </a>
          </div>
        </div>
      )}
      
      <button
        type="submit"
        className="coin-button w-full flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
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
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-coin-gold hover:underline"
          >
            {isLogin ? 'Sign up now' : 'Log in'}
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
