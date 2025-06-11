
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import AdminLoginForm from './AdminLoginForm';

const AdminKeyboardHandler = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      // ONLY Ctrl+Alt+A for admin access
      if (event.ctrlKey && event.altKey && event.code === 'KeyA') {
        console.log('🔑 Admin keyboard shortcut detected: Ctrl+Alt+A');
        event.preventDefault();
        
        // If already authenticated and admin, go directly to admin panel
        if (isAuthenticated && isAdmin) {
          console.log('✅ Already admin authenticated, navigating to admin panel');
          navigate('/admin');
          return;
        }

        // Show admin login form
        console.log('🔐 Showing admin login form');
        setShowAdminLogin(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, isAuthenticated, isAdmin]);

  const handleAdminLoginClose = () => {
    setShowAdminLogin(false);
  };

  const handleAdminLoginSuccess = () => {
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
