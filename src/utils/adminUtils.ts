
import { supabase } from '@/integrations/supabase/client';

// Check if user has admin role using the new secure function
export const checkAdminRole = async (userId: string): Promise<boolean> => {
  try {
    console.log('🔍 Checking admin role for user:', userId);
    
    // Use the new secure function that prevents infinite recursion
    const { data, error } = await supabase.rpc('is_user_admin', { 
      check_user_id: userId 
    });
    
    if (error) {
      console.error('❌ Error calling is_user_admin:', error);
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

// Enhanced admin check using the new secure function
export const verifyAdminAccess = async (): Promise<boolean> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('❌ No authenticated user found');
      return false;
    }

    // Use the new secure function
    const { data, error } = await supabase.rpc('is_admin_secure');
    
    if (error) {
      console.error('❌ Admin verification error:', error);
      return false;
    }

    if (data) {
      console.log('✅ Admin verified via secure function');
      return true;
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

// Create first admin user
export const createFirstAdmin = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('🔧 Creating first admin for email:', email);
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, message: 'No authenticated user found' };
    }

    // Check if user's email matches the provided email
    if (user.email !== email) {
      return { success: false, message: 'Email does not match current user' };
    }

    // Use the RPC function to create the first admin safely
    const { data, error } = await supabase.rpc('create_first_admin_safely', {
      target_user_id: user.id,
      admin_role: 'admin'
    });

    if (error) {
      console.error('❌ Error creating first admin:', error);
      return { success: false, message: error.message };
    }

    if (data) {
      console.log('✅ First admin created successfully');
      return { success: true, message: 'Admin user created successfully' };
    } else {
      return { success: false, message: 'Admin user already exists' };
    }
  } catch (error) {
    console.error('❌ Failed to create first admin:', error);
    return { success: false, message: 'Failed to create admin user' };
  }
};

// Check admin status (alias for getCurrentUserAdminStatus)
export const checkAdminStatus = async (): Promise<boolean> => {
  return await getCurrentUserAdminStatus();
};

// Log admin activity with correct column names
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
        target_type: 'system',
        details: details || {}
      });

    console.log('📝 Admin activity logged:', action);
  } catch (error) {
    console.error('❌ Failed to log admin activity:', error);
  }
};
