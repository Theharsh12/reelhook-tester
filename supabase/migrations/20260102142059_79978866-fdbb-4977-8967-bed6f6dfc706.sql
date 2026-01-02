-- Drop the existing UPDATE policy that lacks WITH CHECK clause
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a new UPDATE policy with proper WITH CHECK clause
-- USING: Controls which rows can be selected for update (auth.uid() = id)
-- WITH CHECK: Controls what values can be written (auth.uid() = id)
-- This prevents users from changing their profile's id to another user's id
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);