
-- Create public_hooks table for the community leaderboard
CREATE TABLE public.public_hooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hook TEXT NOT NULL,
  score INTEGER NOT NULL,
  verdict TEXT NOT NULL,
  shared_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.public_hooks ENABLE ROW LEVEL SECURITY;

-- Anyone can view shared hooks
CREATE POLICY "Anyone can view public hooks"
ON public.public_hooks
FOR SELECT
USING (true);

-- Only the owner can insert their hooks
CREATE POLICY "Users can share their own hooks"
ON public.public_hooks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Only the owner can delete their hooks
CREATE POLICY "Users can remove their own shared hooks"
ON public.public_hooks
FOR DELETE
USING (auth.uid() = user_id);

-- Allow public read of profiles for leaderboard display names
CREATE POLICY "Public can view profile names"
ON public.profiles
FOR SELECT
USING (true);

-- Drop the old restrictive select policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
