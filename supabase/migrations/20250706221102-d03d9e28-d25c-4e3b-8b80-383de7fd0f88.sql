-- Phase 2B.1: Database Schema Extensions for Banknotes & Bullion
-- Step 1: Extend coin_category enum with new categories
ALTER TYPE coin_category ADD VALUE IF NOT EXISTS 'banknotes';
ALTER TYPE coin_category ADD VALUE IF NOT EXISTS 'error_banknotes';
ALTER TYPE coin_category ADD VALUE IF NOT EXISTS 'gold_bullion';
ALTER TYPE coin_category ADD VALUE IF NOT EXISTS 'silver_bullion';

-- Step 2: Create banknotes table
CREATE TABLE public.banknotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  year INTEGER NOT NULL,
  country TEXT,
  series TEXT,
  denomination TEXT,
  condition TEXT,
  grade TEXT NOT NULL DEFAULT 'Ungraded',
  image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  obverse_image TEXT,
  reverse_image TEXT,
  serial_number TEXT,
  printer TEXT,
  security_features TEXT[],
  error_type TEXT,
  error_description TEXT,
  rarity TEXT NOT NULL DEFAULT 'Common',
  authentication_status TEXT DEFAULT 'pending',
  category coin_category DEFAULT 'banknotes',
  user_id UUID NOT NULL,
  owner_id UUID,
  seller_id UUID,
  uploaded_by UUID,
  store_id UUID,
  ai_confidence NUMERIC,
  ai_provider TEXT,
  views INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  is_auction BOOLEAN DEFAULT false,
  auction_end TIMESTAMP WITH TIME ZONE,
  starting_bid NUMERIC,
  reserve_price NUMERIC,
  sold BOOLEAN DEFAULT false,
  sold_at TIMESTAMP WITH TIME ZONE,
  listing_type TEXT DEFAULT 'direct_sale',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 3: Create bullion_bars table  
CREATE TABLE public.bullion_bars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  metal_type TEXT NOT NULL DEFAULT 'gold', -- gold, silver, platinum, palladium
  weight NUMERIC NOT NULL, -- in troy ounces
  purity NUMERIC NOT NULL DEFAULT 0.999, -- purity level (0.999, 0.9999, etc.)
  brand TEXT, -- PAMP Suisse, Valcambi, etc.
  refinery TEXT,
  serial_number TEXT,
  assay_certificate BOOLEAN DEFAULT false,
  hallmarks TEXT[],
  dimensions JSONB, -- width, height, thickness
  image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  obverse_image TEXT,
  reverse_image TEXT,
  certificate_image TEXT,
  condition TEXT DEFAULT 'Mint',
  grade TEXT DEFAULT 'Mint State',
  authentication_status TEXT DEFAULT 'pending',
  category coin_category DEFAULT 'gold_bullion',
  user_id UUID NOT NULL,
  owner_id UUID,
  seller_id UUID,  
  uploaded_by UUID,
  store_id UUID,
  ai_confidence NUMERIC,
  ai_provider TEXT,
  views INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0, 
  featured BOOLEAN DEFAULT false,
  is_auction BOOLEAN DEFAULT false,
  auction_end TIMESTAMP WITH TIME ZONE,
  starting_bid NUMERIC,
  reserve_price NUMERIC,
  sold BOOLEAN DEFAULT false,
  sold_at TIMESTAMP WITH TIME ZONE,
  listing_type TEXT DEFAULT 'direct_sale',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 4: Enable RLS on new tables
ALTER TABLE public.banknotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bullion_bars ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies for banknotes
CREATE POLICY "Admin full access to banknotes" ON public.banknotes FOR ALL USING (verify_admin_access_secure());
CREATE POLICY "Users manage own banknotes" ON public.banknotes FOR ALL USING (
  (auth.uid() = user_id) OR (auth.uid() = owner_id) OR (auth.uid() = seller_id) OR (auth.uid() = uploaded_by)
);
CREATE POLICY "Public read banknotes" ON public.banknotes FOR SELECT USING (true);

-- Step 6: Create RLS policies for bullion_bars  
CREATE POLICY "Admin full access to bullion_bars" ON public.bullion_bars FOR ALL USING (verify_admin_access_secure());
CREATE POLICY "Users manage own bullion_bars" ON public.bullion_bars FOR ALL USING (
  (auth.uid() = user_id) OR (auth.uid() = owner_id) OR (auth.uid() = seller_id) OR (auth.uid() = uploaded_by)
);
CREATE POLICY "Public read bullion_bars" ON public.bullion_bars FOR SELECT USING (true);

-- Step 7: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_banknotes_user_id ON public.banknotes(user_id);
CREATE INDEX IF NOT EXISTS idx_banknotes_category ON public.banknotes(category);
CREATE INDEX IF NOT EXISTS idx_banknotes_country_year ON public.banknotes(country, year);
CREATE INDEX IF NOT EXISTS idx_banknotes_price ON public.banknotes(price);
CREATE INDEX IF NOT EXISTS idx_banknotes_featured ON public.banknotes(featured) WHERE featured = true;

CREATE INDEX IF NOT EXISTS idx_bullion_bars_user_id ON public.bullion_bars(user_id);
CREATE INDEX IF NOT EXISTS idx_bullion_bars_metal_type ON public.bullion_bars(metal_type);
CREATE INDEX IF NOT EXISTS idx_bullion_bars_category ON public.bullion_bars(category);
CREATE INDEX IF NOT EXISTS idx_bullion_bars_weight ON public.bullion_bars(weight);
CREATE INDEX IF NOT EXISTS idx_bullion_bars_price ON public.bullion_bars(price);
CREATE INDEX IF NOT EXISTS idx_bullion_bars_featured ON public.bullion_bars(featured) WHERE featured = true;

-- Step 8: Create update triggers
CREATE TRIGGER update_banknotes_updated_at
    BEFORE UPDATE ON public.banknotes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bullion_bars_updated_at
    BEFORE UPDATE ON public.bullion_bars
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Step 9: Update categories table with new categories
INSERT INTO public.categories (name, description, icon, is_active, display_order) VALUES
('Banknotes', 'Paper money and currency notes from around the world', '💵', true, 20),
('Error Banknotes', 'Banknotes with printing errors, misprints, and varieties', '🚫💵', true, 21),
('Gold Bullion', 'Gold bars, ingots, and bullion products', '🟡', true, 22),
('Silver Bullion', 'Silver bars, ingots, and bullion products', '⚪', true, 23)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order;

-- Step 10: Log Phase 2B.1 completion
INSERT INTO public.analytics_events (
  event_type,
  page_url,
  metadata,
  timestamp
) VALUES (
  'phase_2b1_database_schema_complete',
  '/admin/categories',
  jsonb_build_object(
    'new_categories', jsonb_build_array('banknotes', 'error_banknotes', 'gold_bullion', 'silver_bullion'),
    'new_tables', jsonb_build_array('banknotes', 'bullion_bars'),
    'total_coin_sources', 169,
    'total_banknote_sources', 5,
    'total_bullion_sources', 6,
    'phase_status', 'PHASE_2B1_COMPLETE',
    'next_phase', 'type_definitions_update'
  ),
  now()
);