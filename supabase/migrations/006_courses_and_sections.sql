-- 1. Add "section" to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS section TEXT;

-- 2. Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  grade TEXT NOT NULL,
  section TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Turn on Row Level Security for courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Courses viewable by everyone
CREATE POLICY "Courses are viewable by everyone" 
ON public.courses FOR SELECT 
TO authenticated 
USING (true);

-- Only teachers/admins can insert courses
CREATE POLICY "Only teachers can insert courses" 
ON public.courses FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin')
  )
);

-- 3. Modify lectures table
ALTER TABLE public.lectures ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id);
ALTER TABLE public.lectures ADD COLUMN IF NOT EXISTS unit_name TEXT;
ALTER TABLE public.lectures ADD COLUMN IF NOT EXISTS lesson_name TEXT;

-- We can make chapter nullable since we are moving to unit_name and lesson_name
ALTER TABLE public.lectures ALTER COLUMN chapter DROP NOT NULL;


-- 4. Update Trigger function to include section
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, grade, section, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'grade',
    new.raw_user_meta_data->>'section',
    'student'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
