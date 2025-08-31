-- Function to add the first user as admin automatically
CREATE OR REPLACE FUNCTION public.add_first_admin()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  first_user_id UUID;
  admin_count INTEGER;
BEGIN
  -- Check if there are any admins already
  SELECT COUNT(*) INTO admin_count 
  FROM public.user_roles 
  WHERE role = 'admin';
  
  -- If no admins exist, make the first user an admin
  IF admin_count = 0 THEN
    -- Get the first user (oldest created)
    SELECT id INTO first_user_id 
    FROM auth.users 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    -- Add admin role if user exists
    IF first_user_id IS NOT NULL THEN
      INSERT INTO public.user_roles (user_id, role, created_at)
      VALUES (first_user_id, 'admin', now())
      ON CONFLICT (user_id, role) DO NOTHING;
      
      RAISE NOTICE 'Added admin role to user: %', first_user_id;
    END IF;
  ELSE
    RAISE NOTICE 'Admin users already exist. No changes made.';
  END IF;
END;
$$;

-- Function to manually add admin role to current user (useful for first setup)
CREATE OR REPLACE FUNCTION public.make_current_user_admin()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'No authenticated user found';
  END IF;
  
  -- Add admin role to current user
  INSERT INTO public.user_roles (user_id, role, created_at)
  VALUES (current_user_id, 'admin', now())
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE 'Added admin role to current user: %', current_user_id;
END;
$$;

-- Execute the function to add first admin
SELECT public.add_first_admin();