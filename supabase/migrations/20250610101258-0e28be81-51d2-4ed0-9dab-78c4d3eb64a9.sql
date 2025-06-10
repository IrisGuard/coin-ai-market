
-- Create categories table for admin management
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Categories are viewable by everyone" 
  ON public.categories 
  FOR SELECT 
  USING (true);

-- Create policy for admin write access
CREATE POLICY "Only admins can manage categories" 
  ON public.categories 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'::user_role
    )
  );

-- Insert default categories
INSERT INTO public.categories (name, description, icon, display_order) VALUES
('Ancient Coins', 'Historical coins from ancient civilizations', 'History', 1),
('Modern Coins', 'Contemporary coins and currency', 'Coins', 2),
('Commemorative', 'Special edition and commemorative coins', 'Award', 3),
('Rare Coins', 'Extremely rare and valuable coins', 'Star', 4),
('World Coins', 'International coins from around the world', 'Globe', 5),
('Error Coins', 'Coins with minting errors and varieties', 'AlertTriangle', 6)
ON CONFLICT DO NOTHING;

-- Create storage bucket for category images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('category-images', 'category-images', true)
ON CONFLICT DO NOTHING;

-- Create storage policy for category images
CREATE POLICY "Category images are publicly accessible" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'category-images');

CREATE POLICY "Only admins can upload category images" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'category-images' AND
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'::user_role
    )
  );

CREATE POLICY "Only admins can update category images" 
  ON storage.objects 
  FOR UPDATE 
  USING (
    bucket_id = 'category-images' AND
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'::user_role
    )
  );

CREATE POLICY "Only admins can delete category images" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'category-images' AND
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'::user_role
    )
  );
