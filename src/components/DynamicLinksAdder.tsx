'use client';

import React from 'react';
import { Plus, Trash2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { DynamicLinkItem } from '@/lib/types';

interface DynamicLinksAdderProps {
  label?: string;
  links: DynamicLinkItem[];
  onChange: (links: DynamicLinkItem[]) => void;
  presetLabels?: string[];
}

export const DynamicLinksAdder: React.FC<DynamicLinksAdderProps> = ({
  label = 'Dynamic Links & Attachments',
  links = [],
  onChange,
  presetLabels = ['Verification Link', 'Letter of Recommendation (LOR)', 'Letter of Appreciation (LOA)', 'Project Case Study', 'Live Demo', 'GitHub Repository'],
}) => {
  const handleAdd = () => {
    onChange([
      ...links,
      {
        id: `link_${Date.now()}`,
        label: 'Verification Document',
        url: '',
      },
    ]);
  };

  const handleUpdate = (index: number, field: 'label' | 'url', val: string) => {
    const updated = [...links];
    updated[index] = {
      ...updated[index],
      [field]: val,
    };
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = links.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <label className="cms-label" style={{ marginBottom: 0 }}>
          {label}
        </label>
        <button
          type="button"
          onClick={handleAdd}
          style={{
            padding: '5px 10px',
            fontSize: '0.775rem',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '6px',
            color: 'var(--primary-light)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 500,
          }}
        >
          <Plus size={14} /> Add Link Field
        </button>
      </div>

      {links.length === 0 ? (
        <div
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px dashed rgba(255, 255, 255, 0.08)',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.825rem',
          }}
        >
          No supplementary links attached. Click &ldquo;Add Link Field&rdquo; to add LOA, LOR, or verification credentials.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {links.map((link, idx) => (
            <div
              key={link.id || idx}
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                background: 'rgba(12, 16, 30, 0.7)',
                padding: '8px 10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-dim)',
              }}
            >
              {/* Label select / input */}
              <div style={{ width: '40%' }}>
                <input
                  type="text"
                  placeholder="Label (e.g. LOR, Certificate)"
                  className="cms-input"
                  style={{ padding: '8px 10px', fontSize: '0.825rem' }}
                  value={link.label}
                  list={`preset-labels-${idx}`}
                  onChange={(e) => handleUpdate(idx, 'label', e.target.value)}
                />
                <datalist id={`preset-labels-${idx}`}>
                  {presetLabels.map((p) => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
              </div>

              {/* URL input */}
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="url"
                  placeholder="https://..."
                  className="cms-input"
                  style={{ padding: '8px 10px 8px 30px', fontSize: '0.825rem' }}
                  value={link.url}
                  onChange={(e) => handleUpdate(idx, 'url', e.target.value)}
                />
                <LinkIcon
                  size={13}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
              </div>

              {/* Action buttons */}
              {link.url && (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  title="Open Link"
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ExternalLink size={14} />
                </a>
              )}

              <button
                type="button"
                onClick={() => handleRemove(idx)}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  color: '#fb7185',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Delete Link"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
