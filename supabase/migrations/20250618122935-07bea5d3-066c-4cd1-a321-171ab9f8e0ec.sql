
-- PHASE 3: MULTI-IMAGE INTEGRATION SQL MIGRATION

-- First, add support for multiple images in coins table
ALTER TABLE public.coins 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Update the specific GREECE coin with proper Supabase URLs (removing blob URLs)
UPDATE public.coins 
SET 
  image = 'https://wdgnllgbfvjgurbqhfqb.supabase.co/storage/v1/object/public/coin-images/greece-10-lepta-main.jpg',
  obverse_image = 'https://wdgnllgbfvjgurbqhfqb.supabase.co/storage/v1/object/public/coin-images/greece-10-lepta-obverse.jpg',
  reverse_image = 'https://wdgnllgbfvjgurbqhfqb.supabase.co/storage/v1/object/public/coin-images/greece-10-lepta-reverse.jpg',
  images = ARRAY[
    'https://wdgnllgbfvjgurbqhfqb.supabase.co/storage/v1/object/public/coin-images/greece-10-lepta-main.jpg',
    'https://wdgnllgbfvjgurbqhfqb.supabase.co/storage/v1/object/public/coin-images/greece-10-lepta-obverse.jpg',
    'https://wdgnllgbfvjgurbqhfqb.supabase.co/storage/v1/object/public/coin-images/greece-10-lepta-reverse.jpg',
    'https://wdgnllgbfvjgurbqhfqb.supabase.co/storage/v1/object/public/coin-images/greece-10-lepta-detail1.jpg',
    'https://wdgnllgbfvjgurbqhfqb.supabase.co/storage/v1/object/public/coin-images/greece-10-lepta-detail2.jpg',
    'https://wdgnllgbfvjgurbqhfqb.supabase.co/storage/v1/object/public/coin-images/greece-10-lepta-detail3.jpg'
  ]
WHERE name LIKE '%GREECE%' AND name LIKE '%10 LEPTA%';

-- Clean up any remaining blob URLs across all coins
UPDATE public.coins 
SET 
  image = CASE 
    WHEN image LIKE 'blob:%' THEN 'https://wdgnllgbfvjgurbqhfqb.supabase.co/storage/v1/object/public/coin-images/placeholder-coin.png'
    ELSE image 
  END,
  obverse_image = CASE 
    WHEN obverse_image LIKE 'blob:%' THEN NULL
    ELSE obverse_image 
  END,
  reverse_image = CASE 
    WHEN reverse_image LIKE 'blob:%' THEN NULL
    ELSE reverse_image 
  END;

-- Create index for better performance on images array
CREATE INDEX IF NOT EXISTS idx_coins_images_gin ON public.coins USING gin(images);

-- Create function to get all coin images in proper order
CREATE OR REPLACE FUNCTION public.get_coin_images(coin_row public.coins)
RETURNS TEXT[]
LANGUAGE sql
STABLE
AS $$
  SELECT CASE 
    WHEN coin_row.images IS NOT NULL AND array_length(coin_row.images, 1) > 0 THEN
      coin_row.images
    ELSE
      ARRAY[
        coin_row.image,
        coin_row.obverse_image,
        coin_row.reverse_image
      ]::TEXT[]
  END;
$$;
