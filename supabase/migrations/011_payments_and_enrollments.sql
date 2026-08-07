-- 1. Add price column to courses
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0;

-- 2. Create course_enrollments table
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected')),
  payment_method TEXT,
  payment_number TEXT,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(course_id, student_id)
);

-- Enable RLS
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- 3. Enrollment Policies
CREATE POLICY "Students can view own enrollments" ON public.course_enrollments FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY "Students can create own enrollments" ON public.course_enrollments FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY "Teachers can view all enrollments" ON public.course_enrollments FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin'))
);
CREATE POLICY "Teachers can update enrollments" ON public.course_enrollments FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin'))
);

-- 4. Receipts Storage Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Give public access to receipts" ON storage.objects FOR SELECT USING (bucket_id = 'receipts');
CREATE POLICY "Authenticated users can upload receipts" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'receipts');
CREATE POLICY "Authenticated users can delete own receipts" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'receipts' AND owner = auth.uid());
