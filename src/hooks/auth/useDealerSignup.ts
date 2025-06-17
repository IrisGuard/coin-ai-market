
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
  storeName: string;
  country: string;
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
      const response = await dealerSignup(signupData.email, signupData.password, {
        fullName: signupData.fullName,
        username: signupData.username,
        storeName: signupData.storeName,
        country: signupData.country
      });
      
      if (response.error) {
        console.error('❌ Dealer signup error:', response.error);
        
        // Better error handling for common cases
        if (response.error.message?.includes('already registered')) {
          toast({
            title: "Email already exists",
            description: "This email is already registered. Try logging in or use a different email.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Signup Failed",
            description: response.error.message || 'An error occurred during signup',
            variant: "destructive",
          });
        }
        return;
      }
      
      console.log('✅ Dealer signup successful:', {
        userId: response.data?.user?.id,
        role: response.data?.user?.user_metadata?.role
      });
      
      // Close modal first to prevent it from reopening
      onClose();
      
      // Direct navigation immediately without showing success toast to avoid modal conflicts
      console.log('📍 Navigating dealer to /upload after signup');
      navigate('/upload');
      
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
