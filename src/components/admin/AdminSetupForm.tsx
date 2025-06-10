
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Crown, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { createFirstAdmin } from '@/utils/adminUtils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface AdminSetupFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSetupForm = ({ isOpen, onClose }: AdminSetupFormProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    try {
      const result = await createFirstAdmin(email);
      
      if (result.success) {
        setSuccess(true);
        
        // Set admin session με ΑΚΡΙΒΗ timestamp
        const now = Date.now();
        localStorage.setItem('adminSession', 'true');
        sessionStorage.setItem('adminSessionTime', now.toString());
        sessionStorage.setItem('adminAuthenticated', 'true');
        sessionStorage.setItem('adminLastActivity', now.toString());
        
        toast({
          title: "Admin Setup Complete",
          description: `${result.message} Session expires in exactly 10 minutes of inactivity.`,
        });
        
        // Close after a short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        toast({
          title: "Setup Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during admin setup.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-green-50 to-emerald-50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-center justify-center text-green-700">
              <CheckCircle className="h-6 w-6" />
              Admin Setup Complete
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-6">
            <Crown className="h-16 w-16 mx-auto text-yellow-600 mb-4" />
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              Welcome, Administrator!
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Your admin access has been successfully configured.
              You will be redirected to the admin panel.
            </p>
            <p className="text-xs text-red-500 font-medium">
              ⏰ Remember: Session expires after EXACTLY 10 minutes of inactivity
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center justify-center">
            <Shield className="h-6 w-6 text-blue-600" />
            Admin Setup
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <Crown className="h-12 w-12 mx-auto text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Create Admin Access</h3>
            <p className="text-sm text-gray-600 mb-2">
              Enter your email to gain administrative privileges
            </p>
            <p className="text-xs text-red-500 font-medium">
              🔑 Access only via Ctrl+Alt+A • ⏰ 10 min timeout
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email Address</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={user?.email || "admin@example.com"}
                required
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !email}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Create Admin
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSetupForm;
