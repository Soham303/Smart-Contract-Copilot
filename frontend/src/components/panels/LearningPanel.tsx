'use client';

import React, { useState } from 'react';

interface Concept {
  id: string;
  name: string;
  summary: string;
  codeExample: string;
  securityNote: string;
  docUrl: string;
}

interface LearningPanelProps {
  concepts: Concept[];
}

export const LearningPanel: React.FC<LearningPanelProps> = ({ concepts }) => {
  const [search, setSearch] = useState('');

  const filtered = concepts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem', overflowY: 'auto' }}>
      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Move concepts (e.g. resource, capability)..."
          style={{
            width: '100%',
            padding: '8px 12px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            color: 'var(--text-main)',
            fontSize: '0.85rem',
            outline: 'none',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map((c) => (
          <div
            key={c.id}
            style={{
              padding: '12px',
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#60a5fa' }}>{c.name}</span>
              <a
                href={c.docUrl}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textDecoration: 'underline' }}
              >
                Docs ↗
              </a>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {c.summary}
            </p>

            {c.codeExample && (
              <pre
                style={{
                  margin: '4px 0',
                  padding: '8px',
                  background: '#090d16',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                  color: '#93c5fd',
                }}
              >
                <code>{c.codeExample}</code>
              </pre>
            )}

            {c.securityNote && (
              <div style={{ fontSize: '0.72rem', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.08)', padding: '6px 8px', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <strong>Security:</strong> {c.securityNote}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
