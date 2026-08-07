-- Enable teachers/admins to update courses
CREATE POLICY "Only teachers can update courses" 
ON public.courses FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin')
  )
);

-- Enable teachers/admins to delete courses
CREATE POLICY "Only teachers can delete courses" 
ON public.courses FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin')
  )
);
