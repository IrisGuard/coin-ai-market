
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useEnhancedSecureAuth } from '@/hooks/useEnhancedSecureAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface DealerLoginFormProps {
  onClose: () => void;
}

const DealerLoginForm: React.FC<DealerLoginFormProps> = ({ onClose }) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { secureLogin } = useEnhancedSecureAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!loginData.email || !loginData.password) {
      setErrors({
        form: 'Please fill in all fields'
      });
      return;
    }

    console.log('🔑 Dealer login attempt for:', loginData.email);
    setIsLoading(true);
    
    try {
      await secureLogin(loginData.email, loginData.password);
      
      console.log('✅ Dealer login successful');
      toast({
        title: "Welcome back!",
        description: "Redirecting to your dealer panel...",
      });
      
      onClose();
      
      // The AuthContext will handle the redirect based on user role
      // But we can also navigate directly to ensure it happens
      setTimeout(() => {
        navigate('/upload');
      }, 1000);
      
    } catch (error: any) {
      console.error('❌ Dealer login error:', error);
      setErrors({
        form: error.message || 'Login failed. Please check your credentials.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Input
          type="email"
          placeholder="your@email.com"
          value={loginData.email}
          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
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
            value={loginData.password}
            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
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

      {errors.form && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle size={14} />
          <span>{errors.form}</span>
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-electric-green to-electric-emerald hover:from-electric-emerald hover:to-electric-cyan"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : (
          'Sign In to Store'
        )}
      </Button>
    </form>
  );
};

export default DealerLoginForm;
