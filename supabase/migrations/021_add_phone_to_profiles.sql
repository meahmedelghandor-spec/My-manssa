-- Add phone and email columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Update the trigger function to include phone, email, and section
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, grade, role, section, phone, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'grade',
    'student',
    new.raw_user_meta_data->>'section',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'email'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Backfill existing profiles' phone from auth.users email
-- Since users sign up with phone, their auth email is formatted as {phone}@student.com
UPDATE public.profiles
SET 
  phone = SPLIT_PART(auth.users.email, '@', 1),
  email = auth.users.email
FROM auth.users
WHERE profiles.id = auth.users.id 
  AND profiles.phone IS NULL 
  AND auth.users.email LIKE '%@mr-ahmed.com';
