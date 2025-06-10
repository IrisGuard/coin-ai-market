
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLoginForm from './AdminLoginForm';

const AdminKeyboardHandler = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, isAdminAuthenticated } = useAdmin();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Alt+A using event.code for better compatibility
      if (event.ctrlKey && event.altKey && event.code === 'KeyA') {
        console.log('Admin keyboard shortcut detected: Ctrl+Alt+A');
        event.preventDefault();
        
        if (isAdminAuthenticated) {
          console.log('User is already admin authenticated, navigating to admin panel');
          // User is already admin, go directly to admin panel
          navigate('/admin');
        } else {
          console.log('User not admin authenticated, showing admin login form');
          // Show admin login/setup form
          setShowAdminLogin(true);
        }
      }
    };

    console.log('AdminKeyboardHandler: Adding keyboard event listener');
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      console.log('AdminKeyboardHandler: Removing keyboard event listener');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, isAdminAuthenticated]);

  const handleAdminLoginClose = () => {
    console.log('Admin login form closing');
    setShowAdminLogin(false);
    // If user became admin during the process, navigate to admin panel
    if (isAdminAuthenticated) {
      console.log('User became admin, navigating to admin panel');
      navigate('/admin');
    }
  };

  return (
    <AdminLoginForm 
      isOpen={showAdminLogin} 
      onClose={handleAdminLoginClose}
    />
  );
};

export default AdminKeyboardHandler;
