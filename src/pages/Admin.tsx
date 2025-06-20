
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, Rocket } from 'lucide-react';
import ComprehensiveAdminDashboard from '@/components/admin/comprehensive/ComprehensiveAdminDashboard';
import FinalSystemActivator from '@/components/production/FinalSystemActivator';
import { LiveMarketplaceProvider } from '@/components/marketplace/LiveMarketplaceDataProvider';

const Admin = () => {
  const navigate = useNavigate();

  // Check admin access
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ['admin-access-check'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase.rpc('verify_admin_access_secure');
      if (error) {
        console.error('Admin verification error:', error);
        return false;
      }
      return data;
    }
  });

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/auth');
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-6 w-6" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">Admin privileges required to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <LiveMarketplaceProvider>
      <div className="container mx-auto p-6 space-y-6">
        {/* Admin Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">Admin Control Center</h1>
              <p className="text-muted-foreground">Complete platform management and monitoring</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Admin Access Verified
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <Rocket className="h-3 w-3 mr-1" />
              Production Mode
            </Badge>
          </div>
        </div>

        {/* Final System Activator */}
        <FinalSystemActivator />

        {/* Comprehensive Admin Dashboard */}
        <ComprehensiveAdminDashboard />
      </div>
    </LiveMarketplaceProvider>
  );
};

export default Admin;
