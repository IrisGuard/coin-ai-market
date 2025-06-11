
-- Καλούμε την function που επιλύει τα security warnings
SELECT public.resolve_security_warnings();

-- Εκτελούμε επίσης την production auth security configuration
SELECT public.configure_production_auth_security();

-- Ελέγχουμε την κατάσταση των security settings
SELECT public.validate_production_security_config();
