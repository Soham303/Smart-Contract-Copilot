'use client';

import React, { useState } from 'react';
import { promptToGraph } from '../../lib/api';

interface PromptDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyGraph: (graph: any) => void;
}

export const PromptDrawer: React.FC<PromptDrawerProps> = ({
  isOpen,
  onClose,
  onApplyGraph,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewGraph, setPreviewGraph] = useState<any>(null);
  const [previewDiff, setPreviewDiff] = useState<any>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await promptToGraph(prompt);
      if (res.graph) {
        setPreviewGraph(res.graph);
        setPreviewDiff(res.diff);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (previewGraph) {
      onApplyGraph(previewGraph);
      onClose();
      setPreviewGraph(null);
      setPreviewDiff(null);
      setPrompt('');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: '560px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>AI Prompt-to-Blocks</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Describe your contract in plain English. AI outputs structured blocks, not raw code.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '1.2rem' }}>
            ✕
          </button>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. NFT collection, 1000 max supply, 5% royalty with creator payout, whitelist mint"
          rows={3}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            color: '#fff',
            fontSize: '0.85rem',
            resize: 'none',
            outline: 'none',
          }}
        />

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          style={{
            padding: '8px 16px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.85rem',
            alignSelf: 'flex-start',
            opacity: loading || !prompt.trim() ? 0.6 : 1,
          }}
        >
          {loading ? 'Analyzing & Building Blocks...' : 'Generate Block Graph →'}
        </button>

        {/* Diff Preview (PRD FR-6.4) */}
        {previewDiff && (
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
              Preview Diff: Proposed Canvas Changes
            </span>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div><strong>Blocks to Add:</strong> {previewDiff.addedBlocks?.join(', ')}</div>
              <div><strong>Total Blocks:</strong> {previewDiff.totalBlocks} | <strong>Connections:</strong> {previewDiff.edgesCount}</div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                onClick={handleAccept}
                style={{
                  padding: '6px 14px',
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}
              >
                Accept & Apply to Canvas
              </button>
              <button
                onClick={() => { setPreviewGraph(null); setPreviewDiff(null); }}
                style={{
                  padding: '6px 14px',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                }}
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
