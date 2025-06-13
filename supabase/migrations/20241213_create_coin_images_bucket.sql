
-- Create the coin-images storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('coin-images', 'coin-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for coin images
CREATE POLICY "Anyone can view coin images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'coin-images');

CREATE POLICY "Authenticated users can upload coin images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'coin-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own coin images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'coin-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own coin images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'coin-images' AND auth.uid()::text = (storage.foldername(name))[1]);
