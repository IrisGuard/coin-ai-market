
-- COMPREHENSIVE RLS POLICY CLEANUP - PHASE 2
-- Fix AdminTransactionsTab and all admin access issues

-- Step 1: Clean Payment Transactions Policies
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Users can create their own transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON public.payment_transactions;

-- Add clean admin policy for payment_transactions
CREATE POLICY "admin_manage_payment_transactions" ON public.payment_transactions
FOR ALL USING (public.verify_admin_access_secure());

-- Add user policies for payment_transactions (streamlined)
CREATE POLICY "users_view_own_payment_transactions" ON public.payment_transactions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_create_own_payment_transactions" ON public.payment_transactions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Step 2: Clean Duplicate AI/Automation Policies
DROP POLICY IF EXISTS "Admins can manage ai_commands" ON public.ai_commands;
DROP POLICY IF EXISTS "Admin users can manage AI commands" ON public.ai_commands;
DROP POLICY IF EXISTS "Enable all operations for admin users" ON public.ai_commands;
DROP POLICY IF EXISTS "Admin full access to ai_commands" ON public.ai_commands;

DROP POLICY IF EXISTS "Admins can manage automation_rules" ON public.automation_rules;
DROP POLICY IF EXISTS "Admin full access to automation_rules" ON public.automation_rules;

DROP POLICY IF EXISTS "Admins can manage prediction_models" ON public.prediction_models;
DROP POLICY IF EXISTS "Admin full access to prediction_models" ON public.prediction_models;

-- Keep only single optimized admin policies
CREATE POLICY "admin_manage_ai_commands_clean" ON public.ai_commands
FOR ALL USING (public.verify_admin_access_secure());

CREATE POLICY "admin_manage_automation_rules_clean" ON public.automation_rules
FOR ALL USING (public.verify_admin_access_secure());

CREATE POLICY "admin_manage_prediction_models_clean" ON public.prediction_models
FOR ALL USING (public.verify_admin_access_secure());

-- Step 3: Clean Core Table Policies (keep essential, remove duplicates)
-- Coins table cleanup
DROP POLICY IF EXISTS "Admins can manage all coins" ON public.coins;
DROP POLICY IF EXISTS "Admin full access to coins" ON public.coins;
DROP POLICY IF EXISTS "Dealers can manage their coins" ON public.coins;

-- Keep streamlined coins policies
CREATE POLICY "admin_manage_coins_clean" ON public.coins
FOR ALL USING (public.verify_admin_access_secure());

CREATE POLICY "users_view_coins" ON public.coins
FOR SELECT USING (true); -- Public viewing

CREATE POLICY "owners_manage_coins" ON public.coins
FOR ALL USING (auth.uid() = user_id);

-- Profiles table cleanup
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin full access to profiles" ON public.profiles;

-- Keep streamlined profiles policies
CREATE POLICY "admin_manage_profiles_clean" ON public.profiles
FOR ALL USING (public.verify_admin_access_secure());

CREATE POLICY "users_view_public_profiles" ON public.profiles
FOR SELECT USING (true); -- Public viewing for marketplace

CREATE POLICY "users_manage_own_profile" ON public.profiles
FOR ALL USING (auth.uid() = id);

-- Step 4: Add Missing Admin Policies for System Tables
-- Error logs
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_manage_error_logs" ON public.error_logs
FOR ALL USING (public.verify_admin_access_secure());

-- Analytics events
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_manage_analytics_events" ON public.analytics_events
FOR ALL USING (public.verify_admin_access_secure());

-- Performance metrics
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_manage_performance_metrics" ON public.performance_metrics
FOR ALL USING (public.verify_admin_access_secure());

-- System metrics
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_manage_system_metrics" ON public.system_metrics
FOR ALL USING (public.verify_admin_access_secure());

-- Bulk operations
ALTER TABLE public.bulk_operations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_manage_bulk_operations" ON public.bulk_operations
FOR ALL USING (public.verify_admin_access_secure());

-- Security incidents
ALTER TABLE public.security_incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_manage_security_incidents" ON public.security_incidents
FOR ALL USING (public.verify_admin_access_secure());

-- Market analytics
ALTER TABLE public.market_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_manage_market_analytics" ON public.market_analytics
FOR ALL USING (public.verify_admin_access_secure());

-- Revenue forecasts
ALTER TABLE public.revenue_forecasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_manage_revenue_forecasts" ON public.revenue_forecasts
FOR ALL USING (public.verify_admin_access_secure());

-- Data quality reports
ALTER TABLE public.data_quality_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_manage_data_quality_reports" ON public.data_quality_reports
FOR ALL USING (public.verify_admin_access_secure());

-- Step 5: Performance Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON public.payment_transactions (user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_coin_id ON public.payment_transactions (coin_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status_created ON public.payment_transactions (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON public.payment_transactions (created_at DESC);

-- Admin dashboard performance indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role_verified ON public.profiles (role, verified_dealer) WHERE role IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_coins_user_featured ON public.coins (user_id, featured, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_type_created ON public.error_logs (error_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_timestamp ON public.analytics_events (event_type, timestamp DESC);

-- User roles lookup optimization (critical for admin verification)
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role_lookup ON public.user_roles (user_id, role);

-- Step 6: Grant Necessary Permissions
GRANT SELECT ON public.payment_transactions TO authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.coins TO authenticated;

-- Documentation
COMMENT ON TABLE public.payment_transactions IS 'Payment transactions with clean RLS policies for admin management';
COMMENT ON POLICY "admin_manage_payment_transactions" ON public.payment_transactions IS 'Admin full access to payment transactions';
COMMENT ON POLICY "users_view_own_payment_transactions" ON public.payment_transactions IS 'Users can view their own transactions';

-- Success message
SELECT 'RLS Policy Cleanup Complete - AdminTransactionsTab should now work properly' as status;
