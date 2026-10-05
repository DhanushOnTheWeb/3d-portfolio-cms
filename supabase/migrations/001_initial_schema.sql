-- ==============================================================================
-- 3D PORTFOLIO & CMS COMPLETE DATABASE MIGRATION SCRIPT
-- IMPORTANT: Copy and paste this ENTIRE file into the Supabase SQL Editor and click "Run".
-- (Do not select or highlight partial snippets, run the whole script all at once)
-- ==============================================================================

-- 1. EXTENSIONS & TRIGGER FUNCTIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 2. TABLE DEFINITIONS
-- ==============================================================================

-- Table 1: profile_intro
CREATE TABLE IF NOT EXISTS public.profile_intro (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL DEFAULT 'Dhanush Rao',
    tagline TEXT NOT NULL DEFAULT 'WebGL & Cloud Architect',
    bio TEXT NOT NULL DEFAULT 'Crafting hyper-interactive digital experiences at the intersection of 3D graphics, generative design, and high-performance full-stack architectures.',
    avatar_url TEXT DEFAULT '/avatars/male-1.png',
    resume_file_url TEXT DEFAULT '',
    status_badge TEXT DEFAULT 'Available for High-Impact Roles',
    social_links JSONB DEFAULT '{
        "github": "https://github.com",
        "linkedin": "https://linkedin.com",
        "twitter": "https://twitter.com",
        "instagram": "https://instagram.com"
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: skills
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('language', 'database', 'tool', 'soft_skill')),
    icon_url TEXT DEFAULT '',
    proficiency_level INTEGER NOT NULL CHECK (proficiency_level BETWEEN 1 AND 100) DEFAULT 80,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 3: work_experience
CREATE TABLE IF NOT EXISTS public.work_experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT DEFAULT 'Remote',
    start_date TEXT NOT NULL,
    end_date TEXT DEFAULT 'Present',
    is_current BOOLEAN DEFAULT false,
    description TEXT NOT NULL DEFAULT '',
    certificate_url TEXT DEFAULT '',
    order_index INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 4: education
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    score_or_cgpa TEXT DEFAULT '3.9 / 4.0 GPA',
    start_year TEXT NOT NULL,
    end_year TEXT NOT NULL,
    description TEXT DEFAULT '',
    order_index INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 5: certificates_achievements
CREATE TABLE IF NOT EXISTS public.certificates_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date TEXT NOT NULL,
    credential_url TEXT DEFAULT '',
    certificate_file_url TEXT DEFAULT '',
    lor_loa_urls JSONB DEFAULT '[]'::jsonb,
    type TEXT NOT NULL CHECK (type IN ('certificate', 'award', 'merit')) DEFAULT 'certificate',
    order_index INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 6: projects
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

-- ==============================================================================
-- 3. AUTOMATIC TIMESTAMP TRIGGERS
-- ==============================================================================

DO $$
BEGIN
    DROP TRIGGER IF EXISTS tr_profile_intro_updated_at ON public.profile_intro;
    CREATE TRIGGER tr_profile_intro_updated_at BEFORE UPDATE ON public.profile_intro
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS tr_skills_updated_at ON public.skills;
    CREATE TRIGGER tr_skills_updated_at BEFORE UPDATE ON public.skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS tr_work_experience_updated_at ON public.work_experience;
    CREATE TRIGGER tr_work_experience_updated_at BEFORE UPDATE ON public.work_experience
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS tr_education_updated_at ON public.education;
    CREATE TRIGGER tr_education_updated_at BEFORE UPDATE ON public.education
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS tr_certificates_achievements_updated_at ON public.certificates_achievements;
    CREATE TRIGGER tr_certificates_achievements_updated_at BEFORE UPDATE ON public.certificates_achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS tr_projects_updated_at ON public.projects;
    CREATE TRIGGER tr_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END $$;

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profile_intro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to ensure idempotency when re-running
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

-- Recreate policies: allow public read and full write permissions for CMS operations
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

-- ==============================================================================
-- 5. STORAGE BUCKET CONFIGURATION (portfolio-media)
-- ==============================================================================

DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'portfolio-media',
        'portfolio-media',
        true,
        10485760, -- 10MB limit
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf']
    )
    ON CONFLICT (id) DO UPDATE SET
        public = true,
        file_size_limit = 10485760;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public access to portfolio-media" ON storage.objects;
    DROP POLICY IF EXISTS "Public upload to portfolio-media" ON storage.objects;
    DROP POLICY IF EXISTS "Public update to portfolio-media" ON storage.objects;
    DROP POLICY IF EXISTS "Public delete from portfolio-media" ON storage.objects;

    CREATE POLICY "Public access to portfolio-media" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-media');
    CREATE POLICY "Public upload to portfolio-media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-media');
    CREATE POLICY "Public update to portfolio-media" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-media');
    CREATE POLICY "Public delete from portfolio-media" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-media');
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- ==============================================================================
-- 6. INITIAL SEED DATA
-- ==============================================================================

-- 6.1 Profile
INSERT INTO public.profile_intro (id, full_name, tagline, bio, avatar_url, resume_file_url, status_badge, social_links)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Dhanush Rao',
    'WebGL & Cloud Architect',
    'Pioneering modern interactive web applications combining WebGL, Next.js, and cloud backends. Passionate about performant design systems, fluid micro-interactions, and reactive interfaces.',
    '/avatars/male-1.png',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'Available for High-Impact Roles',
    '{
        "github": "https://github.com",
        "linkedin": "https://linkedin.com",
        "twitter": "https://twitter.com",
        "instagram": "https://instagram.com"
    }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 6.2 Skills
INSERT INTO public.skills (name, category, icon_url, proficiency_level, order_index, is_visible) VALUES
('TypeScript / JS', 'language', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg', 95, 1, true),
('Three.js / WebGL', 'language', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/threejs/threejs-original.svg', 90, 2, true),
('Next.js 15 & React', 'tool', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg', 98, 3, true),
('PostgreSQL / Supabase', 'database', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg', 92, 4, true),
('Redis & Caching', 'database', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original.svg', 85, 5, true),
('Docker & Kubernetes', 'tool', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg', 84, 6, true),
('System Architecture', 'soft_skill', 'https://raw.githubusercontent.com/devicons/devicon/master/icons/figma/figma-original.svg', 94, 7, true),
('Engineering Leadership', 'soft_skill', '', 90, 8, true)
ON CONFLICT DO NOTHING;

-- 6.3 Work Experience
INSERT INTO public.work_experience (role, company, location, start_date, end_date, is_current, description, certificate_url, order_index, is_visible) VALUES
('Lead Frontend Architect', 'HyperSphere Interactive', 'San Francisco, CA (Remote)', '2023', 'Present', true, 'Architected real-time 3D collaboration canvas handling 100k+ MAU with 60 FPS WebGL rendering. Reduced bundle size by 42% and implemented modular design system.', '', 1, true),
('Senior Full-Stack Engineer', 'Vortex Cloud Labs', 'New York, NY', '2021', '2023', false, 'Spearheaded migration to Next.js App Router and PostgreSQL read-replicas. Built automated CI/CD pipeline and cloud storage microservice.', '', 2, true),
('Creative Web Developer', 'Studio Nebula', 'Seattle, WA', '2019', '2021', false, 'Created award-winning 3D web experiences, microsites, and interactive product configurators using Three.js and GSAP.', '', 3, true)
ON CONFLICT DO NOTHING;

-- 6.4 Education
INSERT INTO public.education (institution, degree, score_or_cgpa, start_year, end_year, description, order_index, is_visible) VALUES
('Stanford University', 'M.S. in Computer Science (Computer Graphics & Distributed Systems)', '3.95 / 4.00 CGPA', '2017', '2019', 'Research focus on real-time hardware-accelerated shaders and distributed consensus protocols.', 1, true),
('University of Washington', 'B.S. in Software Engineering', '3.88 / 4.00 CGPA', '2013', '2017', 'Summa Cum Laude. President of ACM Computer Graphics SIG.', 2, true)
ON CONFLICT DO NOTHING;

-- 6.5 Certificates & Achievements
INSERT INTO public.certificates_achievements (title, issuer, issue_date, credential_url, certificate_file_url, lor_loa_urls, type, order_index, is_visible) VALUES
('AWS Certified Solutions Architect - Professional', 'Amazon Web Services', 'Nov 2024', 'https://aws.amazon.com/verification', '', '[]'::jsonb, 'certificate', 1, true),
('Awwwards Site of the Day & Developer Award', 'Awwwards Committee', 'Aug 2024', 'https://www.awwwards.com', '', '[]'::jsonb, 'award', 2, true),
('Google Cloud Professional Cloud Architect', 'Google Cloud', 'Jan 2024', 'https://cloud.google.com/certification', '', '[]'::jsonb, 'certificate', 3, true),
('National Hackathon First Place Winner', 'TechCrunch Disrupt', 'Oct 2023', 'https://techcrunch.com', '', '[]'::jsonb, 'merit', 4, true)
ON CONFLICT DO NOTHING;

-- 6.6 Projects
INSERT INTO public.projects (title, short_description, long_description, cover_image_url, demo_link, github_link, tech_stack, featured, order_index, is_visible) VALUES
('Aether 3D Engine', 'Interactive WebGL spatial canvas with real-time physics and procedural particle systems.', 'Aether is an advanced 3D spatial computing playground built on Three.js and custom GLSL shaders. Features dynamic physics simulation, audio reactivity, and GPU-driven procedural particle ribbons.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80', 'https://demo.example.com/aether', 'https://github.com/example/aether-3d', '["Three.js", "WebGL", "TypeScript", "GLSL"]'::jsonb, true, 1, true),
('Nova Quantum Dashboard', 'Real-time financial telemetry dashboard with streaming WebSocket analytics.', 'Nova provides high-frequency analytics streaming for decentralized liquidity protocols. Includes custom charting engine, glassmorphic UI, and multi-tenant security.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', 'https://demo.example.com/nova', 'https://github.com/example/nova-quantum', '["Next.js 15", "PostgreSQL", "TailwindCSS", "WebSocket"]'::jsonb, true, 2, true),
('HyperStore Headless E-Commerce', 'Ultra-fast 3D product visualizer with instant augmented reality checkout.', 'Next-generation commerce experience allowing customers to inspect 3D models with ray-marched reflections in their browser, customize colorways in real time, and check out seamlessly.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80', 'https://demo.example.com/hyperstore', 'https://github.com/example/hyperstore-headless', '["React", "Supabase", "Stripe", "Three.js"]'::jsonb, false, 3, true)
ON CONFLICT DO NOTHING;
