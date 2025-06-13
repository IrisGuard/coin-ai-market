
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
        
        // Better error handling for common cases
        if (response.error.message?.includes('already registered')) {
          toast({
            title: "Το email υπάρχει ήδη",
            description: "Αυτό το email είναι ήδη εγγεγραμμένο. Δοκιμάστε να συνδεθείτε ή χρησιμοποιήστε άλλο email.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Αποτυχία Εγγραφής",
            description: response.error.message || 'Παρουσιάστηκε σφάλμα κατά την εγγραφή',
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
