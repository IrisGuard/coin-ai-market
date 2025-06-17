
import React, { useState } from 'react';
import { useDealerSignup } from '@/hooks/auth/useDealerSignup';
import DealerSignupFormFields from './DealerSignupFormFields';

interface DealerSignupFormProps {
  onClose: () => void;
}

const DealerSignupForm: React.FC<DealerSignupFormProps> = ({ onClose }) => {
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    username: '',
    storeName: '',
    country: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { isLoading, handleSignup } = useDealerSignup(onClose);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!signupData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!signupData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!signupData.storeName.trim()) {
      newErrors.storeName = 'Store name is required';
    }

    if (!signupData.country) {
      newErrors.country = 'Country is required';
    }

    if (!signupData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!signupData.password) {
      newErrors.password = 'Password is required';
    } else if (signupData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await handleSignup(signupData);
  };

  return (
    <DealerSignupFormFields
      signupData={signupData}
      onSignupDataChange={setSignupData}
      errors={errors}
      showPassword={showPassword}
      showConfirmPassword={showConfirmPassword}
      onTogglePassword={() => setShowPassword(!showPassword)}
      onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
      isLoading={isLoading}
      onSubmit={onSubmit}
    />
  );
};

export default DealerSignupForm;
