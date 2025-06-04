
import { supabase } from '@/integrations/supabase/client';

export interface CreateAdminResult {
  success: boolean;
  message: string;
  userId?: string;
}

/**
 * Creates the first admin user by calling the Supabase function
 * This should be used only for initial setup
 */
export const createFirstAdmin = async (adminEmail: string): Promise<CreateAdminResult> => {
  try {
    // First check if user exists in auth.users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      return {
        success: false,
        message: `Error checking users: ${usersError.message}`
      };
    }

    const existingUser = users.users.find(user => user.email === adminEmail);
    
    if (!existingUser) {
      return {
        success: false,
        message: `User with email ${adminEmail} not found. Please create an account first.`
      };
    }

    // Call the create_first_admin function
    const { data, error } = await supabase.rpc('create_first_admin', {
      admin_email: adminEmail
    });

    if (error) {
      return {
        success: false,
        message: `Error creating admin: ${error.message}`
      };
    }

    return {
      success: true,
      message: `Successfully created admin user for ${adminEmail}`,
      userId: data
    };

  } catch (error: any) {
    return {
      success: false,
      message: `Unexpected error: ${error.message}`
    };
  }
};

/**
 * Checks if the current user is an admin
 */
export const checkAdminStatus = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase.rpc('is_admin_secure', {
      user_id: user.id
    });

    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return data === true;
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
  (window as any).createFirstAdmin = createFirstAdmin;
  (window as any).checkAdminStatus = checkAdminStatus;
}
