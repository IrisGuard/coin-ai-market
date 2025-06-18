
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSmartUserRole = () => {
  const { user, session } = useAuth();
  
  return useQuery({
    queryKey: ['smartUserRole', user?.id, session?.access_token],
    queryFn: async () => {
      if (!user?.id) {
        console.log('🔍 useSmartUserRole: No user ID available');
        return null;
      }
      
      console.log('🔍 useSmartUserRole: Checking role for user:', user.id);
      
      try {
        // PRIORITY: Check for admin role first in user_roles table
        const { data: adminRoleData, error: adminRoleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
        
        if (!adminRoleError && adminRoleData) {
          console.log('✅ ADMIN role found in user_roles table');
          return 'admin';
        }

        // Check for dealer role in user_roles table
        const { data: dealerRoleData, error: dealerRoleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'dealer')
          .maybeSingle();
        
        if (!dealerRoleError && dealerRoleData) {
          console.log('✅ Dealer role found in user_roles table');
          return 'dealer';
        }
        
        // Try to get role from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        
        if (!profileError && profileData?.role) {
          console.log('✅ Role found in profiles table:', profileData.role);
          return profileData.role;
        }
        
        console.log('ℹ️ No role in profiles, checking user metadata...');
        
        // Fallback: check user metadata
        if (user.user_metadata?.role) {
          console.log('✅ Role found in user metadata:', user.user_metadata.role);
          return user.user_metadata.role;
        }
        
        console.log('⚠️ No role found anywhere, defaulting to buyer');
        return 'buyer';
      } catch (error) {
        console.error('❌ Error getting user role:', error);
        const metadataRole = user.user_metadata?.role || 'buyer';
        console.log('🔄 Fallback to metadata role:', metadataRole);
        return metadataRole;
      }
    },
    enabled: !!user?.id && !!session,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
    retryDelay: 500,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
