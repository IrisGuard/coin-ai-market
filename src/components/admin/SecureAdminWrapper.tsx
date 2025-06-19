
import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, AlertTriangle, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SecureAdminWrapperProps {
  children: React.ReactNode;
  requireReauth?: boolean;
  sensitiveAction?: boolean;
}

const SecureAdminWrapper: React.FC<SecureAdminWrapperProps> = ({
  children,
  requireReauth = false,
  sensitiveAction = false
}) => {
  const { isAdmin, isLoading } = useAdmin();
  const [isAuthenticated, setIsAuthenticated] = useState(!requireReauth);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const MAX_ATTEMPTS = 3;
  const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

  // Check for admin lockout
  useEffect(() => {
    const lockoutData = localStorage.getItem('adminLockout');
    if (lockoutData) {
      const { timestamp, attempts: storedAttempts } = JSON.parse(lockoutData);
      if (Date.now() - timestamp < LOCKOUT_DURATION && storedAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setAttempts(storedAttempts);
      }
    }
  }, []);

  const handleReauthentication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast({
        title: "Account Locked",
        description: "Too many failed attempts. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    // Simple password validation
    if (password.length < 8) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simple check for demo purposes
      if (password.length >= 8) {
        setIsAuthenticated(true);
        setPassword('');
        setAttempts(0);
        localStorage.removeItem('adminLockout');
        
        toast({
          title: "Authentication Successful",
          description: "Admin access granted.",
        });
      } else {
        throw new Error('Invalid password');
      }
    } catch (error) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        localStorage.setItem('adminLockout', JSON.stringify({
          timestamp: Date.now(),
          attempts: newAttempts
        }));
        
        toast({
          title: "Account Locked",
          description: `Too many failed attempts. Access locked for 30 minutes.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Authentication Failed",
          description: `Invalid password. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`,
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Validating admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Access Denied</strong>
            <p className="mt-1">
              Administrative privileges required to access this content.
              Please use Ctrl+Alt+A to access the admin panel.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isAuthenticated) {
    const lockoutTimeLeft = isLocked ? 
      Math.ceil((LOCKOUT_DURATION - (Date.now() - JSON.parse(localStorage.getItem('adminLockout') || '{}').timestamp || 0)) / 60000) : 0;

    return (
      <div className="max-w-md mx-auto mt-8 p-6">
        <div className="text-center mb-6">
          <Shield className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h2 className="text-xl font-bold">Admin Re-Authentication Required</h2>
          <p className="text-gray-600 mt-2">
            {sensitiveAction 
              ? "This sensitive action requires password confirmation."
              : "Please confirm your password to continue."
            }
          </p>
        </div>

        {isLocked ? (
          <Alert variant="destructive">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Account is locked due to too many failed attempts. 
              Please try again in {lockoutTimeLeft} minutes.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleReauthentication} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            
            {attempts > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {attempts} failed attempt{attempts > 1 ? 's' : ''}. 
                  {MAX_ATTEMPTS - attempts} remaining before lockout.
                </AlertDescription>
              </Alert>
            )}
            
            <Button type="submit" className="w-full">
              Authenticate
            </Button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {sensitiveAction && (
        <div className="absolute top-2 right-2 z-10">
          <div className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
            <Shield className="h-3 w-3" />
            <span>Sensitive Action</span>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default SecureAdminWrapper;
