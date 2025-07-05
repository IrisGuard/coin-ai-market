-- Phase 4: Populate all 30 categories in the database
-- Remove any existing categories first to avoid conflicts
DELETE FROM categories;

-- Insert all 30 categories with proper data
INSERT INTO categories (name, description, icon, image_url, is_active, display_order) VALUES
('US Coins', 'United States coins', 'MapPin', '/categories/us-coins.jpg', true, 1),
('World Coins', 'International coins', 'Globe', '/categories/world-coins.jpg', true, 2),
('Ancient Coins', 'Pre-1000 AD', 'Crown', '/categories/ancient-coins.jpg', true, 3),
('Modern Coins', '1900+ coins', 'Coins', '/categories/modern-coins.jpg', true, 4),
('Gold Coins', 'Gold content', 'DollarSign', '/categories/gold-coins.jpg', true, 5),
('Silver Coins', 'Silver content', 'Coins', '/categories/silver-coins.jpg', true, 6),
('Platinum Coins', 'Platinum content', 'Medal', '/categories/platinum-coins.jpg', true, 7),
('Paper Money', 'Currency notes', 'Banknote', '/categories/paper-money.jpg', true, 8),
('Graded Coins', 'Professionally graded', 'Shield', '/categories/graded-coins.jpg', true, 9),
('Commemorative Coins', 'Special occasions', 'Medal', '/categories/commemorative-coins.jpg', true, 10),
('Proof Coins', 'Mirror finish', 'Star', '/categories/proof-coins.jpg', true, 11),
('Uncirculated Coins', 'Mint condition', 'Target', '/categories/uncirculated-coins.jpg', true, 12),
('Tokens & Medals', 'Non-currency items', 'Medal', '/categories/tokens-medals.jpg', true, 13),
('Bullion Bars', 'Precious metal bars', 'Coins', '/categories/bullion-bars.jpg', true, 14),
('American Coins', 'US/Canada/Mexico', 'MapPin', '/categories/american-coins.jpg', true, 15),
('European Coins', 'European coins', 'Globe', '/categories/european-coins.jpg', true, 16),
('Asian Coins', 'Asian countries', 'Globe', '/categories/asian-coins.jpg', true, 17),
('African Coins', 'African nations', 'Globe', '/categories/african-coins.jpg', true, 18),
('Australian Coins', 'Australia/Oceania', 'Globe', '/categories/australian-coins.jpg', true, 19),
('South American Coins', 'South America', 'Globe', '/categories/south-american-coins.jpg', true, 20),
('Error Coins', 'Minting errors', 'Star', '/categories/error-coins.jpg', true, 21),
('Double Die', 'Double strike error', 'Zap', '/categories/double-die.jpg', true, 22),
('Off-Center Strike', 'Misaligned strike', 'Target', '/categories/off-center-strike.jpg', true, 23),
('Clipped Planchet', 'Missing metal', 'Coins', '/categories/clipped-planchet.jpg', true, 24),
('Broadstrike', 'Expanded coin', 'Coins', '/categories/broadstrike.jpg', true, 25),
('Die Crack', 'Cracked die mark', 'Zap', '/categories/die-crack.jpg', true, 26),
('Lamination Error', 'Metal separation', 'Coins', '/categories/lamination-error.jpg', true, 27),
('Wrong Planchet', 'Wrong metal type', 'AlertCircle', '/categories/wrong-planchet.jpg', true, 28),
('Rotated Die', 'Twisted alignment', 'Clock', '/categories/rotated-die.jpg', true, 29),
('Cud Error', 'Die break error', 'Zap', '/categories/cud-error.jpg', true, 30);

-- Update the categories table to set proper indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Create a function to get category statistics
CREATE OR REPLACE FUNCTION get_category_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  result jsonb := '{}';
  cat_record record;
  coin_count integer;
BEGIN
  -- Get coin counts for each category
  FOR cat_record IN SELECT name FROM categories WHERE is_active = true LOOP
    SELECT COUNT(*) INTO coin_count 
    FROM coins 
    WHERE LOWER(category::text) LIKE LOWER('%' || cat_record.name || '%')
       OR LOWER(name) LIKE LOWER('%' || cat_record.name || '%')
       OR LOWER(description) LIKE LOWER('%' || cat_record.name || '%');
    
    result := jsonb_set(result, 
      ARRAY[LOWER(REPLACE(cat_record.name, ' ', '_'))], 
      to_jsonb(coin_count)
    );
  END LOOP;
  
  RETURN result;
END;
$$;

-- Enable real-time updates for categories
ALTER TABLE categories REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;