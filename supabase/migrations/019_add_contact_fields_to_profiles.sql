-- 1. Add new columns to profiles table for extra contact info
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS secondary_phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS contact_email TEXT;
