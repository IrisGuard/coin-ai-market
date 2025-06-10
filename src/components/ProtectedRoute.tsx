
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireDealer?: boolean;
}

const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false, requireDealer = false }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Get user role if needed for dealer check
  const { data: userRole, isLoading: roleLoading } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data?.role;
    },
    enabled: !!user?.id && requireDealer,
  });

  // Show loading state if auth or role is still being determined
  if (loading || (requireDealer && roleLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="animate-spin h-8 w-8 border-4 border-electric-blue border-t-transparent rounded-full"></div>
          <span className="text-electric-blue font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  // 🚨 CRITICAL FIX: Admin routes NEVER auto-redirect
  // Admin access ONLY through Ctrl+Alt+A + AdminKeyboardHandler
  if (requireAdmin) {
    // Block access if not admin-authenticated through AdminKeyboardHandler
    const adminAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
    const adminSessionTime = sessionStorage.getItem('adminSessionTime');
    const currentTime = Date.now();
    
    // Check 10-minute timeout (600,000ms)
    if (!adminAuthenticated || !adminSessionTime || currentTime - parseInt(adminSessionTime) > 600000) {
      // Clear expired session
      sessionStorage.removeItem('adminAuthenticated');
      sessionStorage.removeItem('adminSessionTime');
      sessionStorage.removeItem('adminLastActivity');
      sessionStorage.removeItem('adminFingerprint');
      
      // Redirect to home, NOT to auth
      return <Navigate to="/" replace />;
    }
    
    // Admin access granted - render admin content
    return <>{children}</>;
  }

  // Regular auth check for non-admin routes
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Dealer role check
  if (requireDealer && isAuthenticated) {
    if (userRole !== 'dealer') {
      return <Navigate to="/marketplace" replace />;
    }
  }

  // 🚨 CRITICAL FIX: NO automatic redirects for authenticated users
  // Let them stay where they are, NO forced navigation
  if (!requireAuth && isAuthenticated && location.pathname === '/auth') {
    // Only redirect FROM auth page to marketplace
    return <Navigate to="/marketplace" replace />;
  }

  // Render children - NO other automatic redirects
  return <>{children}</>;
};

export default ProtectedRoute;
