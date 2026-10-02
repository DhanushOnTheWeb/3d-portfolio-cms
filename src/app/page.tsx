'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  FileDown,
  Layers,
  Cpu,
  FolderGit2,
  Award,
  Calendar,
  MapPin,
  Shield,
  FileText,
  Star,
  CheckCircle2,
  X,
  Code2,
  Database,
  Terminal,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from '@/components/SocialIcons';
import { fetchPortfolioData } from '@/lib/portfolio-service';
import { PortfolioData, Project, CertificateAchievement } from '@/lib/types';
import { initialPortfolioData } from '@/lib/mock-data';
import { ThreeCanvas } from '@/components/ThreeCanvas';
import { TiltCard } from '@/components/TiltCard';
import { Navbar } from '@/components/Navbar';

export default function PortfolioPage() {
  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertificateAchievement | null>(null);
  const [activeSkillCategory, setActiveSkillCategory] = useState<string>('all');
  const [activeProjectFilter, setActiveProjectFilter] = useState<'all' | 'featured'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioData().then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  const { profile, skills, work_experience, education, certificates_achievements, projects } = data;

  // Filter visible items
  const visibleProjects = (projects || [])
    .filter((p) => p.is_visible !== false)
    .filter((p) => (activeProjectFilter === 'featured' ? p.featured : true))
    .sort((a, b) => a.order_index - b.order_index);

  const visibleSkills = (skills || [])
    .filter((s) => s.is_visible !== false)
    .filter((s) => (activeSkillCategory === 'all' ? true : s.category === activeSkillCategory))
    .sort((a, b) => a.order_index - b.order_index);

  const visibleExp = (work_experience || [])
    .filter((w) => w.is_visible !== false)
    .sort((a, b) => a.order_index - b.order_index);

  const visibleEdu = (education || [])
    .filter((e) => e.is_visible !== false)
    .sort((a, b) => a.order_index - b.order_index);

  const visibleCerts = (certificates_achievements || [])
    .filter((c) => c.is_visible !== false)
    .sort((a, b) => a.order_index - b.order_index);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Interactive 3D Spatial Three.js Background */}
      <ThreeCanvas />

      {/* Glassmorphic Navbar */}
      <Navbar fullName={profile.full_name} statusBadge={profile.status_badge} />

      {/* Main Container */}
      <main style={{ position: 'relative', zIndex: 10, maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* =========================================================================
            1. HERO SECTION
        ========================================================================== */}
        <section
          id="about"
          style={{
            minHeight: '94vh',
            display: 'flex',
            alignItems: 'center',
            paddingTop: '110px',
            paddingBottom: '60px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {/* Left Column: Hero Text */}
            <div>
              {/* Status Badge */}
              {profile.status_badge && (
                <div className="badge-status" style={{ marginBottom: '22px' }}>
                  <span className="badge-pulse-dot" />
                  <span>{profile.status_badge}</span>
                </div>
              )}

              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
                  lineHeight: 1.08,
                  marginBottom: '20px',
                  fontWeight: 800,
                }}
              >
                Hi, I&rsquo;m <span className="gradient-text">{profile.full_name}</span>.
              </h1>

              <div
                style={{
                  fontSize: 'clamp(1.15rem, 2.2vw, 1.6rem)',
                  fontWeight: 600,
                  color: 'var(--cyan)',
                  marginBottom: '20px',
                  fontFamily: 'var(--font-heading)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Sparkles size={22} color="var(--cyan)" />
                <span>{profile.tagline}</span>
              </div>

              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.65,
                  color: 'var(--text-secondary)',
                  maxWidth: '580px',
                  marginBottom: '32px',
                }}
              >
                {profile.bio}
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '36px' }}>
                <a
                  href="#projects"
                  className="gradient-glow-btn"
                  style={{
                    padding: '13px 26px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>Explore 3D Projects</span>
                  <ArrowRight size={16} />
                </a>

                {profile.resume_file_url && (
                  <a
                    href={profile.resume_file_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '12px 22px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-dim)',
                      color: '#f8fafc',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.borderColor = 'var(--border-dim)';
                    }}
                  >
                    <FileDown size={16} color="var(--cyan)" />
                    <span>Download CV (PDF)</span>
                  </a>
                )}

                <Link
                  href="/admin/dashboard"
                  style={{
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(99, 102, 241, 0.12)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    color: '#c7d2fe',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Shield size={16} color="#818cf8" />
                  <span>Admin CMS</span>
                </Link>
              </div>

              {/* Social Channels */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Connect
                </span>
                <div style={{ height: '14px', width: '1px', background: 'var(--border-dim)' }} />

                {profile.social_links.github && (
                  <a
                    href={profile.social_links.github}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.borderColor = 'var(--primary-light)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.borderColor = 'var(--border-dim)';
                    }}
                  >
                    <GithubIcon size={18} />
                  </a>
                )}

                {profile.social_links.linkedin && (
                  <a
                    href={profile.social_links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.borderColor = 'var(--cyan)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.borderColor = 'var(--border-dim)';
                    }}
                  >
                    <LinkedinIcon size={18} />
                  </a>
                )}

                {profile.social_links.twitter && (
                  <a
                    href={profile.social_links.twitter}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.borderColor = 'var(--cyan)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.borderColor = 'var(--border-dim)';
                    }}
                  >
                    <TwitterIcon size={18} />
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: 3D Holographic Avatar Card */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <TiltCard
                maxTilt={12}
                style={{
                  maxWidth: '420px',
                  width: '100%',
                  borderRadius: 'var(--radius-xl)',
                  padding: '16px',
                  background: 'rgba(15, 19, 38, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8), 0 0 50px rgba(99, 102, 241, 0.2)',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '110%',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                    alt={profile.full_name}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'contrast(1.05) brightness(1.02)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 50%, rgba(7, 9, 19, 0.95) 100%)',
                      pointerEvents: 'none',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '16px',
                      right: '16px',
                    }}
                  >
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                      {profile.full_name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--cyan)' }}>
                      WebGL & Cloud Architect
                    </div>
                  </div>
                </div>

                <div style={{ padding: '14px 8px 4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    3D Spatial Portfolio Core
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Active</span>
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. 3D TILT PROJECTS SHOWCASE
        ========================================================================== */}
        <section id="projects" style={{ padding: '90px 0' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '16px',
              marginBottom: '44px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyan)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                <FolderGit2 size={16} /> Selected Engineering Works
              </div>
              <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)' }}>
                Interactive <span className="gradient-text">3D Project Gallery</span>
              </h2>
            </div>

            {/* Filter Toggle */}
            <div
              style={{
                display: 'inline-flex',
                padding: '4px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-dim)',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveProjectFilter('all')}
                style={{
                  padding: '7px 18px',
                  borderRadius: '9999px',
                  background: activeProjectFilter === 'all' ? 'var(--primary)' : 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                All Projects ({projects.filter((p) => p.is_visible !== false).length})
              </button>
              <button
                type="button"
                onClick={() => setActiveProjectFilter('featured')}
                style={{
                  padding: '7px 18px',
                  borderRadius: '9999px',
                  background: activeProjectFilter === 'featured' ? 'var(--primary)' : 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <Star size={12} fill="currentColor" />
                Featured 3D
              </button>
            </div>
          </div>

          {/* Project Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '28px',
            }}
          >
            {visibleProjects.map((proj) => (
              <TiltCard
                key={proj.id}
                maxTilt={8}
                style={{
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(14, 18, 36, 0.78)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {/* Image Cover */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '210px',
                    background: '#090b14',
                    overflow: 'hidden',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proj.cover_image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
                    alt={proj.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />

                  {proj.featured && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: 'rgba(6, 182, 212, 0.9)',
                        color: '#070913',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <Star size={11} fill="currentColor" /> Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{proj.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                      {proj.short_description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                      {proj.tech_stack?.map((tag, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.72rem',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'rgba(99, 102, 241, 0.12)',
                            border: '1px solid rgba(99, 102, 241, 0.25)',
                            color: '#c7d2fe',
                            fontWeight: 500,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links & Details CTA */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--border-dim)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedProject(proj)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--cyan)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>Case Details</span>
                      <ArrowRight size={14} />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {proj.demo_link && (
                        <a
                          href={proj.demo_link}
                          target="_blank"
                          rel="noreferrer"
                          title="Live Demo"
                          style={{
                            padding: '7px',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                          }}
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}

                      {proj.github_link && (
                        <a
                          href={proj.github_link}
                          target="_blank"
                          rel="noreferrer"
                          title="Source Code"
                          style={{
                            padding: '7px',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                          }}
                        >
                          <GithubIcon size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* =========================================================================
            3. SKILLS ORBIT & DISCIPLINE MATRIX
        ========================================================================== */}
        <section id="skills" style={{ padding: '90px 0' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--cyan)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              <Cpu size={16} /> Capabilities & Technologies
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', marginBottom: '14px' }}>
              Technical Orbit & <span className="gradient-text">Competencies</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Full-stack proficiencies spanning 3D WebGL rendering, modern React architectures, and distributed PostgreSQL databases.
            </p>
          </div>

          {/* Category Tabs */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '36px',
            }}
          >
            {[
              { id: 'all', label: 'All Disciplines' },
              { id: 'language', label: 'Languages & WebGL' },
              { id: 'database', label: 'Databases & Storage' },
              { id: 'tool', label: 'Tools & DevOps' },
              { id: 'soft_skill', label: 'Architecture & Strategy' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveSkillCategory(cat.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  background: activeSkillCategory === cat.id ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${activeSkillCategory === cat.id ? 'var(--primary-light)' : 'var(--border-dim)'}`,
                  color: activeSkillCategory === cat.id ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: '20px',
            }}
          >
            {visibleSkills.map((s) => (
              <div
                key={s.id}
                className="glass-panel glass-panel-hover"
                style={{
                  padding: '22px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(15, 19, 36, 0.7)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--border-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {s.icon_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={s.icon_url}
                        alt={s.name}
                        style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                      />
                    ) : (
                      <Cpu size={20} color="var(--cyan)" />
                    )}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#f8fafc', marginBottom: '2px' }}>{s.name}</h4>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {s.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Proficiency</span>
                    <span style={{ fontWeight: 700, color: 'var(--cyan)' }}>{s.proficiency_level}%</span>
                  </div>
                  <div
                    style={{
                      height: '6px',
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '999px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${s.proficiency_level}%`,
                        background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                        borderRadius: '999px',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            4. CAREER & ACADEMIC TIMELINE
        ========================================================================== */}
        <section id="timeline" style={{ padding: '90px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyan)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            <Layers size={16} /> Track Record & Pedigree
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', marginBottom: '40px' }}>
            Experience & <span className="gradient-text">Education Timeline</span>
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '36px',
            }}
          >
            {/* Experience Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <span style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-light)', fontWeight: 700, fontSize: '0.9rem' }}>
                  Professional Roles
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {visibleExp.map((exp) => (
                  <div
                    key={exp.id}
                    className="glass-panel"
                    style={{
                      padding: '24px',
                      borderRadius: 'var(--radius-lg)',
                      borderLeft: exp.is_current ? '4px solid var(--emerald)' : '1px solid var(--border-dim)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <h3 style={{ fontSize: '1.15rem' }}>{exp.role}</h3>
                      {exp.is_current && (
                        <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 600 }}>
                          Present
                        </span>
                      )}
                    </div>

                    <div style={{ color: 'var(--cyan)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '10px' }}>
                      {exp.company}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} /> {exp.start_date} &ndash; {exp.is_current ? 'Present' : exp.end_date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} /> {exp.location}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      {exp.description}
                    </p>

                    {exp.certificate_url && (
                      <a
                        href={exp.certificate_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          marginTop: '14px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.8rem',
                          color: 'var(--primary-light)',
                        }}
                      >
                        <FileText size={14} /> Verification Document
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Education Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <span style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan)', fontWeight: 700, fontSize: '0.9rem' }}>
                  Academic Degrees
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {visibleEdu.map((edu) => (
                  <div
                    key={edu.id}
                    className="glass-panel"
                    style={{
                      padding: '24px',
                      borderRadius: 'var(--radius-lg)',
                      borderLeft: '4px solid var(--cyan)',
                    }}
                  >
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '4px' }}>{edu.degree}</h3>
                    <div style={{ color: 'var(--primary-light)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '10px' }}>
                      {edu.institution}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      <span>
                        <Calendar size={13} style={{ display: 'inline', verticalAlign: '-2px' }} /> {edu.start_year} &ndash; {edu.end_year}
                      </span>
                      {edu.score_or_cgpa && (
                        <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>
                          CGPA: {edu.score_or_cgpa}
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      {edu.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. CERTIFICATES & AWARDS GALLERY
        ========================================================================== */}
        <section id="achievements" style={{ padding: '90px 0 130px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyan)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            <Award size={16} /> Verified Credentials
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', marginBottom: '40px' }}>
            Certificates & <span className="gradient-text">Honors</span>
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '24px',
            }}
          >
            {visibleCerts.map((c) => (
              <div
                key={c.id}
                className="glass-panel glass-panel-hover"
                style={{
                  padding: '24px',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderLeft: `4px solid ${
                    c.type === 'award'
                      ? 'var(--amber)'
                      : c.type === 'merit'
                      ? 'var(--cyan)'
                      : 'var(--emerald)'
                  }`,
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: 'var(--cyan)',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {c.type}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.issue_date}</span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>{c.title}</h3>
                  <div style={{ fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '14px' }}>
                    Issued by <strong>{c.issuer}</strong>
                  </div>

                  {c.lor_loa_urls && c.lor_loa_urls.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {c.lor_loa_urls.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontSize: '0.75rem',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'rgba(99, 102, 241, 0.12)',
                            color: 'var(--primary-light)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <FileText size={11} />
                          <span>{link.label}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-dim)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedCert(c)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary-light)',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    View Credential <ArrowRight size={13} />
                  </button>

                  {c.credential_url && (
                    <a
                      href={c.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.78rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <ExternalLink size={12} /> Verify Link
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            padding: '40px 0 60px 0',
            borderTop: '1px solid var(--border-dim)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>{profile.full_name}</span>
            <span style={{ color: 'var(--text-muted)' }}>&bull;</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Interactive 3D Portfolio & CMS Architecture
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/admin/dashboard"
              style={{
                fontSize: '0.85rem',
                color: 'var(--cyan)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Shield size={14} /> Open Admin CMS
            </Link>
          </div>
        </footer>
      </main>

      {/* Project Case Study Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '680px', padding: '32px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                borderBottom: '1px solid var(--border-dim)',
                paddingBottom: '14px',
              }}
            >
              <h2 style={{ fontSize: '1.4rem' }}>{selectedProject.title}</h2>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {selectedProject.cover_image_url && (
              <div
                style={{
                  width: '100%',
                  height: '260px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  marginBottom: '20px',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedProject.cover_image_url}
                  alt={selectedProject.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
              {selectedProject.tech_stack?.map((t, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.75rem',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#c7d2fe',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              {selectedProject.long_description || selectedProject.short_description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              {selectedProject.github_link && (
                <a
                  href={selectedProject.github_link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '10px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.85rem',
                  }}
                >
                  <GithubIcon size={16} /> View Code
                </a>
              )}

              {selectedProject.demo_link && (
                <a
                  href={selectedProject.demo_link}
                  target="_blank"
                  rel="noreferrer"
                  className="gradient-glow-btn"
                  style={{
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  <span>Launch Live Demo</span>
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Certificate Preview Modal */}
      {selectedCert && (
        <div className="modal-overlay" onClick={() => setSelectedCert(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '580px', padding: '30px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h2 style={{ fontSize: '1.3rem' }}>{selectedCert.title}</h2>
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ color: 'var(--cyan)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>
              Issued by {selectedCert.issuer} &bull; {selectedCert.issue_date}
            </div>

            {selectedCert.certificate_file_url && (
              <div style={{ margin: '16px 0', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-dim)' }}>
                <a
                  href={selectedCert.certificate_file_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px',
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: 'var(--primary-light)',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                  }}
                >
                  <FileText size={16} /> Open Uploaded Document (PDF/Badge)
                </a>
              </div>
            )}

            {selectedCert.lor_loa_urls && selectedCert.lor_loa_urls.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Associated Credentials & Recommendations
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedCert.lor_loa_urls.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-dim)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.85rem',
                        color: '#f8fafc',
                      }}
                    >
                      <span>{link.label}</span>
                      <ExternalLink size={14} color="var(--cyan)" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              {selectedCert.credential_url && (
                <a
                  href={selectedCert.credential_url}
                  target="_blank"
                  rel="noreferrer"
                  className="gradient-glow-btn"
                  style={{
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  <span>Verify with Official Issuer</span>
                  <ExternalLink size={15} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
