
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    username: ''
  });
  
  const { errors, validateForm } = useDealerSignupValidation();
  const { isLoading: signupLoading, handleSignup } = useDealerSignup(onClose);
  const { secureLogin } = useEnhancedSecureAuth();

  const onSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(signupData)) return;
    await handleSignup(signupData);
  };

  if (!isOpen) return null;

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
              Access your store or create a new one
            </p>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Create Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-6">
                <DealerLoginForm onClose={onClose} />
              </TabsContent>
              
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
