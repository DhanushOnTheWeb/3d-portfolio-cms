'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { uploadPortfolioMedia, UploadProgress, validateFile } from '@/lib/storage-helpers';

interface FileUploadZoneProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  accept?: string;
  hint?: string;
  allowPdf?: boolean;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  label = 'Upload Media',
  value,
  onChange,
  folder = 'portfolio',
  accept = 'image/png, image/jpeg, image/webp, image/svg+xml, application/pdf',
  hint = 'Supports JPG, PNG, WebP (auto-compressed) or PDF up to 5MB',
  allowPdf = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isPdf = value?.toLowerCase().endsWith('.pdf') || value?.includes('application/pdf');

  const handleProcessFile = async (file: File) => {
    setErrorMsg(null);
    const validation = validateFile(file);
    if (!validation.valid) {
      setErrorMsg(validation.error || 'Invalid file');
      return;
    }

    try {
      const result = await uploadPortfolioMedia(file, folder, (p) => {
        setProgress(p);
      });
      onChange(result.url);
      setTimeout(() => setProgress(null), 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setErrorMsg(msg);
      setProgress(null);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {label && <label className="cms-label">{label}</label>}

      {/* Dropzone container */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${
            isDragging
              ? 'var(--primary-light)'
              : errorMsg
              ? 'var(--rose)'
              : 'rgba(255, 255, 255, 0.15)'
          }`,
          borderRadius: 'var(--radius-md)',
          padding: value ? '14px' : '28px 20px',
          background: isDragging
            ? 'rgba(99, 102, 241, 0.08)'
            : 'rgba(12, 15, 28, 0.65)',
          cursor: 'pointer',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          position: 'relative',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={handleInputChange}
        />

        {/* Existing Value Preview */}
        {value ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
              {isPdf ? (
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '8px',
                    background: 'rgba(244, 63, 94, 0.15)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fb7185',
                    flexShrink: 0,
                  }}
                >
                  <FileText size={22} />
                </div>
              ) : (
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#090b14',
                    border: '1px solid var(--border-dim)',
                    flexShrink: 0,
                    position: 'relative',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={value}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#f8fafc',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {isPdf ? 'Document Attached (PDF)' : 'Image Attached (WebP Optimized)'}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {value}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                }}
              >
                <ExternalLink size={13} /> View
              </a>
              <button
                type="button"
                onClick={handleClear}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#fb7185',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Remove file"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                color: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px auto',
              }}
            >
              <UploadCloud size={22} />
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>
              Click to browse or drag & drop
            </div>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{hint}</div>
          </div>
        )}

        {/* Progress Bar */}
        {progress && (
          <div style={{ marginTop: '12px', textAlign: 'left' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                marginBottom: '4px',
                color: 'var(--text-secondary)',
              }}
            >
              <span>{progress.message}</span>
              <span>{progress.percent}%</span>
            </div>
            <div
              style={{
                height: '6px',
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progress.percent}%`,
                  background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                  transition: 'width 0.25s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Error Notice */}
        {errorMsg && (
          <div
            style={{
              marginTop: '10px',
              padding: '8px 12px',
              borderRadius: '6px',
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fda4af',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textAlign: 'left',
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
