
import React, { useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';

const AdminKeyboardHandler: React.FC = () => {
  const { isAdmin, isLoading, forceRefresh } = useAdmin();

  useEffect(() => {
    if (isLoading) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts for admin users
      if (!isAdmin) return;

      // Ctrl+Shift+R: Force refresh admin data
      if (event.ctrlKey && event.shiftKey && event.key === 'R') {
        event.preventDefault();
        console.log('🔄 Admin forced refresh triggered');
        forceRefresh?.();
      }

      // Ctrl+Shift+A: Quick admin panel access
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        console.log('⚡ Quick admin access triggered');
        window.location.href = '/admin';
      }

      // Ctrl+Shift+D: Quick dealer panel access
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        console.log('🏪 Quick dealer access triggered');
        window.location.href = '/dealer';
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAdmin, isLoading, forceRefresh]);

  // This component doesn't render anything visible
  return null;
};

export default AdminKeyboardHandler;
