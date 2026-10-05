-- ==============================================================================
-- 3D PORTFOLIO & CMS: DATABASE SCHEMA & SEED SCRIPT
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. TABLES
CREATE TABLE IF NOT EXISTS public.profile_intro (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL DEFAULT 'Dhanush Rao',
    tagline TEXT NOT NULL DEFAULT 'WebGL & Cloud Architect',
    bio TEXT NOT NULL DEFAULT 'Crafting hyper-interactive digital experiences with Next.js, Three.js, and cloud architectures.',
    avatar_url TEXT DEFAULT '/avatars/male-1.png',
    resume_file_url TEXT DEFAULT '',
    status_badge TEXT DEFAULT 'Available for High-Impact Roles',
    social_links JSONB DEFAULT '{"github":"https://github.com","linkedin":"https://linkedin.com"}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('language', 'database', 'tool', 'soft_skill')),
    icon_url TEXT DEFAULT '',
    proficiency_level INTEGER NOT NULL DEFAULT 85,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.work_experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT DEFAULT 'Remote',
    start_date TEXT NOT NULL DEFAULT '2023',
    end_date TEXT DEFAULT 'Present',
    is_current BOOLEAN DEFAULT true,
    description TEXT NOT NULL DEFAULT '',
    certificate_url TEXT DEFAULT '',
    order_index INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    score_or_cgpa TEXT DEFAULT '3.9 GPA',
    start_year TEXT NOT NULL DEFAULT '2019',
    end_year TEXT NOT NULL DEFAULT '2023',
    description TEXT DEFAULT '',
    order_index INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.certificates_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date TEXT NOT NULL DEFAULT '2024',
    credential_url TEXT DEFAULT '',
    certificate_file_url TEXT DEFAULT '',
    lor_loa_urls JSONB DEFAULT '[]'::jsonb,
    type TEXT NOT NULL DEFAULT 'certificate' CHECK (type IN ('certificate', 'award', 'merit')),
    order_index INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    long_description TEXT DEFAULT '',
    cover_image_url TEXT NOT NULL DEFAULT '',
    demo_link TEXT DEFAULT '',
    github_link TEXT DEFAULT '',
    tech_stack JSONB DEFAULT '["React", "Three.js", "TypeScript"]'::jsonb,
    featured BOOLEAN DEFAULT false,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profile_intro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read profile" ON public.profile_intro;
DROP POLICY IF EXISTS "Public read skills" ON public.skills;
DROP POLICY IF EXISTS "Public read experience" ON public.work_experience;
DROP POLICY IF EXISTS "Public read education" ON public.education;
DROP POLICY IF EXISTS "Public read certificates" ON public.certificates_achievements;
DROP POLICY IF EXISTS "Public read projects" ON public.projects;

DROP POLICY IF EXISTS "Allow write profile" ON public.profile_intro;
DROP POLICY IF EXISTS "Allow write skills" ON public.skills;
DROP POLICY IF EXISTS "Allow write experience" ON public.work_experience;
DROP POLICY IF EXISTS "Allow write education" ON public.education;
DROP POLICY IF EXISTS "Allow write certificates" ON public.certificates_achievements;
DROP POLICY IF EXISTS "Allow write projects" ON public.projects;

CREATE POLICY "Public read profile" ON public.profile_intro FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public read experience" ON public.work_experience FOR SELECT USING (true);
CREATE POLICY "Public read education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Public read certificates" ON public.certificates_achievements FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);

CREATE POLICY "Allow write profile" ON public.profile_intro FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write skills" ON public.skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write experience" ON public.work_experience FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write education" ON public.education FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write certificates" ON public.certificates_achievements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

-- 3. SEED INITIAL DATA
INSERT INTO public.profile_intro (id, full_name, tagline, bio, avatar_url)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Dhanush Rao',
    'WebGL & Cloud Architect',
    'Crafting hyper-interactive digital experiences with Next.js, Three.js, and cloud architectures.',
    '/avatars/male-1.png'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.skills (name, category, icon_url, proficiency_level, order_index) VALUES
('TypeScript / JS', 'language', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg', 95, 1),
('Three.js / WebGL', 'language', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/threejs/threejs-original.svg', 90, 2),
('Next.js 15 & React', 'tool', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg', 98, 3),
('PostgreSQL / Supabase', 'database', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg', 92, 4)
ON CONFLICT DO NOTHING;

INSERT INTO public.certificates_achievements (title, issuer, issue_date, type, order_index) VALUES
('AWS Solutions Architect', 'Amazon Web Services', 'Nov 2024', 'certificate', 1),
('Google Cloud Professional', 'Google Cloud', 'Jan 2024', 'certificate', 2)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (title, short_description, long_description, cover_image_url, featured, order_index) VALUES
('Aether 3D Engine', 'Interactive WebGL spatial canvas with real-time physics.', 'Aether is an advanced 3D spatial playground built on Three.js and custom GLSL shaders.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80', true, 1),
('Nova Quantum Dashboard', 'Real-time financial telemetry dashboard.', 'Nova provides high-frequency analytics streaming with glassmorphic UI.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', true, 2)
ON CONFLICT DO NOTHING;
