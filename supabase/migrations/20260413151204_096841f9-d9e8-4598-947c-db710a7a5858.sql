ALTER TABLE public.public_hooks
ADD CONSTRAINT public_hooks_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;