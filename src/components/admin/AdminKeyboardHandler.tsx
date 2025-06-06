
import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLoginForm from './AdminLoginForm';
import AdminPanel from './AdminPanel';
import ErrorBoundary from '@/components/ErrorBoundary';

const AdminKeyboardHandler = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { isAdminAuthenticated } = useAdmin();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for CTRL + ALT + A (secure admin access)
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        
        // Security log - only in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Admin access attempt detected');
        }
        
        if (isAdminAuthenticated) {
          setShowAdminPanel(true);
        } else {
          setShowLoginForm(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAdminAuthenticated]);

  // This component renders nothing visible on the main site
  // Admin functions are completely hidden from regular users
  return (
    <ErrorBoundary>
      {/* Hidden admin login form - only shows when triggered by keyboard shortcut */}
      <AdminLoginForm 
        isOpen={showLoginForm} 
        onClose={() => setShowLoginForm(false)} 
      />
      
      {/* Hidden admin panel - only accessible after authentication */}
      <AdminPanel 
        isOpen={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)} 
      />
    </ErrorBoundary>
  );
};

export default AdminKeyboardHandler;
