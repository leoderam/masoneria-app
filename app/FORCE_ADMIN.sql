-- Ensure Leo is Super Admin
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Find user by email
    SELECT id INTO user_uuid FROM auth.users WHERE email = 'leoderam8106@gmail.com';
    
    IF user_uuid IS NOT NULL THEN
        -- Check if membership exists
        IF EXISTS (SELECT 1 FROM public.memberships WHERE user_id = user_uuid) THEN
            UPDATE public.memberships 
            SET is_super_admin = true, 
                is_logia_admin = true,
                grade = 3 -- Maestro
            WHERE user_id = user_uuid;
            RAISE NOTICE 'User Leo updated to Super Admin.';
        ELSE
            -- If no membership, we can't easily assign one without a Logia ID
            -- But usually there is one if they can see the dashboard
            RAISE NOTICE 'User Leo found but has no membership record.';
        END IF;
    ELSE
        RAISE NOTICE 'User Leo not found in auth.users.';
    END IF;
END $$;
