
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLoginForm from './AdminLoginForm';

const AdminKeyboardHandler = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const navigate = useNavigate();
  const { isAdminAuthenticated } = useAdmin();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ONLY Ctrl+Alt+A - NOTHING ELSE
      if (event.ctrlKey && event.altKey && event.code === 'KeyA') {
        console.log('🔑 Admin keyboard shortcut detected: Ctrl+Alt+A');
        event.preventDefault();
        
        if (isAdminAuthenticated) {
          console.log('✅ User is already admin authenticated, navigating to admin panel');
          navigate('/admin');
        } else {
          console.log('🔐 User not admin authenticated, showing admin login form');
          setShowAdminLogin(true);
        }
      }
    };

    console.log('🎯 AdminKeyboardHandler: Adding keyboard event listener for Ctrl+Alt+A ONLY');
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      console.log('🔌 AdminKeyboardHandler: Removing keyboard event listener');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, isAdminAuthenticated]);

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
