
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  username: string;
}

export const useDealerSignup = (onClose: () => void) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { dealerSignup } = useAuth();

  const handleSignup = async (signupData: SignupData) => {
    console.log('🏪 Dealer signup initiated for:', signupData.email);
    setIsLoading(true);
    
    try {
      const { data, error } = await dealerSignup(signupData.email, signupData.password, {
        fullName: signupData.fullName,
        username: signupData.username
      });
      
      if (error) {
        console.error('❌ Dealer signup error:', error);
        throw error;
      }
      
      console.log('✅ Dealer signup successful:', {
        userId: data.user?.id,
        role: data.user?.user_metadata?.role
      });
      
      toast({
        title: "Welcome to CoinAI!",
        description: "Dealer account created successfully. Redirecting to your panel...",
      });
      
      onClose();
      
      // The AuthContext will handle the redirect automatically
      // But we can also ensure it happens
      setTimeout(() => {
        navigate('/upload');
      }, 1000);
      
    } catch (error: any) {
      console.error('❌ Dealer signup error:', error);
      toast({
        title: "Signup Failed",
        description: error.message || 'An error occurred during signup',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSignup
  };
};
