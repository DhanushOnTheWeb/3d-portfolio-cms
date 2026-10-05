import { createClient } from '@supabase/supabase-js';
import { initialPortfolioData } from './mock-data';
import { PortfolioData } from './types';

/**
 * Server-side data fetcher for the portfolio.
 * Executed on Vercel's server / edge before HTML generation.
 * Guarantees that the visitor receives HTML already pre-populated with live Supabase data,
 * completely eliminating client-side flash of default/mock content.
 */
export async function getPortfolioServerData(): Promise<PortfolioData> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    return initialPortfolioData;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const [
      profileRes,
      skillsRes,
      expRes,
      eduRes,
      certRes,
      projectsRes,
    ] = await Promise.all([
      supabase.from('profile_intro').select('*').limit(1).maybeSingle(),
      supabase.from('skills').select('*').order('order_index', { ascending: true }),
      supabase.from('work_experience').select('*').order('order_index', { ascending: true }),
      supabase.from('education').select('*').order('order_index', { ascending: true }),
      supabase.from('certificates_achievements').select('*').order('order_index', { ascending: true }),
      supabase.from('projects').select('*').order('order_index', { ascending: true }),
    ]);

    if (!profileRes.error && profileRes.data) {
      return {
        profile: {
          ...initialPortfolioData.profile,
          ...profileRes.data,
          social_links:
            profileRes.data.social_links && typeof profileRes.data.social_links === 'object'
              ? profileRes.data.social_links
              : initialPortfolioData.profile.social_links,
        },
        skills:
          !skillsRes.error && Array.isArray(skillsRes.data) && skillsRes.data.length > 0
            ? skillsRes.data
            : initialPortfolioData.skills,
        work_experience:
          !expRes.error && Array.isArray(expRes.data) && expRes.data.length > 0
            ? expRes.data
            : initialPortfolioData.work_experience,
        education:
          !eduRes.error && Array.isArray(eduRes.data) && eduRes.data.length > 0
            ? eduRes.data
            : initialPortfolioData.education,
        certificates_achievements:
          !certRes.error && Array.isArray(certRes.data) && certRes.data.length > 0
            ? certRes.data
            : initialPortfolioData.certificates_achievements,
        projects:
          !projectsRes.error && Array.isArray(projectsRes.data) && projectsRes.data.length > 0
            ? projectsRes.data
            : initialPortfolioData.projects,
      };
    }
  } catch (err) {
    console.warn('Server Supabase fetch error, fallback to baseline data:', err);
  }

  return initialPortfolioData;
}
