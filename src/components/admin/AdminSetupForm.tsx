
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Shield, Crown } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';

interface AdminSetupFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSetupForm = ({ isOpen, onClose }: AdminSetupFormProps) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { makeCurrentUserAdmin } = useAdmin();
  const { user } = useAuth();

  // Initialize with current user data
  React.useEffect(() => {
    if (user && isOpen) {
      setFullName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    setIsLoading(true);
    const success = await makeCurrentUserAdmin({ fullName, email });
    setIsLoading(false);

    if (success) {
      setFullName('');
      setEmail('');
      onClose();
    }
  };

  const handleClose = () => {
    setFullName('');
    setEmail('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center justify-center">
            <Crown className="h-6 w-6 text-yellow-600" />
            Γίνετε Διαχειριστής
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center mb-4">
          <Shield className="h-12 w-12 mx-auto text-blue-600 mb-2" />
          <p className="text-sm text-gray-600">
            Συμπληρώστε τα στοιχεία σας για να αποκτήσετε πρόσβαση διαχειριστή
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-fullname">Πλήρες Όνομα</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="admin-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Εισάγετε το πλήρες όνομά σας"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
            >
              Ακύρωση
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !fullName || !email}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Δημιουργία...' : 'Γίνε Admin'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSetupForm;
