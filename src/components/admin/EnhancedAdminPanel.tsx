
import React from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import AdminStatsOverview from './AdminStatsOverview';
import AdminTabsContent from './AdminTabsContent';
import SecurityValidationWrapper from './SecurityValidationWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Home, LogOut } from 'lucide-react';

const EnhancedAdminPanel: React.FC = () => {
  const { isAdmin, isLoading } = useAdmin();
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    // Clear any admin session data
    localStorage.removeItem('adminToken');
    sessionStorage.clear();
    
    // Navigate to home page
    navigate('/');
    
    // Force a page reload to ensure clean state
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-coin-purple mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <SecurityValidationWrapper
      requireAdmin={true}
      fallback={
        <Card className="m-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Access Restricted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                This admin panel requires administrative privileges. 
                Please contact your system administrator if you believe you should have access.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      }
    >
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                GlobalCoinsAI Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Comprehensive administration and monitoring system
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleHomeClick}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
          
          <AdminStatsOverview />
          <AdminTabsContent />
        </div>
      </div>
    </SecurityValidationWrapper>
  );
};

export default EnhancedAdminPanel;
