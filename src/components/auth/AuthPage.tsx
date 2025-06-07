
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthCard from './AuthCard';
import AuthSuccessHandler from './AuthSuccessHandler';

const AuthPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated and not loading, redirect to success handler
    if (isAuthenticated && !loading) {
      // Don't navigate here - let AuthSuccessHandler handle it
      return;
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-electric-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <AuthSuccessHandler />;
  }

  return <AuthCard />;
};

export default AuthPage;
