
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, Crown, User, ArrowRight } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import AdminSetupForm from './AdminSetupForm';

interface AdminLoginFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminLoginForm = ({ isOpen, onClose }: AdminLoginFormProps) => {
  const [showSetupForm, setShowSetupForm] = useState(false);
  const { isAdmin } = useAdmin();
  const { user, isAuthenticated } = useAuth();

  const handleClose = () => {
    setShowSetupForm(false);
    onClose();
  };

  const handleBecomeAdmin = () => {
    if (!isAuthenticated) {
      alert('You must be logged in to become an admin');
      return;
    }
    setShowSetupForm(true);
  };

  if (showSetupForm) {
    return (
      <AdminSetupForm 
        isOpen={true} 
        onClose={() => {
          setShowSetupForm(false);
          onClose();
        }} 
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center justify-center">
            <Shield className="h-6 w-6 text-blue-600" />
            Admin Panel Access
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6">
          {isAdmin ? (
            <div className="space-y-4">
              <Crown className="h-16 w-16 mx-auto text-yellow-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-2">
                  You already have Admin access!
                </h3>
                <p className="text-sm text-gray-600">
                  You can proceed to the admin panel
                </p>
              </div>
              <Button 
                onClick={handleClose}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Continue to Admin Panel
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <User className="h-16 w-16 mx-auto text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Become Administrator
                </h3>
                <p className="text-sm text-gray-600">
                  {isAuthenticated 
                    ? 'Click below to gain administrator access'
                    : 'You must log in first to become an admin'
                  }
                </p>
              </div>
              
              {isAuthenticated ? (
                <Button 
                  onClick={handleBecomeAdmin}
                  className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  <Crown className="h-4 w-4" />
                  Become Admin
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button 
                    onClick={() => window.location.href = '/auth'}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Sign In / Sign Up
                  </Button>
                  <p className="text-xs text-gray-500">
                    After signing in, return here to become an admin
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginForm;
