-- 1. Create exams table
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  time_limit_minutes INTEGER DEFAULT 60,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  image_url TEXT,
  options JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of strings
  correct_option_index INTEGER NOT NULL, -- 0-based index of the correct option
  points INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create exam_attempts table
CREATE TABLE IF NOT EXISTS public.exam_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER,
  total_score INTEGER
);

-- 4. Create student_answers table (for tracking mistakes)
CREATE TABLE IF NOT EXISTS public.student_answers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  attempt_id UUID REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  selected_option_index INTEGER,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_answers ENABLE ROW LEVEL SECURITY;

-- Policies for exams
CREATE POLICY "Exams are viewable by everyone" ON public.exams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only teachers can manage exams" ON public.exams FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin'))
);

-- Policies for questions
CREATE POLICY "Questions are viewable by everyone" ON public.questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only teachers can manage questions" ON public.questions FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin'))
);

-- Policies for exam_attempts
CREATE POLICY "Students can view own attempts" ON public.exam_attempts FOR SELECT TO authenticated USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin')));
CREATE POLICY "Students can create attempts" ON public.exam_attempts FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students can update own attempts" ON public.exam_attempts FOR UPDATE TO authenticated USING (student_id = auth.uid());

-- Policies for student_answers
CREATE POLICY "Students can view own answers" ON public.student_answers FOR SELECT TO authenticated USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin')));
CREATE POLICY "Students can insert own answers" ON public.student_answers FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
