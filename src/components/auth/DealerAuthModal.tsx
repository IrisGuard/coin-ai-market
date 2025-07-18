
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDealerSignupValidation } from '@/hooks/auth/useDealerSignupValidation';
import { useDealerSignup } from '@/hooks/auth/useDealerSignup';
import { useEnhancedSecureAuth } from '@/hooks/useEnhancedSecureAuth';
import DealerSignupFormFields from './DealerSignupFormFields';
import DealerLoginForm from './DealerLoginForm';

interface DealerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DealerAuthModal = ({ isOpen, onClose }: DealerAuthModalProps) => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  
  // Default to signup for new dealers
  const [activeTab, setActiveTab] = useState('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    username: '',
    storeName: '',
    country: ''
  });
  
  const { errors, validateForm } = useDealerSignupValidation();
  const { isLoading: signupLoading, handleSignup } = useDealerSignup(onClose);
  const { secureLogin } = useEnhancedSecureAuth();

  // Auto-redirect if user is already authenticated as dealer
  useEffect(() => {
    if (session?.user && user?.user_metadata?.role === 'dealer') {
      console.log('🔄 Dealer already authenticated, redirecting to /upload');
      onClose();
      navigate('/upload');
    }
  }, [session, user, onClose, navigate]);

  const onSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(signupData)) return;
    await handleSignup(signupData);
  };

  if (!isOpen) return null;

  // Don't render if user is already authenticated as dealer
  if (session?.user && user?.user_metadata?.role === 'dealer') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-electric-green to-electric-emerald bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Store className="w-6 h-6 text-electric-green" />
              Dealer Access
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Create your store or access existing one
            </p>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup">Create Store</TabsTrigger>
                <TabsTrigger value="login">Sign In</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signup" className="mt-6">
                <DealerSignupFormFields
                  signupData={signupData}
                  onSignupDataChange={setSignupData}
                  errors={errors}
                  showPassword={showPassword}
                  showConfirmPassword={showConfirmPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                  isLoading={signupLoading}
                  onSubmit={onSignupSubmit}
                />
              </TabsContent>
              
              <TabsContent value="login" className="mt-6">
                <DealerLoginForm onClose={onClose} />
              </TabsContent>
            </Tabs>
            
            <div className="mt-4 text-center">
              <button
                onClick={onClose}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DealerAuthModal;
