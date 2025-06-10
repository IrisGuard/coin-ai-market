
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLoginForm from './AdminLoginForm';

const AdminKeyboardHandler = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const navigate = useNavigate();
  const { isAdmin, isAdminAuthenticated } = useAdmin();

  const SESSION_TIMEOUT = 10 * 60 * 1000; // EXACTLY 10 minutes in milliseconds

  // Monitor user activity and enforce STRICT 10-minute timeout
  useEffect(() => {
    const updateActivity = () => {
      const currentTime = Date.now();
      setLastActivity(currentTime);
      sessionStorage.setItem('adminLastActivity', currentTime.toString());
    };
    
    const checkTimeout = () => {
      const storedActivity = sessionStorage.getItem('adminLastActivity');
      const storedSessionTime = sessionStorage.getItem('adminSessionTime');
      const adminAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
      
      if (!adminAuthenticated) return;
      
      const lastActivityTime = storedActivity ? parseInt(storedActivity) : lastActivity;
      const sessionStartTime = storedSessionTime ? parseInt(storedSessionTime) : lastActivity;
      const currentTime = Date.now();
      
      // Check if EXACTLY 10 minutes have passed since last activity OR session start
      const timeSinceActivity = currentTime - lastActivityTime;
      const timeSinceSession = currentTime - sessionStartTime;
      
      if (timeSinceActivity > SESSION_TIMEOUT || timeSinceSession > SESSION_TIMEOUT) {
        console.log('🔒 Admin session expired - EXACTLY 10 minutes timeout enforced');
        
        // CLEAR ALL admin session data
        sessionStorage.removeItem('adminAuthenticated');
        sessionStorage.removeItem('adminSessionTime');
        sessionStorage.removeItem('adminLastActivity');
        sessionStorage.removeItem('adminFingerprint');
        localStorage.removeItem('adminSession');
        
        // FORCE redirect to home page
        window.location.href = '/';
      }
    };

    // Add activity listeners
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Check timeout every 30 seconds for precise timing
    const timeoutInterval = setInterval(checkTimeout, 30000);
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
      clearInterval(timeoutInterval);
    };
  }, [isAdminAuthenticated, lastActivity]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ONLY Ctrl+Alt+A - NO other shortcuts
      if (event.ctrlKey && event.altKey && event.code === 'KeyA') {
        console.log('🔑 Admin keyboard shortcut detected: Ctrl+Alt+A');
        event.preventDefault();
        
        // Update activity when admin shortcut is used
        const currentTime = Date.now();
        setLastActivity(currentTime);
        sessionStorage.setItem('adminLastActivity', currentTime.toString());
        
        // Check if already authenticated and session is valid
        const adminAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
        const sessionTime = sessionStorage.getItem('adminSessionTime');
        
        if (adminAuthenticated && sessionTime) {
          const timeSinceSession = currentTime - parseInt(sessionTime);
          if (timeSinceSession <= SESSION_TIMEOUT) {
            console.log('✅ Admin session valid, navigating to admin panel');
            navigate('/admin');
            return;
          }
        }
        
        // Show login form if not authenticated or session expired
        console.log('🔐 Admin authentication required, showing login form');
        setShowAdminLogin(true);
      }
    };

    console.log('🎯 AdminKeyboardHandler: Registering Ctrl+Alt+A listener');
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      console.log('🔌 AdminKeyboardHandler: Removing keyboard listener');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, isAdminAuthenticated]);

  const handleAdminLoginClose = () => {
    console.log('❌ Admin login form closing');
    setShowAdminLogin(false);
    
    // Update activity
    const currentTime = Date.now();
    setLastActivity(currentTime);
    sessionStorage.setItem('adminLastActivity', currentTime.toString());
  };

  const handleAdminLoginSuccess = () => {
    console.log('✅ Admin login successful');
    setShowAdminLogin(false);
    
    // Set session data with current timestamp
    const currentTime = Date.now();
    sessionStorage.setItem('adminAuthenticated', 'true');
    sessionStorage.setItem('adminSessionTime', currentTime.toString());
    sessionStorage.setItem('adminLastActivity', currentTime.toString());
    
    // Navigate to admin panel
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
