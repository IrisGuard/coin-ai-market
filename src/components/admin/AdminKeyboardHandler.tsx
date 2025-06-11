
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
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Alt+A combination
      if (event.ctrlKey && event.altKey && event.key === 'a') {
        event.preventDefault();
        console.log('🎹 Admin shortcut triggered');
        
        if (!isAuthenticated) {
          console.log('📝 User not authenticated, showing login form');
          setShowLoginForm(true);
          toast({
            title: "Admin Login Required",
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
          return;
        } else if (isAdmin) {
          console.log('🚀 Already admin, navigating to admin panel');
          toast({
            title: "Admin Access Granted",
            description: "Redirecting to admin panel...",
            variant: "default"
          });
          
          // Force navigation with a small delay to ensure toast shows
          setTimeout(() => {
            try {
              navigate('/admin');
            } catch (error) {
              console.error('Navigation error:', error);
              window.location.href = '/admin';
            }
          }, 500);
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
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

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
    
    // Navigate to admin panel after a short delay
    setTimeout(() => {
      try {
        navigate('/admin');
      } catch (error) {
        console.error('Navigation error:', error);
        window.location.href = '/admin';
      }
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
