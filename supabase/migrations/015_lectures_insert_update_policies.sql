-- Drop the old insert policy if it exists
DROP POLICY IF EXISTS "Only teachers can insert lectures" ON public.lectures;

-- Create the new insert policy allowing both teachers and admins
CREATE POLICY "Teachers and admins can insert lectures" 
ON public.lectures FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin')
  )
);

-- Create the update policy allowing both teachers and admins
CREATE POLICY "Teachers and admins can update lectures" 
ON public.lectures FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND (profiles.role = 'teacher' OR profiles.role = 'admin')
  )
);
