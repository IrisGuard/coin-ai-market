
-- ========================================
-- COMPREHENSIVE RLS POLICIES MIGRATION
-- 24 Tables - All Policies Corrected
-- ========================================

-- 1. USER_SETTINGS (user_id based)
DROP POLICY IF EXISTS "Users can manage their own settings" ON public.user_settings;
CREATE POLICY "Users can manage their own settings" 
ON public.user_settings 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- 2. VISUAL_COIN_MATCHES (admin only - no user_id)
DROP POLICY IF EXISTS "Admin access only for visual matches" ON public.visual_coin_matches;
CREATE POLICY "Admin access only for visual matches" 
ON public.visual_coin_matches 
FOR ALL 
USING (public.secure_admin_verification(auth.uid()));

-- 3. STATIC_COINS_DB (public read only)
DROP POLICY IF EXISTS "Public read access to static coins database" ON public.static_coins_db;
CREATE POLICY "Public read access to static coins database" 
ON public.static_coins_db 
FOR SELECT 
USING (true);

-- 4. SEARCH_ANALYTICS (user_id based)
DROP POLICY IF EXISTS "Users can view their own search analytics" ON public.search_analytics;
CREATE POLICY "Users can view their own search analytics" 
ON public.search_analytics 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- 5. USER_ANALYTICS (user_id based)
DROP POLICY IF EXISTS "Users can view their own analytics" ON public.user_analytics;
CREATE POLICY "Users can view their own analytics" 
ON public.user_analytics 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- 6. USER_ACTIVITY (user_id based)
DROP POLICY IF EXISTS "Users can view their own activity" ON public.user_activity;
CREATE POLICY "Users can view their own activity" 
ON public.user_activity 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- 7. USER_FAVORITES (user_id based)
DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.user_favorites;
CREATE POLICY "Users can manage their own favorites" 
ON public.user_favorites 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- 8. USER_PORTFOLIOS (user_id based)
DROP POLICY IF EXISTS "Users can manage their own portfolios" ON public.user_portfolios;
CREATE POLICY "Users can manage their own portfolios" 
ON public.user_portfolios 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- 9. WATCHLIST (user_id based)
DROP POLICY IF EXISTS "Users can manage their own watchlist" ON public.watchlist;
CREATE POLICY "Users can manage their own watchlist" 
ON public.watchlist 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- 10. STORE_RATINGS (user_id based)
DROP POLICY IF EXISTS "Users can manage their own store ratings" ON public.store_ratings;
CREATE POLICY "Users can manage their own store ratings" 
ON public.store_ratings 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- 11. PHOTO_QUALITY_ASSESSMENTS (admin only - no user_id)
DROP POLICY IF EXISTS "Admin access for photo quality assessments" ON public.photo_quality_assessments;
CREATE POLICY "Admin access for photo quality assessments" 
ON public.photo_quality_assessments 
FOR ALL 
USING (public.secure_admin_verification(auth.uid()));

-- 12. WEB_DISCOVERY_RESULTS (admin only - no user_id)
DROP POLICY IF EXISTS "Admin access for web discovery results" ON public.web_discovery_results;
CREATE POLICY "Admin access for web discovery results" 
ON public.web_discovery_results 
FOR ALL 
USING (public.secure_admin_verification(auth.uid()));

-- 13. SOURCE_CATEGORIES (public read only)
DROP POLICY IF EXISTS "Public read access to source categories" ON public.source_categories;
CREATE POLICY "Public read access to source categories" 
ON public.source_categories 
FOR SELECT 
USING (true);

-- 14. SOURCE_TEMPLATES (public read only)
DROP POLICY IF EXISTS "Public read access to source templates" ON public.source_templates;
CREATE POLICY "Public read access to source templates" 
ON public.source_templates 
FOR SELECT 
USING (true);

-- 15. SYSTEM_ALERTS (admin only)
DROP POLICY IF EXISTS "Admin access for system alerts" ON public.system_alerts;
CREATE POLICY "Admin access for system alerts" 
ON public.system_alerts 
FOR ALL 
USING (public.secure_admin_verification(auth.uid()));

-- 16. SYSTEM_CONFIG (admin only)
DROP POLICY IF EXISTS "Admin access for system config" ON public.system_config;
CREATE POLICY "Admin access for system config" 
ON public.system_config 
FOR ALL 
USING (public.secure_admin_verification(auth.uid()));

-- 17. PERFORMANCE_BENCHMARKS (admin only - no user_id)
DROP POLICY IF EXISTS "Admin access for performance benchmarks" ON public.performance_benchmarks;
CREATE POLICY "Admin access for performance benchmarks" 
ON public.performance_benchmarks 
FOR ALL 
USING (public.secure_admin_verification(auth.uid()));

-- 18. USER_PURCHASES (CORRECTED - buyer_id OR seller_id)
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.user_purchases;
CREATE POLICY "Users can view their own purchases" 
ON public.user_purchases 
FOR ALL 
USING (buyer_id = auth.uid() OR seller_id = auth.uid()) 
WITH CHECK (buyer_id = auth.uid() OR seller_id = auth.uid());

-- 19. STORE_VERIFICATIONS (CORRECTED - linked via stores.user_id)
DROP POLICY IF EXISTS "Store owners can manage their verifications" ON public.store_verifications;
CREATE POLICY "Store owners can manage their verifications" 
ON public.store_verifications 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.stores 
    WHERE stores.id = store_verifications.store_id 
    AND stores.user_id = auth.uid()
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.stores 
    WHERE stores.id = store_verifications.store_id 
    AND stores.user_id = auth.uid()
  )
);

-- 20. PRICE_SOURCE_TEMPLATES_ENHANCED (admin only - no user_id)
DROP POLICY IF EXISTS "Admin access for enhanced price source templates" ON public.price_source_templates_enhanced;
CREATE POLICY "Admin access for enhanced price source templates" 
ON public.price_source_templates_enhanced 
FOR ALL 
USING (public.secure_admin_verification(auth.uid()));

-- 21. PROXY_ROTATION_LOG (admin only - no user_id)
DROP POLICY IF EXISTS "Admin access for proxy rotation log" ON public.proxy_rotation_log;
CREATE POLICY "Admin access for proxy rotation log" 
ON public.proxy_rotation_log 
FOR ALL 
USING (public.secure_admin_verification(auth.uid()));

-- 22. REVENUE_FORECASTS (admin only - no user_id)
DROP POLICY IF EXISTS "Admin access for revenue forecasts" ON public.revenue_forecasts;
CREATE POLICY "Admin access for revenue forecasts" 
ON public.revenue_forecasts 
FOR ALL 
USING (public.secure_admin_verification(auth.uid()));

-- 23. SCRAPING_SCHEDULES (admin only - no user_id)
DROP POLICY IF EXISTS "Admin access for scraping schedules" ON public.scraping_schedules;
CREATE POLICY "Admin access for scraping schedules" 
ON public.scraping_schedules 
FOR ALL 
USING (public.secure_admin_verification(auth.uid()));

-- 24. URL_CACHE (admin only - no user_id)
DROP POLICY IF EXISTS "Admin access for URL cache" ON public.url_cache;
CREATE POLICY "Admin access for URL cache" 
ON public.url_cache 
FOR ALL 
USING (public.secure_admin_verification(auth.uid()));

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visual_coin_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.static_coins_db ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_quality_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_discovery_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_source_templates_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proxy_rotation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraping_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.url_cache ENABLE ROW LEVEL SECURITY;
