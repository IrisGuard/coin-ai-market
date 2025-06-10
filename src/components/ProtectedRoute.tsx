
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

  // Get user role if needed
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
    enabled: !!user?.id && (requireAdmin || requireDealer),
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

  // 🚨 ΚΡΙΣΙΜΗ ΔΙΟΡΘΩΣΗ: Admin routes ΔΕΝ κάνουν automatic redirects
  // Admin access ΜΟΝΟ μέσω Ctrl+Alt+A
  if (requireAdmin) {
    // ΔΕΝ κάνουμε redirect εδώ - το AdminKeyboardHandler θα το χειριστεί
    console.log('🔒 Admin route accessed - AdminKeyboardHandler will handle access');
    return <>{children}</>;
  }

  // Regular auth check για non-admin routes
  if (requireAuth && !isAuthenticated && !requireAdmin) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Dealer role check
  if (requireDealer && isAuthenticated) {
    if (userRole !== 'dealer') {
      return <Navigate to="/marketplace" replace />;
    }
  }

  // 🚨 ΚΡΙΣΙΜΗ ΔΙΟΡΘΩΣΗ: ΚΑΜΙΑ automatic redirect to admin panel
  // ΜΟΝΟ για authenticated users από auth page -> marketplace
  if (!requireAuth && isAuthenticated && location.pathname === '/auth') {
    // Για όλους τους users (buyers και dealers), redirect στο marketplace
    // Admin access ΜΟΝΟ μέσω Ctrl+Alt+A
    return <Navigate to="/marketplace" replace />;
  }

  // Render children - NO automatic admin redirects
  return <>{children}</>;
};

export default ProtectedRoute;
