
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const QuickAdminAccess = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const navigate = useNavigate();

  // Enhanced security checks with detailed logging
  console.log('🔐 QuickAdminAccess Security Check:', {
    isAuthenticated,
    authLoading,
    isAdmin,
    adminLoading,
    userId: user?.id,
    userEmail: user?.email
  });

  // CRITICAL: Hide button during ANY loading state or if not authenticated
  if (authLoading || adminLoading || !isAuthenticated || !user) {
    console.log('❌ QuickAdminAccess: Hidden due to loading or no auth');
    return null;
  }

  // CRITICAL: Only show if user is definitively admin (no ambiguity)
  if (!isAdmin) {
    console.log('❌ QuickAdminAccess: Hidden - user is not admin');
    return null;
  }

  // Additional safety check - only proceed if all conditions are explicitly true
  const isSafeToShow = isAuthenticated && !authLoading && !adminLoading && isAdmin && user;
  if (!isSafeToShow) {
    console.log('❌ QuickAdminAccess: Hidden due to safety check failure');
    return null;
  }

  console.log('✅ QuickAdminAccess: Showing button for admin user:', user.email);

  const handleAdminAccess = () => {
    toast({
      title: "Admin Access",
      description: "Redirecting to admin panel...",
      variant: "default"
    });
    
    setTimeout(() => {
      try {
        navigate('/admin');
      } catch (error) {
        console.error('Navigation error:', error);
        window.location.href = '/admin';
      }
    }, 300);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={handleAdminAccess}
        size="sm"
        className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
      >
        <Shield className="w-4 h-4 mr-2" />
        Admin Panel
      </Button>
    </div>
  );
};

export default QuickAdminAccess;
