'use client';

import React, { useState } from 'react';
import { BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

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
  selectedBlockType?: string;
}

export const LearningPanel: React.FC<LearningPanelProps> = ({ concepts, selectedBlockType }) => {
  const [search, setSearch] = useState('');

  const filtered = concepts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem', overflowY: 'auto' }}>
      {selectedBlockType && (
        <div
          style={{
            background: 'rgba(15, 118, 110, 0.15)',
            border: '1px solid rgba(15, 118, 110, 0.3)',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '0.75rem',
            color: '#a3faef',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <BookOpen size={14} color="#6ffbbe" />
          <span>
            Selected Block Context: <strong style={{ color: '#ffffff' }}>{selectedBlockType}</strong>
          </span>
        </div>
      )}

      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Move concepts (resource, capability, signer)..."
          style={{
            width: '100%',
            padding: '8px 12px',
            background: '#0e1526',
            border: '1px solid #1e293b',
            borderRadius: '6px',
            color: '#ffffff',
            fontSize: '0.8rem',
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
              background: '#0e1526',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#9cf2e8' }}>{c.name}</span>
              <a
                href={c.docUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '0.7rem',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                }}
              >
                Docs <ExternalLink size={10} />
              </a>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5 }}>{c.summary}</p>

            {c.codeExample && (
              <pre
                style={{
                  margin: '4px 0',
                  padding: '8px',
                  background: '#070a10',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#93c5fd',
                  border: '1px solid #1e293b',
                  overflowX: 'auto',
                }}
              >
                <code>{c.codeExample}</code>
              </pre>
            )}

            {c.securityNote && (
              <div
                style={{
                  fontSize: '0.72rem',
                  color: '#fbbf24',
                  background: 'rgba(245, 158, 11, 0.08)',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '4px',
                }}
              >
                <ShieldCheck size={12} style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>
                  <strong>Security Rule:</strong> {c.securityNote}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
