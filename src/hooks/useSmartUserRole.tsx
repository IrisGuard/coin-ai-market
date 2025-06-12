
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSmartUserRole = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['smartUserRole', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        // First try to get role from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (!profileError && profileData?.role) {
          return profileData.role;
        }
        
        // Fallback: check user metadata if profile doesn't exist yet
        if (user.user_metadata?.role) {
          return user.user_metadata.role;
        }
        
        // Final fallback: default to buyer
        return 'buyer';
      } catch (error) {
        console.error('Error getting user role:', error);
        // Fallback to metadata if database query fails
        return user.user_metadata?.role || 'buyer';
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
