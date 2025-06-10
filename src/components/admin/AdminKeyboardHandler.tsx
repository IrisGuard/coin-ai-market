
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLoginForm from './AdminLoginForm';

const AdminKeyboardHandler = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const navigate = useNavigate();
  const { isAdmin, isAdminAuthenticated } = useAdmin();

  const SESSION_TIMEOUT = 10 * 60 * 1000; // ΑΚΡΙΒΩΣ 10 λεπτά

  // Monitor user activity και timeout session
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now());
      // Update στο sessionStorage επίσης για consistency
      sessionStorage.setItem('adminLastActivity', Date.now().toString());
    };
    
    const checkTimeout = () => {
      const storedActivity = sessionStorage.getItem('adminLastActivity');
      const lastActivityTime = storedActivity ? parseInt(storedActivity) : lastActivity;
      
      if (isAdminAuthenticated && Date.now() - lastActivityTime > SESSION_TIMEOUT) {
        console.log('🔒 Admin session expired due to inactivity - EXACTLY 10 minutes');
        // ΚΑΘΑΡΙΣΜΟΣ όλων των admin session data
        localStorage.removeItem('adminSession');
        sessionStorage.removeItem('adminAuthenticated');
        sessionStorage.removeItem('adminSessionTime');
        sessionStorage.removeItem('adminLastActivity');
        sessionStorage.removeItem('adminFingerprint');
        
        // FORCE redirect to home - ΚΑΝΕΝΑ admin panel access
        window.location.href = '/';
      }
    };

    // Add activity listeners
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Check timeout κάθε λεπτό
    const timeoutInterval = setInterval(checkTimeout, 60000);
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
      clearInterval(timeoutInterval);
    };
  }, [isAdminAuthenticated, lastActivity]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ΜΟΝΟ Ctrl+Alt+A - ΤΙΠΟΤΑ ΑΛΛΟ
      if (event.ctrlKey && event.altKey && event.code === 'KeyA') {
        console.log('🔑 Admin keyboard shortcut detected: Ctrl+Alt+A');
        event.preventDefault();
        
        // Update activity when admin shortcut is used
        setLastActivity(Date.now());
        sessionStorage.setItem('adminLastActivity', Date.now().toString());
        
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
    setLastActivity(Date.now());
    sessionStorage.setItem('adminLastActivity', Date.now().toString());
  };

  return (
    <AdminLoginForm 
      isOpen={showAdminLogin} 
      onClose={handleAdminLoginClose}
    />
  );
};

export default AdminKeyboardHandler;
