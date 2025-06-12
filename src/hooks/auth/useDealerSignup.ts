
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  const handleSignup = async (signupData: SignupData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
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
      
      if (error) throw error;
      
      toast({
        title: "Welcome to CoinAI!",
        description: "Please check your email to confirm your account. Redirecting to your dealer panel...",
      });
      
      onClose();
      
      // Redirect to upload page immediately after successful signup
      setTimeout(() => {
        window.location.href = '/upload';
      }, 1000);
      
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

  return {
    isLoading,
    handleSignup
  };
};
