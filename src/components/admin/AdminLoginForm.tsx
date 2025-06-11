
import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, EyeOff, Clock, Mail, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AdminLoginFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const { isAdmin, isAdminAuthenticated, authenticateAdmin, sessionTimeLeft, checkAdminStatus } = useAdmin();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'login' | 'admin_auth'>('login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);

    try {
      if (step === 'login') {
        // First step: Regular user login
        await login(email, password);
        console.log('✅ User logged in, checking admin status...');
        
        // Check admin status immediately after login
        await checkAdminStatus();
        
        // Wait a moment for state to update, then check admin role
        setTimeout(async () => {
          // Re-check admin status to ensure it's updated
          await checkAdminStatus();
          
          // Now check if user has admin role from the context
          if (isAdmin) {
            console.log('✅ User has admin role, proceeding to admin auth step');
            setStep('admin_auth');
            setPassword(''); // Clear password for admin auth step
          } else {
            console.log('❌ User does not have admin role');
            setError('Access denied. This account does not have administrative privileges.');
          }
          setIsAuthenticating(false);
        }, 1000);
        
        return; // Don't set isAuthenticating to false here, let setTimeout handle it
      } else {
        // Second step: Admin authentication
        const success = await authenticateAdmin(password);
        
        if (success) {
          toast({
            title: "Admin Access Granted",
            description: "Welcome to the admin panel. Session expires in 10 minutes.",
          });
          setEmail('');
          setPassword('');
          setStep('login');
          onSuccess?.();
        } else {
          setError('Invalid admin password. Password must be at least 12 characters.');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      let errorMessage = 'Authentication failed. Please check your credentials.';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and confirm your account before signing in.';
      }
      
      setError(errorMessage);
    }
    
    if (step !== 'login') {
      setIsAuthenticating(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    setStep('login');
    onClose();
  };

  const formatTimeLeft = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white text-gray-900 border border-gray-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <Shield className="h-5 w-5 text-blue-600" />
            {step === 'login' ? 'Admin Panel Access' : 'Admin Authentication Required'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {sessionTimeLeft > 0 && step === 'admin_auth' && (
            <Alert className="bg-blue-50 border-blue-200">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Current session expires in: {formatTimeLeft(sessionTimeLeft)}
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 'login' ? (
              <>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white text-gray-900 border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={isAuthenticating}
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white text-gray-900 border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    required
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
              </>
            ) : (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password (min 12 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white text-gray-900 border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
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
            )}
            
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                disabled={isAuthenticating || (step === 'admin_auth' && password.length < 12)}
              >
                {isAuthenticating ? 'Authenticating...' : (step === 'login' ? 'Sign In' : 'Access Admin Panel')}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isAuthenticating}
                className="bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </form>
          
          <p className="text-xs text-gray-500 text-center">
            {step === 'login' 
              ? 'Sign in with your account to verify admin access.'
              : 'Admin session will timeout after exactly 10 minutes of authentication.'
            }
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginForm;
