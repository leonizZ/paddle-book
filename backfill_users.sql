-- Copy existing users from auth.users to public.profiles
INSERT INTO public.profiles (id, full_name, email)
SELECT 
    id, 
    raw_user_meta_data->>'full_name', 
    email 
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Optionally, set a specific user as admin explicitly if needed
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';
