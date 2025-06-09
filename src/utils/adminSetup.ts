
import { supabase } from '@/integrations/supabase/client';

export const checkAndSetupAdmin = async (userEmail: string, userId: string) => {
  // Check if this is the admin email
  if (userEmail === 'admin@coinai.com') {
    try {
      // Call the function to set up admin role
      const { error } = await supabase.rpc('create_default_admin');
      
      if (error) {
        console.error('Error setting up admin:', error);
      } else {
        console.log('Admin role setup completed for:', userEmail);
      }
    } catch (error) {
      console.error('Error in admin setup:', error);
    }
  }
};
