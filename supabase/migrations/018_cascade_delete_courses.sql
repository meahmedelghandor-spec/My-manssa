-- Fix missing ON DELETE CASCADE for lectures -> courses
ALTER TABLE public.lectures
DROP CONSTRAINT IF EXISTS lectures_course_id_fkey;

ALTER TABLE public.lectures
ADD CONSTRAINT lectures_course_id_fkey 
FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
