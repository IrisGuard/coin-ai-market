
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AICommand } from '../types';

export const useAICommandsQuery = () => {
  return useQuery({
    queryKey: ['ai-commands'],
    queryFn: async () => {
      console.log('🔍 Fetching AI commands...');
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('❌ User not authenticated:', userError);
        throw new Error('Authentication required');
      }

      console.log('✅ User authenticated:', user.id);
      
      // Check if user has admin role using secure function
      const { data: adminCheck, error: adminError } = await supabase
        .rpc('verify_admin_access_secure', { user_id: user.id });
      
      if (adminError) {
        console.error('❌ Admin check failed:', adminError);
        throw new Error('Admin access verification failed');
      }
      
      if (!adminCheck) {
        console.error('❌ User is not admin');
        throw new Error('Admin privileges required');
      }
      
      console.log('✅ Admin access verified, fetching commands...');
      
      // Optimized query - select specific fields for performance
      const { data, error } = await supabase
        .from('ai_commands')
        .select(`
          id, 
          name, 
          description, 
          code,
          category, 
          command_type, 
          priority, 
          execution_timeout, 
          is_active, 
          created_at, 
          updated_at, 
          created_by, 
          site_url
        `)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('❌ Error fetching AI commands:', error);
        throw error;
      }
      
      console.log('✅ AI Commands fetched successfully:', data?.length || 0, 'commands');
      return (data as AICommand[]) || [];
    },
    retry: (failureCount, error: any) => {
      // Don't retry on permission errors
      if (error?.message?.includes('Admin') || 
          error?.message?.includes('required') ||
          error?.message?.includes('privileges') ||
          error?.message?.includes('Authentication')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: 1000,
  });
};
