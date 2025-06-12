
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
            role: 'dealer'
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Welcome to CoinVault!",
        description: "Please check your email to confirm your account. You can start uploading coins immediately.",
      });
      
      onClose();
      
      // Navigate to upload page immediately for dealers
      window.location.href = '/upload';
      
    } catch (error: any) {
      console.error('Dealer signup error:', error);
      toast({
        title: "Signup Failed",
        description: error.message || 'An error occurred during dealer signup',
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
