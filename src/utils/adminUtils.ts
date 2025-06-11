
import { supabase } from '@/integrations/supabase/client';

// Check if user has admin role
export const checkAdminRole = async (userId: string): Promise<boolean> => {
  try {
    console.log('🔍 Checking admin role for user:', userId);
    
    // First check user_roles table
    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError) {
      console.error('❌ Error checking user role:', roleError);
      return false;
    }

    if (userRole) {
      console.log('✅ User has admin role in user_roles');
      return true;
    }

    // Fallback: Check using the admin verification function
    const { data, error } = await supabase.rpc('verify_admin_access_secure');
    
    if (error) {
      console.error('❌ Error calling verify_admin_access_secure:', error);
      return false;
    }

    console.log('✅ Admin verification result:', data);
    return Boolean(data);
  } catch (error) {
    console.error('❌ Admin role check failed:', error);
    return false;
  }
};

// Get current user's admin status
export const getCurrentUserAdminStatus = async (): Promise<boolean> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ Error getting current user:', userError);
      return false;
    }

    return await checkAdminRole(user.id);
  } catch (error) {
    console.error('❌ Failed to get current user admin status:', error);
    return false;
  }
};

// Enhanced admin check with multiple verification methods
export const verifyAdminAccess = async (): Promise<boolean> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('❌ No authenticated user found');
      return false;
    }

    // Method 1: Direct user_roles check
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleError && roleData) {
      console.log('✅ Admin verified via user_roles table');
      return true;
    }

    // Method 2: RPC function check
    const { data: rpcData, error: rpcError } = await supabase.rpc('verify_admin_access_secure');
    
    if (!rpcError && rpcData) {
      console.log('✅ Admin verified via RPC function');
      return true;
    }

    // Method 3: Manual admin_roles table check (if it exists)
    try {
      const { data: adminRoleData, error: adminRoleError } = await supabase
        .from('admin_roles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!adminRoleError && adminRoleData) {
        console.log('✅ Admin verified via admin_roles table');
        return true;
      }
    } catch (adminTableError) {
      console.log('ℹ️ admin_roles table check failed (table may not exist)');
    }

    console.log('❌ Admin verification failed - user is not admin');
    return false;
  } catch (error) {
    console.error('❌ Admin verification error:', error);
    return false;
  }
};

// Setup admin user (for first-time setup)
export const setupAdminUser = async (userId: string): Promise<boolean> => {
  try {
    console.log('🔧 Setting up admin user:', userId);
    
    // Insert or update user role
    const { error } = await supabase
      .from('user_roles')
      .upsert({ 
        user_id: userId, 
        role: 'admin',
        assigned_at: new Date().toISOString()
      });

    if (error) {
      console.error('❌ Error setting up admin user:', error);
      return false;
    }

    console.log('✅ Admin user setup completed');
    return true;
  } catch (error) {
    console.error('❌ Admin setup failed:', error);
    return false;
  }
};

// Log admin activity
export const logAdminActivity = async (
  action: string, 
  details?: Record<string, any>
): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    await supabase
      .from('admin_activity_logs')
      .insert({
        admin_user_id: user.id,
        action,
        details: details || {},
        timestamp: new Date().toISOString()
      });

    console.log('📝 Admin activity logged:', action);
  } catch (error) {
    console.error('❌ Failed to log admin activity:', error);
  }
};
