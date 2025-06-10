
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
      // Check for Ctrl+Alt+A
      if (event.ctrlKey && event.altKey && event.key === 'a') {
        event.preventDefault();
        
        if (isAdminAuthenticated) {
          // User is already admin, go directly to admin panel
          navigate('/admin');
        } else {
          // Show admin login/setup form
          setShowAdminLogin(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate, isAdminAuthenticated]);

  const handleAdminLoginClose = () => {
    setShowAdminLogin(false);
    // If user became admin during the process, navigate to admin panel
    if (isAdminAuthenticated) {
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
