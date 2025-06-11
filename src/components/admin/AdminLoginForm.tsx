
import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, EyeOff, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AdminLoginFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const { isAdmin, authenticateAdmin, sessionTimeLeft } = useAdmin();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);

    try {
      const success = await authenticateAdmin(password);
      
      if (success) {
        toast({
          title: "Admin Access Granted",
          description: "Welcome to the admin panel. Session expires in 10 minutes.",
        });
        setPassword('');
        onSuccess?.();
      } else {
        setError('Invalid admin password. Password must be at least 12 characters.');
      }
    } catch (error) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (!isAdmin) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white text-gray-900">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900">
              <Shield className="h-5 w-5 text-red-500" />
              Access Denied
            </DialogTitle>
          </DialogHeader>
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">
              You do not have administrative privileges to access this panel.
            </AlertDescription>
          </Alert>
          <Button onClick={onClose} variant="outline" className="w-full bg-white text-gray-900 border-gray-300 hover:bg-gray-50">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  const formatTimeLeft = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white text-gray-900 border border-gray-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <Shield className="h-5 w-5 text-blue-600" />
            Admin Authentication Required
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {sessionTimeLeft > 0 && (
            <Alert className="bg-blue-50 border-blue-200">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Current session expires in: {formatTimeLeft(sessionTimeLeft)}
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password (min 12 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 bg-white text-gray-900 border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                required
                minLength={12}
                disabled={isAuthenticating}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
            
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                disabled={isAuthenticating || password.length < 12}
              >
                {isAuthenticating ? 'Authenticating...' : 'Access Admin Panel'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isAuthenticating}
                className="bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </form>
          
          <p className="text-xs text-gray-500 text-center">
            Admin session will timeout after exactly 10 minutes of authentication.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginForm;
