
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLoginForm from './AdminLoginForm';
import { toast } from '@/hooks/use-toast';

const AdminKeyboardHandler = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isAdmin, isLoading, forceRefresh } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🎹 AdminKeyboardHandler mounted', { isAuthenticated, isAdmin, isLoading });

    const handleKeyDown = (event: KeyboardEvent) => {
      // Log all key events for debugging
      console.log('🔑 Key event:', {
        key: event.key,
        code: event.code,
        ctrl: event.ctrlKey,
        alt: event.altKey,
        shift: event.shiftKey,
        target: event.target
      });

      // Check for multiple variations of the admin shortcut
      const isAdminShortcut = (
        (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'a') ||
        (event.ctrlKey && event.altKey && event.code === 'KeyA') ||
        (event.ctrlKey && event.altKey && event.keyCode === 65)
      );

      if (isAdminShortcut) {
        event.preventDefault();
        event.stopPropagation();
        console.log('🎹 Admin shortcut triggered!', { isAuthenticated, isAdmin, isLoading });
        
        toast({
          title: "Admin Shortcut Activated",
          description: "Processing admin access request...",
          variant: "default"
        });

        if (!isAuthenticated) {
          console.log('📝 User not authenticated, showing login form');
          setShowLoginForm(true);
          toast({
            title: "Authentication Required",
            description: "Please login to access the admin panel",
            variant: "default"
          });
        } else if (isLoading) {
          console.log('⏳ Admin status loading...');
          toast({
            title: "Checking Admin Status",
            description: "Please wait while we verify your permissions...",
            variant: "default"
          });
          
          // Wait for admin status to load, then try again
          setTimeout(() => {
            if (isAdmin) {
              console.log('🚀 Admin verified after loading, navigating...');
              navigateToAdmin();
            }
          }, 2000);
        } else if (isAdmin) {
          console.log('🚀 Already admin, navigating to admin panel');
          navigateToAdmin();
        } else {
          console.log('🔐 User authenticated but not admin, showing login form');
          setShowLoginForm(true);
          toast({
            title: "Admin Access Required",
            description: "Admin credentials required for panel access",
            variant: "destructive"
          });
        }
      }

      // Also add a debug shortcut Ctrl+Alt+D for testing
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        console.log('🐛 Debug info:', { 
          isAuthenticated, 
          isAdmin, 
          isLoading,
          currentPath: window.location.pathname 
        });
        toast({
          title: "Debug Info",
          description: `Auth: ${isAuthenticated}, Admin: ${isAdmin}, Loading: ${isLoading}`,
          variant: "default"
        });
      }
    };

    // Add multiple event listeners for better compatibility
    document.addEventListener('keydown', handleKeyDown, true); // Capture phase
    window.addEventListener('keydown', handleKeyDown, true);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  const navigateToAdmin = () => {
    toast({
      title: "Admin Access Granted",
      description: "Redirecting to admin panel...",
      variant: "default"
    });
    
    setTimeout(() => {
      try {
        console.log('🚀 Navigating to /admin...');
        navigate('/admin');
      } catch (error) {
        console.error('❌ Navigation error:', error);
        console.log('🔄 Fallback: Using window.location...');
        window.location.href = '/admin';
      }
    }, 500);
  };

  const handleLoginSuccess = async () => {
    console.log('✅ Login successful, refreshing admin status...');
    setShowLoginForm(false);
    
    toast({
      title: "Login Successful",
      description: "Verifying admin permissions...",
      variant: "default"
    });
    
    // Force refresh admin status
    await forceRefresh();
    
    // Navigate to admin panel after refresh
    setTimeout(() => {
      navigateToAdmin();
    }, 1000);
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
