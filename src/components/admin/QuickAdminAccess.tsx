
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const QuickAdminAccess = () => {
  const { isAuthenticated } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  // Only show if user is authenticated and admin
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

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
