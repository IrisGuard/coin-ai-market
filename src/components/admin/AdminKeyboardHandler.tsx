
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import AdminLoginForm from './AdminLoginForm';
import { supabase } from '@/integrations/supabase/client';

const AdminKeyboardHandler = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdminAuthenticated, isAdmin, isLoading } = useAdmin();
  const { isAuthenticated, user } = useAuth();

  // Quick admin role assignment for current user
  const assignAdminRole = async () => {
    if (!user) return false;
    
    try {
      // Check if any admin exists
      const { data: existingAdmins } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      // If no admins exist, make current user admin
      if (!existingAdmins || existingAdmins.length === 0) {
        await supabase
          .from('user_roles')
          .insert([{ user_id: user.id, role: 'admin' }]);
        
        await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', user.id);
        
        return true;
      }
      
      // Check if current user is already admin
      const { data: currentUserAdmin } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();
        
      return !!currentUserAdmin;
    } catch (error) {
      console.error('Admin role assignment error:', error);
      return false;
    }
  };

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      // ONLY Ctrl+Alt+A for admin access
      if (event.ctrlKey && event.altKey && event.code === 'KeyA') {
        console.log('🔑 Admin keyboard shortcut detected: Ctrl+Alt+A');
        event.preventDefault();
        
        // Check if user is authenticated first
        if (!isAuthenticated || !user) {
          console.log('❌ User not authenticated, redirecting to auth page');
          navigate('/auth');
          return;
        }

        // If already admin authenticated, go directly to admin
        if (isAdmin && isAdminAuthenticated) {
          console.log('✅ Already admin authenticated, navigating to admin panel');
          navigate('/admin');
          return;
        }

        // Check admin role and show login form
        const hasAdminRole = await assignAdminRole();
        
        if (hasAdminRole) {
          console.log('🔐 Showing admin login form');
          setShowAdminLogin(true);
        } else {
          console.log('❌ Could not assign admin role');
          alert('Could not access admin panel');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, isAuthenticated, user, isAdmin, isAdminAuthenticated]);

  const handleAdminLoginClose = () => {
    setShowAdminLogin(false);
  };

  const handleAdminLoginSuccess = () => {
    setShowAdminLogin(false);
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
