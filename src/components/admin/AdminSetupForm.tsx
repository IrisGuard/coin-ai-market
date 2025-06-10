
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Crown, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface AdminSetupFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSetupForm = ({ isOpen, onClose }: AdminSetupFormProps) => {
  const [fullName, setFullName] = useState('PVC Admin');
  const [email, setEmail] = useState('pvc.laminate@gmail.com');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { makeCurrentUserAdmin } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    setIsSubmitting(true);
    try {
      const success = await makeCurrentUserAdmin({ fullName, email });
      if (success) {
        setIsSuccess(true);
        toast({
          title: "Επιτυχία!",
          description: "Έχετε πλέον διαχειριστικά δικαιώματα.",
        });
        // Close after short delay to show success state
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error: any) {
      console.error('Admin setup error:', error);
      toast({
        title: "Σφάλμα",
        description: error.message || 'Αποτυχία δημιουργίας διαχειριστή',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-blue-50 border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center justify-center text-xl">
            <Crown className="h-6 w-6 text-yellow-600" />
            Δημιουργία Διαχειριστή
          </DialogTitle>
        </DialogHeader>
        
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-4"
          >
            <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                Επιτυχής Δημιουργία!
              </h3>
              <p className="text-sm text-gray-600">
                Έχετε πλέον πλήρη διαχειριστικά δικαιώματα
              </p>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <Crown className="h-12 w-12 mx-auto text-yellow-600 mb-3" />
              <p className="text-sm text-gray-600">
                Συμπληρώστε τα στοιχεία για να γίνετε διαχειριστής
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Πλήρες Όνομα
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Εισάγετε το πλήρες όνομά σας"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Διαχειριστή
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-yellow-800">
                  <strong>Προσοχή:</strong> Αυτή η ενέργεια θα σας δώσει πλήρη διαχειριστικά δικαιώματα 
                  συμπεριλαμβανομένης της πρόσβασης στο AI Brain.
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Ακύρωση
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !fullName || !email}
                className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Δημιουργία...
                  </>
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Γίνε Διαχειριστής
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminSetupForm;
