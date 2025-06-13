import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminLoginFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);

    try {
      console.log('🔑 Starting admin login with email:', email);
      
      // Login with email/password
      const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        throw loginError;
      }

      if (!authData.user) {
        throw new Error('Login failed - no user data returned');
      }

      console.log('✅ User authenticated, checking admin role...');
      
      // Use maybeSingle instead of single to handle multiple roles properly
      const { data: adminData, error: adminError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (adminError && adminError.code !== 'PGRST116') {
        console.error('❌ Error checking admin role:', adminError);
        throw new Error('Failed to verify admin privileges');
      }

      // Also check with new secure RPC function as fallback
      if (!adminData) {
        console.log('🔄 Checking with secure RPC function...');
        const { data: rpcResult, error: rpcError } = await supabase
          .rpc('is_admin_secure');

        if (rpcError) {
          console.error('❌ RPC verification failed:', rpcError);
        }

        if (!rpcResult) {
          console.log('❌ User does not have admin role');
          setError('Access denied. This account does not have administrative privileges.');
          return;
        }
      }

      console.log('✅ Admin role confirmed, granting access');
      
      toast({
        title: "Admin Access Granted",
        description: `Welcome ${username || email}! Redirecting to admin panel...`,
      });
      
      // Clear form
      setEmail('');
      setPassword('');
      setUsername('');
      
      // Force refresh admin context
      setTimeout(() => {
        onSuccess?.();
      }, 100);
      
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      let errorMessage = 'Authentication failed. Please check your credentials.';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and confirm your account before signing in.';
      }
      
      setError(errorMessage);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white text-gray-900 border border-gray-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <Shield className="h-5 w-5 text-blue-600" />
            Admin Panel Access
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white text-gray-900 border-gray-300 placeholder:text-gray-500"
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
                className="pl-10 pr-10 bg-white text-gray-900 border-gray-300 placeholder:text-gray-500"
                required
                disabled={isAuthenticating}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isAuthenticating}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Enter your username (optional)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 bg-white text-gray-900 border-gray-300 placeholder:text-gray-500"
                disabled={isAuthenticating}
              />
            </div>
            
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                disabled={isAuthenticating}
              >
                {isAuthenticating ? 'Authenticating...' : 'Access Admin Panel'}
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
            Sign in with your admin account to access the admin panel.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginForm;
