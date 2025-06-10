
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLoginForm from './AdminLoginForm';

const AdminKeyboardHandler = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const navigate = useNavigate();
  const { isAdmin, isAdminAuthenticated } = useAdmin();

  const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes as requested

  // Monitor user activity and implement session timeout
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    
    const checkTimeout = () => {
      if (isAdminAuthenticated && Date.now() - lastActivity > SESSION_TIMEOUT) {
        console.log('Admin session expired due to inactivity');
        // Clear admin session
        localStorage.removeItem('adminSession');
        sessionStorage.removeItem('adminAuthenticated');
        window.location.href = '/'; // Force redirect to home
      }
    };

    // Add activity listeners
    document.addEventListener('mousedown', updateActivity);
    document.addEventListener('keydown', updateActivity);
    document.addEventListener('scroll', updateActivity);
    document.addEventListener('touchstart', updateActivity);

    // Check timeout every minute
    const timeoutInterval = setInterval(checkTimeout, 60000);
    
    return () => {
      document.removeEventListener('mousedown', updateActivity);
      document.removeEventListener('keydown', updateActivity);
      document.removeEventListener('scroll', updateActivity);
      document.removeEventListener('touchstart', updateActivity);
      clearInterval(timeoutInterval);
    };
  }, [isAdminAuthenticated, lastActivity]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Alt+A using event.code for better compatibility
      if (event.ctrlKey && event.altKey && event.code === 'KeyA') {
        console.log('Admin keyboard shortcut detected: Ctrl+Alt+A');
        event.preventDefault();
        
        // Update activity when admin shortcut is used
        setLastActivity(Date.now());
        
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
    setLastActivity(Date.now()); // Reset activity timer
  };

  return (
    <AdminLoginForm 
      isOpen={showAdminLogin} 
      onClose={handleAdminLoginClose}
    />
  );
};

export default AdminKeyboardHandler;
