'use client';

import React, { useState } from 'react';
import { Check, Sparkles, User, Image as ImageIcon } from 'lucide-react';

export interface AvatarOption {
  id: string;
  name: string;
  role: string;
  gender: 'male' | 'female';
  url: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  // 4 Male 3D Figures
  {
    id: 'male-1',
    name: 'Tech Executive',
    role: 'Corporate Architect & Tech Lead',
    gender: 'male',
    url: '/avatars/male-1.png',
  },
  {
    id: 'male-2',
    name: 'Modern Architect',
    role: 'Navy Blazer & Engineering Lead',
    gender: 'male',
    url: '/avatars/male-2.png',
  },
  {
    id: 'male-3',
    name: 'Creative Coder',
    role: 'Teal Hoodie & Full-Stack Dev',
    gender: 'male',
    url: '/avatars/male-3.png',
  },
  {
    id: 'male-4',
    name: 'Cyber Developer',
    role: 'Headphones & Systems Engineer',
    gender: 'male',
    url: '/avatars/male-4.png',
  },

  // 4 Female 3D Figures
  {
    id: 'female-1',
    name: 'Cloud Solutions Lead',
    role: 'Solutions Architect & Tech Lead',
    gender: 'female',
    url: '/avatars/female-1.png',
  },
  {
    id: 'female-2',
    name: 'UI/UX Product Designer',
    role: 'Digital Designer & Creative Dev',
    gender: 'female',
    url: '/avatars/female-2.png',
  },
  {
    id: 'female-3',
    name: 'Full-Stack Engineer',
    role: 'Systems Developer & Coder',
    gender: 'female',
    url: '/avatars/female-3.png',
  },
  {
    id: 'female-4',
    name: 'Data Strategist',
    role: 'Cloud Streams & ML Engineer',
    gender: 'female',
    url: '/avatars/female-4.png',
  },
];

interface AvatarSelectorProps {
  value?: string;
  onChange: (url: string) => void;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ value, onChange }) => {
  const [activeGender, setActiveGender] = useState<'all' | 'male' | 'female'>('male');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const filteredAvatars = AVATAR_OPTIONS.filter((a) =>
    activeGender === 'all' ? true : a.gender === activeGender
  );

  const selectedOption = AVATAR_OPTIONS.find((a) => a.url === value);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Top Filter Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="var(--cyan)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
            Choose Animated 3D Figurine Avatar
          </span>
        </div>

        {/* Gender Toggle Pills */}
        <div
          style={{
            display: 'inline-flex',
            padding: '3px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-dim)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveGender('male')}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              background: activeGender === 'male' ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Male Figures (4)
          </button>

          <button
            type="button"
            onClick={() => setActiveGender('female')}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              background: activeGender === 'female' ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Female Figures (4)
          </button>

          <button
            type="button"
            onClick={() => setActiveGender('all')}
            style={{
              padding: '6px 12px',
              borderRadius: '999px',
              background: activeGender === 'all' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              border: 'none',
              color: '#cbd5e1',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            All (8)
          </button>
        </div>
      </div>

      {/* Grid of 3D Avatars */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '14px',
        }}
      >
        {filteredAvatars.map((avatar) => {
          const isSelected = value === avatar.url;

          return (
            <div
              key={avatar.id}
              onClick={() => onChange(avatar.url)}
              style={{
                position: 'relative',
                borderRadius: '16px',
                background: isSelected
                  ? 'linear-gradient(145deg, rgba(99, 102, 241, 0.25), rgba(6, 182, 212, 0.15))'
                  : 'rgba(255, 255, 255, 0.03)',
                border: isSelected
                  ? '2px solid var(--cyan)'
                  : '1px solid var(--border-dim)',
                boxShadow: isSelected
                  ? '0 0 25px rgba(6, 182, 212, 0.35), inset 0 0 15px rgba(99, 102, 241, 0.2)'
                  : 'none',
                padding: '10px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              }}
              onMouseOver={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--border-dim)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'var(--cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#070913',
                    zIndex: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  }}
                >
                  <Check size={14} strokeWidth={3} />
                </div>
              )}

              {/* 3D Figurine Image Container */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#f8fafc',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatar.url}
                  alt={avatar.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </div>

              {/* Character Details */}
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: isSelected ? 'var(--cyan)' : '#f8fafc',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {avatar.name}
                </div>
                <div
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: '2px',
                  }}
                >
                  {avatar.role}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Selection Status Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-dim)',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#f8fafc',
              border: '1px solid var(--border-dim)',
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value || '/avatars/male-1.png'}
              alt="Active Avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc' }}>
              {selectedOption ? selectedOption.name : 'Custom Avatar Image'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Active on 3D Tilt Hero Showcase
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCustomInput(!showCustomInput)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {showCustomInput ? 'Hide custom URL' : 'Use custom image URL instead'}
        </button>
      </div>

      {/* Optional custom URL override */}
      {showCustomInput && (
        <div style={{ marginTop: '2px' }}>
          <label className="cms-label" style={{ fontSize: '0.75rem' }}>
            Custom Image URL Override
          </label>
          <input
            type="url"
            className="cms-input"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/avatar.png"
            style={{ fontSize: '0.825rem' }}
          />
        </div>
      )}
    </div>
  );
};
