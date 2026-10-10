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
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewGraph, setPreviewGraph] = useState<any>(null);
  const [previewDiff, setPreviewDiff] = useState<any>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: '🚀 Viral Memecoin', text: 'Create a community memecoin named DogeMoon symbol DMOON with 1 billion supply, 2% transfer fee, and emergency pause switch' },
    { label: '🖼️ NFT Drop + Whitelist', text: 'NFT collection named CyberSamurai with 5000 max supply, 5% creator royalty, and VIP whitelist presale' },
    { label: '🤝 Safe Trade Escrow', text: 'Create a secure escrow contract for freelance payment with 14-day refund timeout and owner dispute release' },
    { label: '⏳ Team Token Vesting', text: 'Vesting lockup contract for 2 million tokens with a 30-day cliff and 1-year total linear unlock' },
    { label: '🌱 Staking Rewards Pool', text: 'DeFi staking pool with 7-day lockup duration, reward emission, and emergency pause control' },
  ];

  const handleGenerate = async (customPrompt?: string) => {
    const textToUse = customPrompt || prompt;
    if (!textToUse.trim()) return;
    setLoading(true);
    try {
      const res = await promptToGraph(textToUse);
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
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 8px', borderRadius: '9999px', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#c084fc', fontSize: '0.75rem', fontWeight: 600, marginBottom: '6px' }}>
              ✨ Active Autonomous AI Generator
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              AI Prompt-to-Blocks
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
              Describe what you want in everyday English. The AI automatically creates the blocks, wires all the connections, and arranges the canvas on its own.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.4rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Prompts (Click any to test)
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
            {quickPrompts.map((qp) => (
              <button
                key={qp.label}
                onClick={() => {
                  setPrompt(qp.text);
                  handleGenerate(qp.text);
                }}
                style={{
                  padding: '5px 10px',
                  borderRadius: '8px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: '#e2e8f0',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Create a gaming token named ApexCoin with 10 million supply, 3% transfer fee for treasury, and owner pause switch..."
          rows={3}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            background: '#090d16',
            border: '1px solid #334155',
            color: '#fff',
            fontSize: '0.88rem',
            lineHeight: 1.5,
            resize: 'none',
            outline: 'none',
          }}
        />

        {/* Optional Custom API Key Toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '0.75rem', textAlign: 'left', cursor: 'pointer', padding: 0 }}
          >
            {showApiKeyInput ? '▲ Hide External LLM Key' : '⚙️ Optional: Use custom Gemini / OpenAI API key'}
          </button>
          {showApiKeyInput && (
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter GEMINI_API_KEY or OPENAI_API_KEY (optional, built-in AI works automatically)"
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                background: '#090d16',
                border: '1px solid #334155',
                color: '#fff',
                fontSize: '0.78rem',
              }}
            />
          )}
        </div>

        <button
          onClick={() => handleGenerate()}
          disabled={loading || !prompt.trim()}
          style={{
            padding: '10px 18px',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.9rem',
            alignSelf: 'flex-start',
            opacity: loading || !prompt.trim() ? 0.6 : 1,
            cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
          }}
        >
          {loading ? '🧠 AI Synthesizing Graph & Wiring Connections...' : '✨ Generate Connected Graph on Canvas →'}
        </button>

        {/* Diff Preview (PRD FR-6.4) */}
        {previewDiff && (
          <div style={{ background: '#1e293b', border: '1px solid #3b82f6', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                🎉 AI Graph Synthesized Successfully
              </span>
              <span style={{ fontSize: '0.72rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                {previewDiff.totalBlocks} Blocks • {previewDiff.edgesCount} Connections
              </span>
            </div>

            {previewDiff.explanation && (
              <pre
                style={{
                  margin: 0,
                  padding: '10px',
                  background: '#090d16',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontFamily: 'inherit',
                  color: '#93c5fd',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {previewDiff.explanation}
              </pre>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                onClick={handleAccept}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                ✓ Accept & Replace Canvas with this Graph
              </button>
              <button
                onClick={() => { setPreviewGraph(null); setPreviewDiff(null); }}
                style={{
                  padding: '10px 16px',
                  background: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid #475569',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
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
