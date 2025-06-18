
-- Update storage policies to allow coin-based image uploads
-- Drop all existing coin-images policies if they exist
DROP POLICY IF EXISTS "Users can upload their own coin images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view coin images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own coin images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own coin images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload coin images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update coin images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete coin images" ON storage.objects;

-- Create new policies that allow coin-based uploads for authenticated users
CREATE POLICY "Authenticated users can upload coin images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'coin-images' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can view coin images" ON storage.objects
FOR SELECT USING (bucket_id = 'coin-images');

CREATE POLICY "Authenticated users can update coin images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'coin-images' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can delete coin images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'coin-images' AND 
  auth.uid() IS NOT NULL
);
