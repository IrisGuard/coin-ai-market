
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Shield, User, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminStatusChecker = () => {
  const { user, isAuthenticated } = useAuth();
  const { isAdmin, isLoading, forceRefresh } = useAdmin();
  const [checking, setChecking] = useState(false);
  const [dbStatus, setDbStatus] = useState<any>(null);

  const checkDatabaseStatus = async () => {
    if (!user) return;
    
    setChecking(true);
    try {
      // Check user_roles table
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      // Check RPC function
      const { data: rpcResult, error: rpcError } = await supabase
        .rpc('verify_admin_access_secure', { user_id: user.id });

      setDbStatus({
        roles: roles || [],
        rolesError,
        rpcResult,
        rpcError,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Database check failed:', error);
    } finally {
      setChecking(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Admin Status Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Authentication</span>
            </div>
            <Badge variant={isAuthenticated ? "default" : "destructive"}>
              {isAuthenticated ? "Authenticated" : "Not Authenticated"}
            </Badge>
            {user && (
              <p className="text-xs text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Admin Status</span>
            </div>
            <Badge variant={isAdmin ? "default" : "secondary"}>
              {isLoading ? "Checking..." : isAdmin ? "Admin" : "Not Admin"}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={forceRefresh}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>

          <Button
            onClick={checkDatabaseStatus}
            disabled={checking || !user}
            variant="outline"
            size="sm"
          >
            <Database className="h-4 w-4 mr-2" />
            Check Database
          </Button>
        </div>

        {dbStatus && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-2">Database Status</h4>
            <div className="space-y-2 text-xs">
              <div>
                <strong>Roles found:</strong> {dbStatus.roles.length}
                {dbStatus.roles.map((role: any, i: number) => (
                  <Badge key={i} variant="outline" className="ml-2">
                    {role.role}
                  </Badge>
                ))}
              </div>
              <div>
                <strong>RPC Result:</strong> {String(dbStatus.rpcResult)}
              </div>
              {(dbStatus.rolesError || dbStatus.rpcError) && (
                <div className="text-red-600">
                  <strong>Errors:</strong>
                  {dbStatus.rolesError && <div>Roles: {dbStatus.rolesError.message}</div>}
                  {dbStatus.rpcError && <div>RPC: {dbStatus.rpcError.message}</div>}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminStatusChecker;
