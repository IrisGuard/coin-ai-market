import { supabase } from '@/integrations/supabase/client';
import { 
  verifyEnhancedAdminAccess, 
  enhancedSafeQuery, 
  handleEnhancedSupabaseError,
  logEnhancedSecurityEvent 
} from './enhancedSupabaseSecurityHelpers';

// Keep backwards compatibility while using enhanced security
export const verifyAdminAccess = verifyEnhancedAdminAccess;
export const safeQuery = enhancedSafeQuery;
export const handleSupabaseError = handleEnhancedSupabaseError;
export const logSecurityEvent = logEnhancedSecurityEvent;
