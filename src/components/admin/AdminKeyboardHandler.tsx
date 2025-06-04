
import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLoginForm from './AdminLoginForm';
import AdminPanel from './AdminPanel';

const AdminKeyboardHandler = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { isAdminAuthenticated } = useAdmin();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for CTRL + ALT + A
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        
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

  return (
    <>
      <AdminLoginForm 
        isOpen={showLoginForm} 
        onClose={() => setShowLoginForm(false)} 
      />
      <AdminPanel 
        isOpen={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)} 
      />
    </>
  );
};

export default AdminKeyboardHandler;
