
import React, { useEffect, useState } from 'react';
import { verifyEnhancedAdminAccess } from '@/utils/enhancedSupabaseSecurityHelpers';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock } from 'lucide-react';

interface SecureAdminWrapperProps {
  children: React.ReactNode;
  requiredLevel?: 'basic' | 'enhanced';
}

const SecureAdminWrapper: React.FC<SecureAdminWrapperProps> = ({ 
  children, 
  requiredLevel = 'basic' 
}) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const hasAccess = await verifyEnhancedAdminAccess();
        setIsAuthorized(hasAccess);
      } catch (error) {
        console.error('Admin access verification failed:', error);
        setIsAuthorized(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, []);

  if (isChecking) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 animate-pulse" />
            <span>Verifying admin access...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthorized) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <Lock className="h-6 w-6" />
            <div>
              <h3 className="font-semibold">Access Denied</h3>
              <p className="text-sm text-red-500">
                Administrative privileges required to access this section.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default SecureAdminWrapper;
