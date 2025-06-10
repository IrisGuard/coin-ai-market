
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

interface AdminLoginFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AdminLoginForm = ({ isOpen, onClose, onSuccess }: AdminLoginFormProps) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { authenticateAdmin } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Admin password is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting admin authentication...');
      const success = await authenticateAdmin(password);
      
      if (success) {
        console.log('✅ Admin authentication successful');
        setPassword('');
        setError('');
        onSuccess?.();
      } else {
        console.log('❌ Admin authentication failed');
        setError('Invalid admin password');
      }
    } catch (error) {
      console.error('🚨 Admin authentication error:', error);
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Admin Authentication Required
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Enter the admin password to access the administration panel.
              <br />
              <strong>Session expires in exactly 10 minutes.</strong>
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="admin-password">Admin Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              disabled={isLoading}
              autoComplete="current-password"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !password.trim()}>
              {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
            </Button>
          </div>
        </form>

        <div className="text-sm text-muted-foreground border-t pt-4">
          <p className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Security Notice: Admin sessions are automatically terminated after 10 minutes of inactivity.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginForm;
