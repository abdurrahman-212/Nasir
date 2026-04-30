-- RUN THIS IN YOUR SUPABASE SQL EDITOR

-- 1. Tables Creation & Column Fixes
CREATE TABLE IF NOT EXISTS public.about (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    title TEXT,
    bio TEXT,
    mission TEXT,
    profile_image TEXT,
    content TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist and are nullable for existing tables
ALTER TABLE public.about ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.about ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.about ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.about ADD COLUMN IF NOT EXISTS mission TEXT;
ALTER TABLE public.about ADD COLUMN IF NOT EXISTS profile_image TEXT;
ALTER TABLE public.about ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '';

-- Explicitly drop NOT NULL constraints and set defaults to ensure compatibility
UPDATE public.about SET content = '' WHERE content IS NULL;
ALTER TABLE public.about ALTER COLUMN content SET DEFAULT '';
ALTER TABLE public.about ALTER COLUMN content DROP NOT NULL;
ALTER TABLE public.about ALTER COLUMN name DROP NOT NULL;
ALTER TABLE public.about ALTER COLUMN title DROP NOT NULL;
ALTER TABLE public.about ALTER COLUMN bio DROP NOT NULL;
ALTER TABLE public.about ALTER COLUMN mission DROP NOT NULL;
ALTER TABLE public.about ALTER COLUMN profile_image DROP NOT NULL;

-- ENHANCED POSTS TABLE SETUP
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    slug TEXT UNIQUE,
    content TEXT DEFAULT '',
    excerpt TEXT,
    image_url TEXT,
    category TEXT,
    tags TEXT[],
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all post columns exist (Crucial for the "category" error)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT FALSE;

-- Ensure constraints are flexible for frontend
ALTER TABLE public.posts ALTER COLUMN title DROP NOT NULL;
ALTER TABLE public.posts ALTER COLUMN slug DROP NOT NULL;
ALTER TABLE public.posts ALTER COLUMN content DROP NOT NULL;
ALTER TABLE public.posts ALTER COLUMN category DROP NOT NULL;
ALTER TABLE public.posts ALTER COLUMN excerpt DROP NOT NULL;

-- Set defaults for content to prevent NULL errors
UPDATE public.posts SET content = '' WHERE content IS NULL;
ALTER TABLE public.posts ALTER COLUMN content SET DEFAULT '';

-- Force a Schema Cache Refresh by adding a comment (Standard way to nudge PostgREST)
COMMENT ON TABLE public.posts IS 'Schema refreshed to include category and content columns';
COMMENT ON TABLE public.about IS 'Schema refreshed for about table';

CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    degree TEXT,
    institution TEXT,
    period TEXT,
    type TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist and are nullable for existing tables
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS degree TEXT;
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS institution TEXT;
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS period TEXT;
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE public.education ALTER COLUMN degree DROP NOT NULL;
ALTER TABLE public.education ALTER COLUMN institution DROP NOT NULL;
ALTER TABLE public.education ALTER COLUMN period DROP NOT NULL;
ALTER TABLE public.education ALTER COLUMN type DROP NOT NULL;

CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    category TEXT,
    level INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 5;
ALTER TABLE public.skills ALTER COLUMN name DROP NOT NULL;

-- 2. Storage Setup & Security Policies
-- This fixes the "new row violates row-level security policy" error for uploads.

-- Ensure buckets exist and are public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio', 'portfolio', true), ('profile', 'profile', true), ('posts', 'posts', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies (Allowing Anonymous Uploads for this specific app setup)
-- Note: In a production app, you would restrict this to authenticated users.

-- Delete existing policies to avoid conflicts if re-running
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Select" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
DROP POLICY IF EXISTS "ais_public_upload" ON storage.objects;
DROP POLICY IF EXISTS "ais_public_update" ON storage.objects;
DROP POLICY IF EXISTS "ais_public_select" ON storage.objects;
DROP POLICY IF EXISTS "ais_public_delete" ON storage.objects;

-- Create broad policies with unique names for simplicity in this setup
CREATE POLICY "ais_public_upload" ON storage.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "ais_public_update" ON storage.objects FOR UPDATE WITH CHECK (true);
CREATE POLICY "ais_public_select" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "ais_public_delete" ON storage.objects FOR DELETE WITH CHECK (true);

-- 3. Enable RLS on Tables
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Public Read Access
DROP POLICY IF EXISTS "Public Select All" ON public.about;
DROP POLICY IF EXISTS "Public Select All" ON public.posts;
DROP POLICY IF EXISTS "Public Select All" ON public.education;
DROP POLICY IF EXISTS "Public Select All" ON public.skills;

CREATE POLICY "Public Select All" ON public.about FOR SELECT USING (true);
CREATE POLICY "Public Select All" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Public Select All" ON public.education FOR SELECT USING (true);
CREATE POLICY "Public Select All" ON public.skills FOR SELECT USING (true);
