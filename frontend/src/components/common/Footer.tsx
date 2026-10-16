'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Cpu, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/workspace')) {
    return null;
  }

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--surface-container-lowest)',
        padding: '1.25rem 2rem',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Left: Copyright & Mission */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            © 2025 <strong>Smart Contract Copilot</strong>. Deterministic Move Architecture for Aptos.
          </span>
        </div>

        {/* Right: Telemetry Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 8px',
              borderRadius: '9999px',
              background: 'var(--tertiary-container)',
              border: '1px solid var(--tertiary-border)',
              fontSize: '0.6875rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--tertiary)',
              fontWeight: 600,
            }}
          >
            <ShieldCheck size={12} />
            Move 2.0 Ready
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 8px',
              borderRadius: '9999px',
              background: 'var(--surface-container-low)',
              border: '1px solid var(--surface-dim)',
              fontSize: '0.6875rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--primary)',
              fontWeight: 600,
            }}
          >
            <Cpu size={12} />
            Formal Verification Core
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 8px',
              borderRadius: '9999px',
              background: 'var(--risk-low-bg)',
              border: '1px solid var(--risk-low-border)',
              fontSize: '0.6875rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--risk-low)',
              fontWeight: 600,
            }}
          >
            <Database size={12} />
            Gas Matrix v1.4
          </div>
        </div>
      </div>
    </footer>
  );
};
