
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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

  const handleSignup = async (signupData: SignupData) => {
    console.log('📝 Dealer signup initiated for:', signupData.email);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/upload`,
          data: {
            full_name: signupData.fullName,
            name: signupData.fullName,
            username: signupData.username,
            role: 'dealer' // CRITICAL: Set role to dealer
          }
        }
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
        description: "Account created successfully. Redirecting to your dealer panel...",
      });
      
      onClose();
      
      // Redirect to upload page immediately after successful signup
      // The auth state change will handle the actual redirect
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
