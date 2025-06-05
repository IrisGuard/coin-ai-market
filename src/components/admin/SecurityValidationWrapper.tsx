
import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import { verifyAdminAccess } from '@/utils/supabaseSecurityHelpers';

interface SecurityValidationWrapperProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

const SecurityValidationWrapper: React.FC<SecurityValidationWrapperProps> = ({
  children,
  requireAdmin = true,
  fallback
}) => {
  const { isAdmin, isLoading, checkAdminStatus } = useAdmin();
  const [securityCheck, setSecurityCheck] = useState<{
    passed: boolean;
    loading: boolean;
    error?: string;
  }>({ passed: false, loading: true });

  useEffect(() => {
    const performSecurityCheck = async () => {
      if (!requireAdmin) {
        setSecurityCheck({ passed: true, loading: false });
        return;
      }

      setSecurityCheck({ passed: false, loading: true });

      try {
        const hasAccess = await verifyAdminAccess();
        setSecurityCheck({ 
          passed: hasAccess, 
          loading: false,
          error: hasAccess ? undefined : 'Admin access verification failed'
        });
      } catch (error) {
        console.error('Security check error:', error);
        setSecurityCheck({ 
          passed: false, 
          loading: false,
          error: 'Security validation error'
        });
      }
    };

    if (!isLoading) {
      performSecurityCheck();
    }
  }, [requireAdmin, isLoading, isAdmin]);

  const handleRetryCheck = async () => {
    await checkAdminStatus();
    const hasAccess = await verifyAdminAccess();
    setSecurityCheck({ 
      passed: hasAccess, 
      loading: false,
      error: hasAccess ? undefined : 'Admin access verification failed'
    });
  };

  if (isLoading || securityCheck.loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Verifying security permissions...</span>
      </div>
    );
  }

  if (!securityCheck.passed) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>Access Denied</strong>
              <p className="mt-1">{securityCheck.error || 'Admin privileges required'}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetryCheck}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
          <Shield className="h-3 w-3" />
          <span>Secured</span>
        </div>
      </div>
      {children}
    </div>
  );
};

export default SecurityValidationWrapper;
