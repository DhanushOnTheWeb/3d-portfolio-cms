'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Cpu,
  Layers,
  Award,
  FolderGit2,
  ExternalLink,
  LogOut,
  Sparkles,
  Code2,
  Database,
  Menu,
  X,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { setDemoSessionCookie, revalidatePortfolio } from '@/app/actions';
import { useToast } from '@/components/Toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLiveDb, setIsLiveDb] = useState(false);
  const [isRevalidating, setIsRevalidating] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    setIsLiveDb(!!supabase);
  }, []);

  // Don't render sidebar shell on /admin/login
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navLinks = [
    { label: 'Overview & Stats', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Hero & Profile', href: '/admin/profile', icon: User },
    { label: 'Projects Showcase', href: '/admin/projects', icon: FolderGit2 },
    { label: 'Skills & Tech Stack', href: '/admin/skills', icon: Cpu },
    { label: 'Experience & Education', href: '/admin/timeline', icon: Layers },
    { label: 'Certificates & Awards', href: '/admin/certificates', icon: Award },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    await setDemoSessionCookie(false);
    toast('Logged out successfully', 'info');
    router.push('/admin/login');
  };

  const handleRevalidateAll = async () => {
    setIsRevalidating(true);
    try {
      await revalidatePortfolio();
      toast('Incremental Static Regeneration completed! Public site updated.', 'success');
    } catch {
      toast('Revalidation triggered.', 'info');
    } finally {
      setIsRevalidating(false);
    }
  };

  return (
    <div className="admin-shell" suppressHydrationWarning>
      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand header */}
        <div
          style={{
            padding: '24px 20px',
            borderBottom: '1px solid var(--border-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            href="/admin/dashboard"
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
              }}
            >
              <Code2 size={20} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>Portfolio CMS</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Admin Dashboard
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
            id="close-sidebar-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Database Status Pill */}
        <div style={{ padding: '16px 20px 8px 20px' }}>
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              background: isLiveDb ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.12)',
              border: `1px solid ${isLiveDb ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={14} color={isLiveDb ? '#34d399' : '#818cf8'} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isLiveDb ? '#34d399' : '#c7d2fe' }}>
                {isLiveDb ? 'Supabase Connected' : 'Local Demo Storage'}
              </span>
            </div>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isLiveDb ? '#10b981' : '#6366f1',
                boxShadow: isLiveDb ? '0 0 8px #10b981' : '0 0 8px #6366f1',
              }}
            />
          </div>
        </div>

        {/* Navigation list */}
        <nav style={{ flex: 1, padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  background: isActive ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.22) 0%, rgba(6, 182, 212, 0.12) 100%)' : 'transparent',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <Icon size={18} color={isActive ? 'var(--cyan)' : 'currentColor'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Bottom */}
        <div style={{ padding: '16px 16px 24px 16px', borderTop: '1px solid var(--border-dim)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            type="button"
            onClick={handleRevalidateAll}
            disabled={isRevalidating}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '9px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-dim)',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              cursor: isRevalidating ? 'wait' : 'pointer',
              width: '100%',
            }}
          >
            <RefreshCw size={14} className={isRevalidating ? 'spin-icon' : ''} />
            <span>{isRevalidating ? 'Revalidating...' : 'Sync & Revalidate ISR'}</span>
          </button>

          <Link
            href="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '9px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#c7d2fe',
              fontSize: '0.8rem',
              fontWeight: 500,
              width: '100%',
            }}
          >
            <ExternalLink size={14} />
            <span>View Live Portfolio</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '9px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              color: '#fda4af',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              width: '100%',
              marginTop: '4px',
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Mobile Top Bar */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            padding: '12px 16px',
            background: 'rgba(11, 14, 27, 0.9)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-dim)',
          }}
          id="mobile-admin-header"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
              }}
            >
              <Menu size={22} />
            </button>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Portfolio Admin CMS</span>
          </div>

          <Link
            href="/"
            target="_blank"
            style={{
              fontSize: '0.75rem',
              color: 'var(--cyan)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Live Site <ExternalLink size={12} />
          </Link>
        </div>

        {children}
      </main>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        :global(.spin-icon) {
          animation: spin 1s linear infinite;
        }
        @media (max-width: 900px) {
          #mobile-admin-header {
            display: flex !important;
          }
          #close-sidebar-btn {
            display: block !important;
          }
          .admin-sidebar {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 280px;
            z-index: 100;
          }
          .admin-sidebar.mobile-open {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
