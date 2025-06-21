-- ΔΙΟΡΘΩΣΗ SECURITY WARNING: Function Search Path Mutable
-- Επαναδημιουργία της function update_updated_at_column με immutable search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ΕΠΑΝΕΝΕΡΓΟΠΟΙΗΣΗ LEAKED PASSWORD PROTECTION (αν χρειάζεται)
-- Καλούμε τις υπάρχουσες security functions για να διασφαλίσουμε ότι είναι ενεργό
SELECT public.enable_password_protection();
SELECT public.resolve_security_warnings();
SELECT public.configure_complete_auth_security();
SELECT public.validate_all_security_warnings_resolved(); 