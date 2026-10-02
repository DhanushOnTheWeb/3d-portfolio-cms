export type SkillCategory = 'language' | 'database' | 'tool' | 'soft_skill';
export type AchievementType = 'certificate' | 'award' | 'merit';

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
  [key: string]: string | undefined;
}

export interface ProfileIntro {
  id: string;
  full_name: string;
  tagline: string;
  bio: string;
  avatar_url: string;
  resume_file_url: string;
  status_badge: string;
  social_links: SocialLinks;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  icon_url: string;
  proficiency_level: number;
  order_index: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  certificate_url: string;
  order_index: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  score_or_cgpa: string;
  start_year: string;
  end_year: string;
  description: string;
  order_index: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DynamicLinkItem {
  id?: string;
  label: string;
  url: string;
}

export interface CertificateAchievement {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_url: string;
  certificate_file_url: string;
  lor_loa_urls: DynamicLinkItem[];
  type: AchievementType;
  order_index: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  title: string;
  short_description: string;
  long_description: string;
  cover_image_url: string;
  demo_link: string;
  github_link: string;
  tech_stack: string[];
  featured: boolean;
  order_index: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PortfolioData {
  profile: ProfileIntro;
  skills: Skill[];
  work_experience: WorkExperience[];
  education: Education[];
  certificates_achievements: CertificateAchievement[];
  projects: Project[];
}
