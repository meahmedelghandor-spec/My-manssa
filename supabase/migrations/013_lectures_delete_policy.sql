-- Enable teachers/admins to delete lectures
CREATE POLICY "Only teachers can delete lectures" 
ON public.lectures FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() 
    AND (profiles.role = 'admin' OR profiles.role = 'teacher')
  )
);
