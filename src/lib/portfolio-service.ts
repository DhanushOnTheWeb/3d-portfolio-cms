import { createClient } from './supabase/client';
import { initialPortfolioData } from './mock-data';
import {
  CertificateAchievement,
  Education,
  PortfolioData,
  ProfileIntro,
  Project,
  Skill,
  WorkExperience,
} from './types';

const STORAGE_KEY = 'portfolio_cms_store_v1';

// Helper to get client localStorage
function getLocalStore(): PortfolioData {
  if (typeof window === 'undefined') {
    return initialPortfolioData;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPortfolioData));
      return initialPortfolioData;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading localStorage, using initial mock data', e);
    return initialPortfolioData;
  }
}

function saveLocalStore(data: PortfolioData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed writing to localStorage', e);
  }
}

export async function fetchPortfolioData(): Promise<{
  data: PortfolioData;
  isLiveSupabase: boolean;
}> {
  const supabase = createClient();

  if (supabase) {
    try {
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

      if (
        !profileRes.error &&
        !skillsRes.error &&
        profileRes.data &&
        skillsRes.data?.length
      ) {
        return {
          isLiveSupabase: true,
          data: {
            profile: profileRes.data,
            skills: skillsRes.data || [],
            work_experience: expRes.data || [],
            education: eduRes.data || [],
            certificates_achievements: certRes.data || [],
            projects: projectsRes.data || [],
          },
        };
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local store:', err);
    }
  }

  // Fallback local store
  return {
    isLiveSupabase: false,
    data: getLocalStore(),
  };
}

// ==================== PROFILE MUTATIONS ====================

export async function saveProfileIntro(profile: ProfileIntro): Promise<ProfileIntro> {
  const supabase = createClient();
  const updatedProfile = {
    ...profile,
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('profile_intro')
        .upsert(updatedProfile)
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase profile update fallback', e);
    }
  }

  const store = getLocalStore();
  store.profile = updatedProfile;
  saveLocalStore(store);
  return updatedProfile;
}

// ==================== SKILLS MUTATIONS ====================

export async function saveSkill(skill: Partial<Skill>): Promise<Skill> {
  const supabase = createClient();
  const isNew = !skill.id || skill.id.startsWith('s_temp_') || skill.id.length < 5;
  const targetId = isNew ? `skill_${Date.now()}` : skill.id!;

  const skillRecord: Skill = {
    id: targetId,
    name: skill.name || 'New Skill',
    category: skill.category || 'language',
    icon_url: skill.icon_url || '',
    proficiency_level: Number(skill.proficiency_level) || 80,
    order_index: Number(skill.order_index) || 0,
    is_visible: skill.is_visible ?? true,
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('skills')
        .upsert(skillRecord)
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase skill upsert fallback', e);
    }
  }

  const store = getLocalStore();
  const index = store.skills.findIndex((s) => s.id === skillRecord.id);
  if (index >= 0) {
    store.skills[index] = skillRecord;
  } else {
    store.skills.push(skillRecord);
  }
  saveLocalStore(store);
  return skillRecord;
}

export async function removeSkill(id: string): Promise<boolean> {
  const supabase = createClient();
  if (supabase) {
    try {
      await supabase.from('skills').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase skill delete fallback', e);
    }
  }

  const store = getLocalStore();
  store.skills = store.skills.filter((s) => s.id !== id);
  saveLocalStore(store);
  return true;
}

export async function saveSkillOrders(skills: Skill[]): Promise<void> {
  const supabase = createClient();
  const updated = skills.map((s, index) => ({
    ...s,
    order_index: index + 1,
    updated_at: new Date().toISOString(),
  }));

  if (supabase) {
    try {
      await supabase.from('skills').upsert(updated);
    } catch (e) {
      console.warn('Supabase skill reorder fallback', e);
    }
  }

  const store = getLocalStore();
  store.skills = updated;
  saveLocalStore(store);
}

// ==================== PROJECTS MUTATIONS ====================

export async function saveProject(project: Partial<Project>): Promise<Project> {
  const supabase = createClient();
  const isNew = !project.id || project.id.startsWith('p_temp_') || project.id.length < 5;
  const targetId = isNew ? `proj_${Date.now()}` : project.id!;

  const record: Project = {
    id: targetId,
    title: project.title || 'Untitled Project',
    short_description: project.short_description || '',
    long_description: project.long_description || '',
    cover_image_url: project.cover_image_url || '',
    demo_link: project.demo_link || '',
    github_link: project.github_link || '',
    tech_stack: project.tech_stack || [],
    featured: project.featured ?? false,
    order_index: Number(project.order_index) || 0,
    is_visible: project.is_visible ?? true,
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .upsert(record)
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase project upsert fallback', e);
    }
  }

  const store = getLocalStore();
  const index = store.projects.findIndex((p) => p.id === record.id);
  if (index >= 0) {
    store.projects[index] = record;
  } else {
    store.projects.push(record);
  }
  saveLocalStore(store);
  return record;
}

export async function removeProject(id: string): Promise<boolean> {
  const supabase = createClient();
  if (supabase) {
    try {
      await supabase.from('projects').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase project delete fallback', e);
    }
  }

  const store = getLocalStore();
  store.projects = store.projects.filter((p) => p.id !== id);
  saveLocalStore(store);
  return true;
}

export async function saveProjectOrders(projects: Project[]): Promise<void> {
  const supabase = createClient();
  const updated = projects.map((p, index) => ({
    ...p,
    order_index: index + 1,
    updated_at: new Date().toISOString(),
  }));

  if (supabase) {
    try {
      await supabase.from('projects').upsert(updated);
    } catch (e) {
      console.warn('Supabase project reorder fallback', e);
    }
  }

  const store = getLocalStore();
  store.projects = updated;
  saveLocalStore(store);
}

// ==================== WORK EXPERIENCE MUTATIONS ====================

export async function saveExperience(exp: Partial<WorkExperience>): Promise<WorkExperience> {
  const supabase = createClient();
  const isNew = !exp.id || exp.id.startsWith('w_temp_') || exp.id.length < 5;
  const targetId = isNew ? `exp_${Date.now()}` : exp.id!;

  const record: WorkExperience = {
    id: targetId,
    role: exp.role || 'Software Engineer',
    company: exp.company || 'Company Name',
    location: exp.location || 'Remote',
    start_date: exp.start_date || '2023',
    end_date: exp.end_date || 'Present',
    is_current: exp.is_current ?? false,
    description: exp.description || '',
    certificate_url: exp.certificate_url || '',
    order_index: Number(exp.order_index) || 0,
    is_visible: exp.is_visible ?? true,
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('work_experience')
        .upsert(record)
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase experience upsert fallback', e);
    }
  }

  const store = getLocalStore();
  const index = store.work_experience.findIndex((w) => w.id === record.id);
  if (index >= 0) {
    store.work_experience[index] = record;
  } else {
    store.work_experience.push(record);
  }
  saveLocalStore(store);
  return record;
}

export async function removeExperience(id: string): Promise<boolean> {
  const supabase = createClient();
  if (supabase) {
    try {
      await supabase.from('work_experience').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase experience delete fallback', e);
    }
  }

  const store = getLocalStore();
  store.work_experience = store.work_experience.filter((w) => w.id !== id);
  saveLocalStore(store);
  return true;
}

export async function saveExperienceOrders(items: WorkExperience[]): Promise<void> {
  const updated = items.map((w, index) => ({
    ...w,
    order_index: index + 1,
    updated_at: new Date().toISOString(),
  }));

  const supabase = createClient();
  if (supabase) {
    try {
      await supabase.from('work_experience').upsert(updated);
    } catch (e) {
      console.warn('Supabase experience reorder fallback', e);
    }
  }

  const store = getLocalStore();
  store.work_experience = updated;
  saveLocalStore(store);
}

// ==================== EDUCATION MUTATIONS ====================

export async function saveEducation(edu: Partial<Education>): Promise<Education> {
  const supabase = createClient();
  const isNew = !edu.id || edu.id.startsWith('e_temp_') || edu.id.length < 5;
  const targetId = isNew ? `edu_${Date.now()}` : edu.id!;

  const record: Education = {
    id: targetId,
    institution: edu.institution || 'University',
    degree: edu.degree || 'Degree',
    score_or_cgpa: edu.score_or_cgpa || '',
    start_year: edu.start_year || '2020',
    end_year: edu.end_year || '2024',
    description: edu.description || '',
    order_index: Number(edu.order_index) || 0,
    is_visible: edu.is_visible ?? true,
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('education')
        .upsert(record)
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase education upsert fallback', e);
    }
  }

  const store = getLocalStore();
  const index = store.education.findIndex((e) => e.id === record.id);
  if (index >= 0) {
    store.education[index] = record;
  } else {
    store.education.push(record);
  }
  saveLocalStore(store);
  return record;
}

export async function removeEducation(id: string): Promise<boolean> {
  const supabase = createClient();
  if (supabase) {
    try {
      await supabase.from('education').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase education delete fallback', e);
    }
  }

  const store = getLocalStore();
  store.education = store.education.filter((e) => e.id !== id);
  saveLocalStore(store);
  return true;
}

export async function saveEducationOrders(items: Education[]): Promise<void> {
  const updated = items.map((e, index) => ({
    ...e,
    order_index: index + 1,
    updated_at: new Date().toISOString(),
  }));

  const supabase = createClient();
  if (supabase) {
    try {
      await supabase.from('education').upsert(updated);
    } catch (err) {
      console.warn('Supabase education reorder fallback', err);
    }
  }

  const store = getLocalStore();
  store.education = updated;
  saveLocalStore(store);
}

// ==================== CERTIFICATES & AWARDS MUTATIONS ====================

export async function saveCertificate(cert: Partial<CertificateAchievement>): Promise<CertificateAchievement> {
  const supabase = createClient();
  const isNew = !cert.id || cert.id.startsWith('c_temp_') || cert.id.length < 5;
  const targetId = isNew ? `cert_${Date.now()}` : cert.id!;

  const record: CertificateAchievement = {
    id: targetId,
    title: cert.title || 'Certificate Title',
    issuer: cert.issuer || 'Issuing Authority',
    issue_date: cert.issue_date || '2024',
    credential_url: cert.credential_url || '',
    certificate_file_url: cert.certificate_file_url || '',
    lor_loa_urls: cert.lor_loa_urls || [],
    type: cert.type || 'certificate',
    order_index: Number(cert.order_index) || 0,
    is_visible: cert.is_visible ?? true,
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('certificates_achievements')
        .upsert(record)
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase cert upsert fallback', e);
    }
  }

  const store = getLocalStore();
  const index = store.certificates_achievements.findIndex((c) => c.id === record.id);
  if (index >= 0) {
    store.certificates_achievements[index] = record;
  } else {
    store.certificates_achievements.push(record);
  }
  saveLocalStore(store);
  return record;
}

export async function removeCertificate(id: string): Promise<boolean> {
  const supabase = createClient();
  if (supabase) {
    try {
      await supabase.from('certificates_achievements').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase cert delete fallback', e);
    }
  }

  const store = getLocalStore();
  store.certificates_achievements = store.certificates_achievements.filter((c) => c.id !== id);
  saveLocalStore(store);
  return true;
}

export async function saveCertificateOrders(items: CertificateAchievement[]): Promise<void> {
  const updated = items.map((c, index) => ({
    ...c,
    order_index: index + 1,
    updated_at: new Date().toISOString(),
  }));

  const supabase = createClient();
  if (supabase) {
    try {
      await supabase.from('certificates_achievements').upsert(updated);
    } catch (err) {
      console.warn('Supabase cert reorder fallback', err);
    }
  }

  const store = getLocalStore();
  store.certificates_achievements = updated;
  saveLocalStore(store);
}

// Reset Local Data
export function resetPortfolioToDefault(): PortfolioData {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPortfolioData));
  }
  return initialPortfolioData;
}
