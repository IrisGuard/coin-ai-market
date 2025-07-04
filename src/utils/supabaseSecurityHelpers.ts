import { supabase } from '@/integrations/supabase/client';

export const verifyAdminAccess = async (): Promise<boolean> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return false;

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    return !error && !!data;
  } catch (error) {
    console.error('Admin verification failed:', error);
    return false;
  }
};

export const safeQuery = async <T>(queryFn: () => Promise<T>): Promise<T> => {
  try {
    return await queryFn();
  } catch (error) {
    console.error('Query failed:', error);
    throw error;
  }
};

export const handleSupabaseError = (error: any, operation: string): string => {
  console.error(`${operation} failed:`, error);
  
  if (error?.code === 'PGRST116') {
    return 'No data found';
  }
  
  if (error?.code === '42501') {
    return 'Access denied - insufficient permissions';
  }
  
  if (error?.message?.includes('JWT')) {
    return 'Authentication required';
  }
  
  return error?.message || `${operation} failed`;
};