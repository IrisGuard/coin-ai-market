
import { useState } from 'react';

interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  username: string;
}

export const useDealerSignupValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (signupData: SignupData) => {
    const newErrors: Record<string, string> = {};

    if (!signupData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!signupData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!signupData.email) {
      newErrors.email = 'Email is required';
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

  const clearErrors = () => setErrors({});

  return {
    errors,
    validateForm,
    clearErrors
  };
};
