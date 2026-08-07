-- 1. Add image_url to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Create 'courses' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('courses', 'courses', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage Policies for 'courses' bucket
-- Allow public access to view course images
CREATE POLICY "Course images are viewable by everyone" 
ON storage.objects FOR SELECT 
TO public 
USING ( bucket_id = 'courses' );

-- Allow teachers/admins to insert/update course images
CREATE POLICY "Teachers can upload course images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'courses' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin')
  )
);

CREATE POLICY "Teachers can update course images" 
ON storage.objects FOR UPDATE 
TO authenticated 
WITH CHECK (
  bucket_id = 'courses' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin')
  )
);
