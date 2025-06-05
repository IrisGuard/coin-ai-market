
import { supabase } from '@/integrations/supabase/client';

export interface CreateAdminResult {
  success: boolean;
  message: string;
  userId?: string;
}

/**
 * Creates the first admin user by updating the admin_roles table directly
 * This should be used only for initial setup
 */
export const createFirstAdmin = async (adminEmail: string): Promise<CreateAdminResult> => {
  try {
    // Find user by email in profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', adminEmail)
      .single();

    if (profileError || !profile) {
      return {
        success: false,
        message: `User with email ${adminEmail} not found. Please create an account first.`
      };
    }

    // Check if admin role already exists using the new function
    const { data: isAlreadyAdmin, error: adminCheckError } = await supabase
      .rpc('is_admin_user', { user_id: profile.id });

    if (adminCheckError) {
      return {
        success: false,
        message: `Error checking existing admin status: ${adminCheckError.message}`
      };
    }

    if (isAlreadyAdmin) {
      return {
        success: false,
        message: `User ${adminEmail} is already an admin.`
      };
    }

    // Create admin role
    const { error: insertError } = await supabase
      .from('admin_roles')
      .insert([{
        user_id: profile.id,
        role: 'admin'
      }]);

    if (insertError) {
      return {
        success: false,
        message: `Error creating admin: ${insertError.message}`
      };
    }

    return {
      success: true,
      message: `Successfully created admin user for ${adminEmail}`,
      userId: profile.id
    };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      message: `Unexpected error: ${errorMessage}`
    };
  }
};

/**
 * Checks if the current user is an admin using the new secure function
 */
export const checkAdminStatus = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .rpc('is_admin_user', { user_id: user.id });

    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Unexpected error checking admin status:', error);
    return false;
  }
};

/**
 * Development utility to help set up the first admin
 * This logs instructions for manual admin setup
 */
export const logAdminSetupInstructions = () => {
  console.log(`
🔧 ADMIN SETUP INSTRUCTIONS:

1. Create a user account through the normal signup process
2. Open browser console and run:
   
   // Replace with your email
   const result = await window.createFirstAdmin('your-email@example.com');
   console.log(result);

3. If successful, refresh the page and try accessing admin features

Note: The createFirstAdmin function is available in development console
`);
};

// Make function available in development console
if (typeof window !== 'undefined') {
  const windowAny = window as any;
  windowAny.createFirstAdmin = createFirstAdmin;
  windowAny.checkAdminStatus = checkAdminStatus;
}
