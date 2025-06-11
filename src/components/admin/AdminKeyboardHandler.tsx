
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLoginForm from './AdminLoginForm';

const AdminKeyboardHandler = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isAdmin, isLoading, forceRefresh } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Alt+A combination
      if (event.ctrlKey && event.altKey && event.key === 'a') {
        event.preventDefault();
        console.log('🎹 Admin shortcut triggered');
        
        if (!isAuthenticated) {
          console.log('📝 User not authenticated, showing login form');
          setShowLoginForm(true);
        } else if (isLoading) {
          console.log('⏳ Admin status loading...');
          return;
        } else if (isAdmin) {
          console.log('🚀 Already admin, navigating to admin panel');
          navigate('/admin');
        } else {
          console.log('🔐 User authenticated but not admin, showing login form');
          setShowLoginForm(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  const handleLoginSuccess = async () => {
    console.log('✅ Login successful, refreshing admin status...');
    setShowLoginForm(false);
    
    // Force refresh admin status
    await forceRefresh();
    
    // Navigate to admin panel after a short delay
    setTimeout(() => {
      navigate('/admin');
    }, 200);
  };

  const handleLoginClose = () => {
    setShowLoginForm(false);
  };

  return (
    <AdminLoginForm
      isOpen={showLoginForm}
      onClose={handleLoginClose}
      onSuccess={handleLoginSuccess}
    />
  );
};

export default AdminKeyboardHandler;
