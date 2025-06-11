
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import AdminLoginForm from './AdminLoginForm';

const AdminKeyboardHandler = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdminAuthenticated, isAdmin, isLoading } = useAdmin();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ONLY Ctrl+Alt+A for admin access
      if (event.ctrlKey && event.altKey && event.code === 'KeyA') {
        console.log('🔑 Admin keyboard shortcut detected: Ctrl+Alt+A');
        event.preventDefault();
        
        // Check if user is authenticated first
        if (!isAuthenticated) {
          console.log('❌ User not authenticated, redirecting to auth page');
          navigate('/auth');
          return;
        }

        // If loading, wait a moment
        if (isLoading) {
          console.log('⏳ Admin status loading, please wait...');
          return;
        }

        // Check if user is admin
        if (!isAdmin) {
          console.log('❌ User is not admin');
          alert('Access denied: Admin privileges required');
          return;
        }

        // If admin and already authenticated, go to admin panel
        if (isAdminAuthenticated) {
          console.log('✅ Admin already authenticated, navigating to admin panel');
          if (location.pathname !== '/admin') {
            navigate('/admin');
          }
        } else {
          console.log('🔐 Admin needs authentication, showing login form');
          setShowAdminLogin(true);
        }
      }
    };

    console.log('🎯 AdminKeyboardHandler: Adding keyboard event listener for Ctrl+Alt+A');
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      console.log('🔌 AdminKeyboardHandler: Removing keyboard event listener');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, isAdminAuthenticated, isAdmin, isLoading, isAuthenticated, location.pathname]);

  const handleAdminLoginClose = () => {
    console.log('❌ Admin login form closing');
    setShowAdminLogin(false);
  };

  const handleAdminLoginSuccess = () => {
    console.log('✅ Admin login successful, navigating to admin panel');
    setShowAdminLogin(false);
    navigate('/admin');
  };

  return (
    <AdminLoginForm 
      isOpen={showAdminLogin} 
      onClose={handleAdminLoginClose}
      onSuccess={handleAdminLoginSuccess}
    />
  );
};

export default AdminKeyboardHandler;
