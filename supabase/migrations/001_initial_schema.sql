-- Drop tables if they already exist to avoid errors (WARNING: This will delete existing data in these tables)
DROP TABLE IF EXISTS public.lectures CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Create a table for users/profiles (linking to Supabase Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'student', -- 'student' or 'teacher'
  grade TEXT, -- 'الصف الأول', 'الصف الثاني', 'الصف الثالث'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Turn on Row Level Security for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);


-- 2. Create a table for lectures/videos
CREATE TABLE public.lectures (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  chapter TEXT NOT NULL,
  video_url TEXT,
  pdf_url TEXT,
  views_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Turn on Row Level Security for lectures
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;

-- Allow everyone (or just authenticated users) to view lectures
CREATE POLICY "Lectures are viewable by everyone" 
ON public.lectures FOR SELECT 
TO authenticated 
USING (true);

-- Allow only teachers/admins to insert/update lectures
CREATE POLICY "Only teachers can insert lectures" 
ON public.lectures FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
  )
);
