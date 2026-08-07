-- 1. Create homeworks table
CREATE TABLE IF NOT EXISTS public.homeworks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create homework_submissions table
CREATE TABLE IF NOT EXISTS public.homework_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  homework_id UUID REFERENCES public.homeworks(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url TEXT,
  grade INTEGER,
  feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(homework_id, student_id)
);

-- 3. Create Storage Buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('homeworks', 'homeworks', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('submissions', 'submissions', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Enable RLS
ALTER TABLE public.homeworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework_submissions ENABLE ROW LEVEL SECURITY;

-- 5. Policies for homeworks
CREATE POLICY "Homeworks are viewable by everyone" ON public.homeworks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only teachers can manage homeworks" ON public.homeworks FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin'))
);

-- 6. Policies for homework_submissions
CREATE POLICY "Students can view own submissions" ON public.homework_submissions FOR SELECT TO authenticated USING (
  student_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin'))
);
CREATE POLICY "Students can insert own submissions" ON public.homework_submissions FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY "Teachers can update submissions" ON public.homework_submissions FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin'))
);

-- 7. Storage Policies
CREATE POLICY "Homework files viewable by everyone" ON storage.objects FOR SELECT TO public USING (bucket_id = 'homeworks');
CREATE POLICY "Teachers can upload homework files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'homeworks' AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin')));

CREATE POLICY "Submissions viewable by teachers and owner" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'submissions' AND (owner = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin'))));
CREATE POLICY "Students can upload submissions" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'submissions');
