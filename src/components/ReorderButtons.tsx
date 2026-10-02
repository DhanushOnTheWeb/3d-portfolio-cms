'use client';

import React from 'react';
import { ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

interface ReorderControlsProps {
  index: number;
  total: number;
  isVisible: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleVisibility: () => void;
}

export const ReorderControls: React.FC<ReorderControlsProps> = ({
  index,
  total,
  isVisible,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
}) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      {/* Visibility / Draft Toggle */}
      <button
        type="button"
        onClick={onToggleVisibility}
        title={isVisible ? 'Visible (Click to Draft/Hide)' : 'Draft Hidden (Click to Publish)'}
        style={{
          padding: '6px 8px',
          borderRadius: '6px',
          background: isVisible ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
          border: `1px solid ${isVisible ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
          color: isVisible ? '#34d399' : '#fb7185',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}
      >
        {isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
        <span>{isVisible ? 'Live' : 'Draft'}</span>
      </button>

      {/* Up Button */}
      <button
        type="button"
        disabled={index === 0}
        onClick={onMoveUp}
        title="Move Up"
        style={{
          padding: '6px',
          borderRadius: '6px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-dim)',
          color: index === 0 ? 'rgba(255, 255, 255, 0.2)' : 'var(--text-secondary)',
          cursor: index === 0 ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ArrowUp size={13} />
      </button>

      {/* Down Button */}
      <button
        type="button"
        disabled={index === total - 1}
        onClick={onMoveDown}
        title="Move Down"
        style={{
          padding: '6px',
          borderRadius: '6px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-dim)',
          color: index === total - 1 ? 'rgba(255, 255, 255, 0.2)' : 'var(--text-secondary)',
          cursor: index === total - 1 ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ArrowDown size={13} />
      </button>
    </div>
  );
};
