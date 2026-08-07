-- Create the storage bucket for lectures
INSERT INTO storage.buckets (id, name, public) 
VALUES ('lectures', 'lectures', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read files from 'lectures' bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'lectures');

-- Allow authenticated users (teachers) to upload files
CREATE POLICY "Auth Insert" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'lectures');
