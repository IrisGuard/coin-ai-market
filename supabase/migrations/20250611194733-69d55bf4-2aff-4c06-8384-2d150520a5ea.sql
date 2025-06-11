
-- First, add the missing updated_at column to external_price_sources
ALTER TABLE external_price_sources 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Add comprehensive international eBay sources with proper scraping configurations
INSERT INTO external_price_sources (
  source_name, 
  base_url, 
  source_type, 
  is_active, 
  reliability_score, 
  rate_limit_per_hour, 
  requires_proxy, 
  priority_score, 
  supported_currencies, 
  market_focus, 
  specializes_in_errors, 
  error_categories,
  scraping_enabled,
  pricing_methodology,
  update_frequency_hours
) VALUES
-- North America
('eBay United States', 'https://www.ebay.com', 'marketplace', true, 0.92, 100, false, 95, ARRAY['USD'], ARRAY['coins', 'rare_coins', 'error_coins'], true, ARRAY['doubled_die', 'off_center', 'clipped_planchet'], true, 'auction_average', 6),
('eBay Canada', 'https://www.ebay.ca', 'marketplace', true, 0.88, 80, false, 85, ARRAY['CAD', 'USD'], ARRAY['coins', 'rare_coins'], true, ARRAY['doubled_die', 'mint_errors'], true, 'auction_average', 8),

-- Europe
('eBay United Kingdom', 'https://www.ebay.co.uk', 'marketplace', true, 0.90, 90, false, 90, ARRAY['GBP', 'EUR'], ARRAY['coins', 'british_coins', 'error_coins'], true, ARRAY['doubled_die', 'off_center'], true, 'auction_average', 6),
('eBay Germany', 'https://www.ebay.de', 'marketplace', true, 0.87, 85, false, 88, ARRAY['EUR'], ARRAY['coins', 'german_coins', 'european_coins'], true, ARRAY['mint_errors', 'die_errors'], true, 'auction_average', 8),
('eBay France', 'https://www.ebay.fr', 'marketplace', true, 0.85, 75, false, 82, ARRAY['EUR'], ARRAY['coins', 'french_coins', 'european_coins'], true, ARRAY['doubled_die', 'planchet_errors'], true, 'auction_average', 12),
('eBay Italy', 'https://www.ebay.it', 'marketplace', true, 0.83, 70, false, 80, ARRAY['EUR'], ARRAY['coins', 'italian_coins', 'ancient_coins'], true, ARRAY['die_errors', 'strike_errors'], true, 'auction_average', 12),
('eBay Spain', 'https://www.ebay.es', 'marketplace', true, 0.82, 65, false, 78, ARRAY['EUR'], ARRAY['coins', 'spanish_coins', 'peseta_coins'], true, ARRAY['mint_errors'], true, 'auction_average', 12),
('eBay Netherlands', 'https://www.ebay.nl', 'marketplace', true, 0.84, 70, false, 79, ARRAY['EUR'], ARRAY['coins', 'dutch_coins', 'european_coins'], true, ARRAY['doubled_die'], true, 'auction_average', 12),
('eBay Belgium', 'https://www.ebay.be', 'marketplace', true, 0.81, 60, false, 76, ARRAY['EUR'], ARRAY['coins', 'belgian_coins'], true, ARRAY['mint_errors'], true, 'auction_average', 24),

-- Asia Pacific
('eBay Australia', 'https://www.ebay.com.au', 'marketplace', true, 0.86, 75, false, 83, ARRAY['AUD'], ARRAY['coins', 'australian_coins', 'commonwealth_coins'], true, ARRAY['doubled_die', 'off_center'], true, 'auction_average', 8),
('eBay Japan', 'https://www.ebay.co.jp', 'marketplace', true, 0.84, 60, true, 81, ARRAY['JPY'], ARRAY['coins', 'japanese_coins', 'asian_coins'], true, ARRAY['mint_errors'], true, 'auction_average', 12),
('eBay Singapore', 'https://www.ebay.com.sg', 'marketplace', true, 0.80, 50, false, 75, ARRAY['SGD', 'USD'], ARRAY['coins', 'asian_coins'], true, ARRAY['error_coins'], true, 'auction_average', 24),

-- Other Regions
('eBay Ireland', 'https://www.ebay.ie', 'marketplace', true, 0.83, 55, false, 77, ARRAY['EUR'], ARRAY['coins', 'irish_coins', 'celtic_coins'], true, ARRAY['doubled_die'], true, 'auction_average', 24),
('eBay Austria', 'https://www.ebay.at', 'marketplace', true, 0.82, 55, false, 76, ARRAY['EUR'], ARRAY['coins', 'austrian_coins', 'european_coins'], true, ARRAY['mint_errors'], true, 'auction_average', 24),
('eBay Switzerland', 'https://www.ebay.ch', 'marketplace', true, 0.85, 60, false, 80, ARRAY['CHF', 'EUR'], ARRAY['coins', 'swiss_coins'], true, ARRAY['die_errors'], true, 'auction_average', 24),
('eBay Poland', 'https://www.ebay.pl', 'marketplace', true, 0.79, 45, false, 72, ARRAY['PLN', 'EUR'], ARRAY['coins', 'polish_coins'], true, ARRAY['mint_errors'], true, 'auction_average', 24);

-- Create enhanced AI commands for eBay global operations
INSERT INTO ai_commands (
  name,
  description,
  command_type,
  category,
  code,
  input_schema,
  output_schema,
  is_active,
  priority
) VALUES
('ebay_global_coin_scraper', 
 'Scrape coin data from all international eBay sites simultaneously',
 'ebay_multi_region_scraper',
 'web_scraping',
 'global_ebay_scraper',
 '{"coin_keywords": ["string"], "max_price": "number", "regions": ["string"], "error_types": ["string"]}',
 '{"results_by_region": "object", "price_comparison": "object", "arbitrage_opportunities": "array"}',
 true, 9),

('ebay_cross_country_price_analysis',
 'Compare coin prices across all eBay international markets',
 'ebay_price_comparison',
 'market_intelligence', 
 'cross_country_price_analyzer',
 '{"coin_identifier": "string", "target_regions": ["string"], "time_period": "string"}',
 '{"price_matrix": "object", "best_deals": "array", "market_trends": "object"}',
 true, 8),

('ebay_error_coin_global_hunter',
 'Hunt for error coins across all international eBay sites',
 'ebay_error_hunter',
 'expert_analysis',
 'global_error_coin_hunter', 
 '{"error_types": ["string"], "rarity_threshold": "number", "budget_range": "object"}',
 '{"found_errors": "array", "authenticity_analysis": "object", "investment_recommendations": "array"}',
 true, 10),

('ebay_regional_arbitrage_detector',
 'Detect arbitrage opportunities between different eBay regions',
 'ebay_arbitrage_detector',
 'market_intelligence',
 'regional_arbitrage_analyzer',
 '{"coin_categories": ["string"], "profit_threshold": "number", "shipping_costs": "object"}',
 '{"arbitrage_opportunities": "array", "profit_analysis": "object", "risk_assessment": "object"}',
 true, 7);

-- Create source templates table if it doesn't exist
CREATE TABLE IF NOT EXISTS source_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  supported_features text[] DEFAULT '{}',
  default_config jsonb DEFAULT '{}',
  template_config jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create source templates for eBay configurations
INSERT INTO source_templates (
  name,
  description,
  supported_features,
  default_config,
  template_config
) VALUES
('eBay International Template',
 'Template for eBay international sites with regional customization',
 ARRAY['real-time-pricing', 'auction-tracking', 'error-coin-detection', 'multi-currency'],
 '{"rate_limit": 60, "proxy_required": false, "currency_conversion": true, "error_detection": true}',
 '{"search_terms": ["coins", "error coins", "rare coins", "mint error"], "categories": ["Coins & Paper Money"], "condition_filters": ["New", "Used"], "auction_types": ["auction", "buy_it_now"]}'
),
('eBay Error Coin Specialist Template', 
 'Specialized template for error coin hunting across eBay sites',
 ARRAY['error-detection', 'authenticity-verification', 'rarity-assessment', 'investment-analysis'],
 '{"rate_limit": 30, "proxy_required": true, "specialized_search": true, "ai_analysis": true}',
 '{"error_keywords": ["doubled die", "off center", "clipped planchet", "die crack", "mint error"], "rarity_filters": ["scarce", "rare", "very rare"], "authentication_required": true}'
);

-- Create automation rules for eBay global monitoring
INSERT INTO automation_rules (
  name,
  description,
  rule_type,
  trigger_config,
  conditions,
  actions,
  is_active
) VALUES
('eBay Global Price Monitor',
 'Monitor price changes across all eBay international sites',
 'scheduled',
 '{"schedule": "0 */6 * * *", "timezone": "UTC"}',
 '[{"type": "price_change", "threshold": 5}, {"type": "new_listings", "categories": ["error_coins"]}]',
 '[{"type": "scrape_prices", "targets": "all_ebay_sites"}, {"type": "update_cache", "ttl": 21600}, {"type": "notify_users", "conditions": "significant_changes"}]',
 true
),
('eBay Error Coin Alert System',
 'Alert system for new error coin listings across all eBay regions',
 'event_driven',
 '{"event_type": "new_listing", "sources": "ebay_international"}',
 '[{"type": "contains_keywords", "keywords": ["doubled die", "off center", "mint error"]}, {"type": "price_range", "min": 50, "max": 10000}]',
 '[{"type": "ai_analysis", "model": "error_detection"}, {"type": "authenticity_check", "confidence_threshold": 0.8}, {"type": "alert_experts", "priority": "high"}]',
 true
);
