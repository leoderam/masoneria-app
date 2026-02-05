-- Enable Row Level Security
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.logias ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;

-- 1. LOGIAS
CREATE TABLE IF NOT EXISTS public.logias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    rito TEXT,
    ubicacion TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PROFILES (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    full_name TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. MEMBERSHIPS (User-Logia association)
-- Grades: 1=Aprendiz, 2=Compañero, 3=Maestro
CREATE TABLE IF NOT EXISTS public.memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    logia_id UUID REFERENCES public.logias(id) ON DELETE CASCADE,
    grade INTEGER NOT NULL DEFAULT 1,
    cargo TEXT,
    is_logia_admin BOOLEAN DEFAULT false,
    is_super_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, logia_id)
);

-- 4. RESOURCES (Library)
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT, -- 'pdf', 'image', 'video', 'link'
    storage_path TEXT,
    external_url TEXT,
    logia_id UUID REFERENCES public.logias(id),
    min_grade INTEGER DEFAULT 1,
    required_cargo TEXT,
    created_by UUID REFERENCES public.profiles(id),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. EVENTS
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    logia_id UUID REFERENCES public.logias(id),
    min_grade INTEGER DEFAULT 1,
    event_date TIMESTAMPTZ NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. PRODUCTS (Store)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    total DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'cancelled'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS POLICIES

-- Logias: Everyone can see names (for registration), but maybe filter
CREATE POLICY "Public logias are viewable by everyone" ON public.logias
    FOR SELECT USING (true);

-- Profiles: Users can see their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Memberships: Users can see their own memberships
CREATE POLICY "Users can view own memberships" ON public.memberships
    FOR SELECT USING (auth.uid() = user_id);

-- Resources: Complex Policy
-- 1. Public resources are viewable by everyone
-- 2. Private resources need membership in logia AND grade >= min_grade
CREATE POLICY "Resources visibility" ON public.resources
    FOR SELECT USING (
        is_public = true OR (
            EXISTS (
                SELECT 1 FROM public.memberships m
                WHERE m.user_id = auth.uid()
                AND m.logia_id = public.resources.logia_id
                AND m.grade >= public.resources.min_grade
            )
        )
    );

-- Admin Policy for Resources (Logia Admins can manage)
CREATE POLICY "Admins can manage logia resources" ON public.resources
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.memberships m
            WHERE m.user_id = auth.uid()
            AND m.logia_id = public.resources.logia_id
            AND (m.is_logia_admin = true OR m.is_super_admin = true)
        )
    );

-- Events visibility policy
CREATE POLICY "Events visibility" ON public.events
    FOR SELECT USING (
        is_public = true OR (
            EXISTS (
                SELECT 1 FROM public.memberships m
                WHERE m.user_id = auth.uid()
                AND m.logia_id = public.events.logia_id
                AND m.grade >= public.events.min_grade
            )
        )
    );

-- Products visibility
CREATE POLICY "Public products viewable by everyone" ON public.products
    FOR SELECT USING (is_public = true);

-- Orders: Users can see own orders
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

-- FUNCTIONS & TRIGGERS
-- Sync profiles with auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, is_active)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', true);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
