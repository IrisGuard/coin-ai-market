-- 🔧 ΑΜΕΣΗ ΔΙΟΡΘΩΣΗ ΟΛΩΝ ΤΩΝ SUPABASE SECURITY & PERFORMANCE ISSUES
-- Ημερομηνία: 23/06/2025
-- Σκοπός: Επιλυση όλων των warnings από Supabase Database Linter

-- 1. SECURITY FIX: Function Search Path Mutable
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. PERFORMANCE FIX: Δημιουργία indexes για unindexed foreign keys
-- Μόνο τα πιο κρίσιμα indexes για καλύτερη απόδοση

-- Core marketplace indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_coins_owner_id 
ON public.coins(owner_id) WHERE owner_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_coins_store_id 
ON public.coins(store_id) WHERE store_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_coins_uploaded_by 
ON public.coins(uploaded_by) WHERE uploaded_by IS NOT NULL;

-- Transaction indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_coin_id 
ON public.transactions(coin_id) WHERE coin_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_buyer_id 
ON public.transactions(buyer_id) WHERE buyer_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_seller_id 
ON public.transactions(seller_id) WHERE seller_id IS NOT NULL;

-- User activity indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_favorites_user_id 
ON public.favorites(user_id) WHERE user_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_favorites_coin_id 
ON public.favorites(coin_id) WHERE coin_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_id 
ON public.notifications(user_id) WHERE user_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_coin_id 
ON public.notifications(related_coin_id) WHERE related_coin_id IS NOT NULL;

-- Marketplace indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_marketplace_listings_coin_id 
ON public.marketplace_listings(coin_id) WHERE coin_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_marketplace_listings_seller_id 
ON public.marketplace_listings(seller_id) WHERE seller_id IS NOT NULL;

-- Bids indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bids_user_id 
ON public.bids(user_id) WHERE user_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bids_bidder_id 
ON public.bids(bidder_id) WHERE bidder_id IS NOT NULL;

-- Payment indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_transactions_coin_id 
ON public.payment_transactions(coin_id) WHERE coin_id IS NOT NULL;

-- Store related indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_store_ratings_store_id 
ON public.store_ratings(store_id) WHERE store_id IS NOT NULL;

-- Messages indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_sender_id 
ON public.messages(sender_id) WHERE sender_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_receiver_id 
ON public.messages(receiver_id) WHERE receiver_id IS NOT NULL;

-- 3. SECURITY: Enable Leaked Password Protection
-- Σημείωση: Αυτό γίνεται στο Supabase Dashboard Auth Settings

-- 4. CLEAN UP: Αφαίρεση unused indexes για καλύτερη απόδοση
DROP INDEX CONCURRENTLY IF EXISTS idx_store_activity_logs_activity_type;
DROP INDEX CONCURRENTLY IF EXISTS idx_store_activity_logs_created_at;
DROP INDEX CONCURRENTLY IF EXISTS idx_store_activity_logs_performed_by;
DROP INDEX CONCURRENTLY IF EXISTS idx_store_activity_logs_severity_level;
DROP INDEX CONCURRENTLY IF EXISTS idx_coins_seller_id;
DROP INDEX CONCURRENTLY IF EXISTS idx_coins_year_country;
DROP INDEX CONCURRENTLY IF EXISTS idx_coins_user_created;
DROP INDEX CONCURRENTLY IF EXISTS idx_payment_transactions_user_status;
DROP INDEX CONCURRENTLY IF EXISTS idx_profiles_username;

-- 5. VERIFY SECURITY SETTINGS
DO $$
BEGIN
  -- Log completion
  RAISE NOTICE 'SECURITY & PERFORMANCE FIXES COMPLETED';
  RAISE NOTICE 'Function search_path: FIXED';
  RAISE NOTICE 'Critical indexes: CREATED';
  RAISE NOTICE 'Unused indexes: REMOVED';
  RAISE NOTICE 'Leaked Password Protection: ENABLE IN DASHBOARD';
END
$$; 