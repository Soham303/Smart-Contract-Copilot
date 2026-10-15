'use client';

import React, { useState } from 'react';
import { AlertTriangle, Code2, Camera, Check, X } from 'lucide-react';

interface EjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmEject: (saveSnapshot: boolean) => void;
  projectName: string;
}

export const EjectModal: React.FC<EjectModalProps> = ({
  isOpen,
  onClose,
  onConfirmEject,
  projectName,
}) => {
  const [saveSnapshot, setSaveSnapshot] = useState(true);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease',
        }}
      >
        {/* Warning Accent Stripe */}
        <div style={{ height: '6px', width: '100%', background: '#f59e0b' }} />

        <div style={{ padding: '1.5rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#fef3c7',
                  border: '1px solid #fde68a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#b45309',
                }}
              >
                <Code2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Eject to Monaco Editor
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Project: <strong style={{ color: 'var(--primary)' }}>{projectName}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Warning Banner */}
          <div
            style={{
              background: '#fffbeb',
              border: '1px solid #fef3c7',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              gap: '10px',
              marginBottom: '1.25rem',
            }}
          >
            <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.8rem', color: '#92400e', lineHeight: 1.5 }}>
              <strong>One-Way Transition Notice:</strong>
              <div style={{ marginTop: '4px' }}>
                Ejecting switches this project to direct Move 2.0 source code mode.
                The visual block canvas will remain available for reference in read-only mode, but
                subsequent edits must be made directly in Monaco.
              </div>
            </div>
          </div>

          {/* Benefits List */}
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              What you unlock in Code Mode:
            </div>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Full freedom to write custom Move 2.0 functions, generics, and native calls</li>
              <li>Integrated Monaco Editor with syntax highlighting & bracket matching</li>
              <li>Continuous AST security audits & gas profiling on your raw code</li>
              <li>Direct deployment payload synthesis to Aptos testnet</li>
            </ul>
          </div>

          {/* Snapshot Checkbox */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'var(--surface-container-low)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              marginBottom: '1.5rem',
            }}
          >
            <input
              type="checkbox"
              checked={saveSnapshot}
              onChange={(e) => setSaveSnapshot(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#0f766e' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              <Camera size={14} color="var(--primary)" />
              Save a permanent snapshot of the visual canvas before ejecting
            </div>
          </label>

          {/* Action CTAs */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'transparent',
                border: '1px solid var(--border-strong)',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirmEject(saveSnapshot)}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.82rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)',
              }}
            >
              <Code2 size={15} />
              Confirm & Eject to Monaco
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
