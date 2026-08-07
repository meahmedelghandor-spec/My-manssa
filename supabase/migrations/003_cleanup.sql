-- 1. Drop existing foreign key constraint if it exists
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Re-add foreign key with ON DELETE CASCADE
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) 
REFERENCES auth.users (id) 
ON DELETE CASCADE;

-- 3. Delete any hung/corrupted user data for this phone number
DELETE FROM auth.users WHERE email = '01090583135@mr-mohamed.com';
DELETE FROM auth.users WHERE phone = '01090583135';
