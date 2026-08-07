-- Add description column to lectures table
ALTER TABLE public.lectures ADD COLUMN IF NOT EXISTS description TEXT;
