
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
      const response = await dealerSignup(signupData.email, signupData.password, {
        fullName: signupData.fullName,
        username: signupData.username
      });
      
      if (response.error) {
        console.error('❌ Dealer signup error:', response.error);
        throw response.error;
      }
      
      console.log('✅ Dealer signup successful:', {
        userId: response.data?.user?.id,
        role: response.data?.user?.user_metadata?.role
      });
      
      toast({
        title: "Καλώς ήρθατε στο CoinAI!",
        description: "Το κατάστημά σας δημιουργήθηκε επιτυχώς. Μεταφορά στο dealer panel...",
      });
      
      onClose();
      
      // Direct navigation to dealer panel - no email verification needed
      setTimeout(() => {
        navigate('/upload');
      }, 500);
      
    } catch (error: any) {
      console.error('❌ Dealer signup error:', error);
      toast({
        title: "Αποτυχία Εγγραφής",
        description: error.message || 'Παρουσιάστηκε σφάλμα κατά την εγγραφή',
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
