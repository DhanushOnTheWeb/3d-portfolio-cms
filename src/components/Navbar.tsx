'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Code2, Sparkles, Menu, X, ArrowUpRight, Code, Briefcase, GraduationCap, Award, User } from 'lucide-react';

interface NavbarProps {
  fullName?: string;
  statusBadge?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  fullName = 'Dhanush Rao',
  statusBadge = 'Open to Work',
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        background: scrolled
          ? 'rgba(7, 9, 19, 0.88)'
          : 'rgba(7, 9, 19, 0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(255, 255, 255, 0.09)' : 'transparent'}`,
      }}
    >
      <div
        style={{
          maxWidth: '1340px',
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand / Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 800,
            fontSize: '1.2rem',
            letterSpacing: '-0.02em',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Code2 size={20} strokeWidth={2.4} />
          </div>
          <div>
            <span className="gradient-text" style={{ fontWeight: 800 }}>{fullName}</span>
            <div style={{ fontSize: '0.65rem', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Portfolio
            </div>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '24px',
          }}
          className="desktop-nav"
        >
          <a
            href="#about"
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Profile
          </a>
          <a
            href="#projects"
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Projects
          </a>
          <a
            href="#skills"
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Tech Orbit
          </a>
          <a
            href="#timeline"
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Timeline
          </a>
          <a
            href="#achievements"
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Credentials
          </a>
        </nav>

        {/* Right CTA - Admin CMS Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {statusBadge && (
            <div className="badge-status" style={{ display: 'none' }} id="nav-status-badge">
              <span className="badge-pulse-dot" />
              <span>{statusBadge}</span>
            </div>
          )}

          <Link
            href="/admin/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '9999px',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              color: '#c7d2fe',
              fontSize: '0.85rem',
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.35)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.35)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Shield size={15} color="#818cf8" />
            <span>Admin CMS</span>
            <ArrowUpRight size={14} style={{ opacity: 0.7 }} />
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-dim)',
              color: '#f8fafc',
              cursor: 'pointer',
            }}
            id="mobile-nav-toggle"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            padding: '20px 24px',
            background: 'rgba(11, 14, 27, 0.98)',
            borderBottom: '1px solid var(--border-dim)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#f1f5f9', fontSize: '1rem', padding: '8px 0' }}
          >
            Profile & Hero
          </a>
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#f1f5f9', fontSize: '1rem', padding: '8px 0' }}
          >
            Projects Showcase
          </a>
          <a
            href="#skills"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#f1f5f9', fontSize: '1rem', padding: '8px 0' }}
          >
            Skills Orbit
          </a>
          <a
            href="#timeline"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#f1f5f9', fontSize: '1rem', padding: '8px 0' }}
          >
            Experience & Education Timeline
          </a>
          <a
            href="#achievements"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#f1f5f9', fontSize: '1rem', padding: '8px 0' }}
          >
            Certificates & Awards
          </a>
          <Link
            href="/admin/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--primary-light)',
              fontWeight: 600,
              paddingTop: '10px',
              borderTop: '1px solid var(--border-dim)',
            }}
          >
            <Shield size={16} /> Open CMS Dashboard
          </Link>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 820px) {
          .desktop-nav {
            display: flex !important;
          }
          #nav-status-badge {
            display: inline-flex !important;
          }
          #mobile-nav-toggle {
            display: none !important;
          }
        }
        @media (max-width: 819px) {
          #mobile-nav-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};
