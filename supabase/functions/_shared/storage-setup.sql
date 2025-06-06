
-- Create storage bucket for coin images if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'coin-images',
  'coin-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for coin images bucket
CREATE POLICY "Users can upload their own coin images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'coin-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view coin images" ON storage.objects
FOR SELECT USING (bucket_id = 'coin-images');

CREATE POLICY "Users can update their own coin images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'coin-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own coin images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'coin-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
