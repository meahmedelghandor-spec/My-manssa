-- Create a SECURITY DEFINER function to check role without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin_or_teacher()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND (role = 'teacher' OR role = 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policy for admins and teachers to view all profiles
CREATE POLICY "Admins and teachers can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  public.is_admin_or_teacher()
);
