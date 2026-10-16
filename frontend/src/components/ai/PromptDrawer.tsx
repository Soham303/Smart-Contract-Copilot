'use client';

import React, { useState, useEffect, useRef } from 'react';
import { promptToGraph } from '../../lib/api';
import { Sparkles, Layers, GitCommit, CheckCircle2, AlertCircle, ArrowRight, Zap, RefreshCw } from 'lucide-react';

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
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStage, setProgressStage] = useState('');
  const [previewGraph, setPreviewGraph] = useState<any>(null);
  const [previewDiff, setPreviewDiff] = useState<any>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: '🚀 Viral Memecoin', text: 'Create a community memecoin named DogeMoon symbol DMOON with 1 billion supply, 2% transfer fee, and emergency pause switch' },
    { label: '🖼️ NFT Drop + Whitelist', text: 'NFT collection named CyberSamurai with 5000 max supply, 5% creator royalty, and VIP whitelist presale' },
    { label: '🤝 Safe Trade Escrow', text: 'Create a secure escrow contract for freelance payment with 14-day refund timeout and owner dispute release' },
    { label: '⏳ Team Token Vesting', text: 'Vesting lockup contract for 2 million tokens with a 30-day cliff and 1-year total linear unlock' },
    { label: '🌱 Staking Rewards Pool', text: 'DeFi staking pool with 7-day lockup duration, reward emission, and emergency pause control' },
  ];

  const startProgressSimulation = () => {
    setProgressPercent(12);
    setProgressStage('Ingesting architectural requirements & extracting parameters...');

    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    progressTimerRef.current = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev < 35) {
          setProgressStage('Selecting Move primitives from verified catalog...');
          return prev + 8;
        } else if (prev < 65) {
          setProgressStage('Synthesizing typed port connections & owner capabilities...');
          return prev + 6;
        } else if (prev < 88) {
          setProgressStage('Validating topology rules & AST safety invariants...');
          return prev + 4;
        } else if (prev < 95) {
          setProgressStage('Finalizing connected block topology and properties...');
          return prev + 1;
        }
        return prev;
      });
    }, 280);
  };

  const stopProgressSimulation = (success: boolean) => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    if (success) {
      setProgressPercent(100);
      setProgressStage('Synthesis complete! Connected multi-block graph ready.');
    }
  };

  const handleGenerate = async (customPrompt?: string) => {
    const textToUse = customPrompt || prompt;
    if (!textToUse.trim()) return;
    setLoading(true);
    setPreviewGraph(null);
    setPreviewDiff(null);
    startProgressSimulation();

    try {
      const res = await promptToGraph(textToUse);
      if (res.graph) {
        stopProgressSimulation(true);
        setPreviewGraph(res.graph);
        setPreviewDiff(res.diff);
      }
    } catch (e) {
      console.error(e);
      stopProgressSimulation(false);
      setProgressStage('Synthesis encountered an error. Please try again.');
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
      setProgressPercent(0);
      setProgressStage('');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        style={{
          width: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--surface-container-lowest, #090d16)',
          border: '1px solid var(--border-subtle, #1e293b)',
          borderRadius: '16px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '9999px',
                background: 'rgba(15, 118, 110, 0.15)',
                border: '1px solid rgba(15, 118, 110, 0.3)',
                color: 'var(--primary, #14b8a6)',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                marginBottom: '8px',
              }}
            >
              <Sparkles size={13} />
              Autonomous Move Architecture Synthesizer
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              AI Prompt-to-Blocks
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px', lineHeight: 1.5 }}>
              Describe your contract in plain English. The AI synthesizes 4–6 interconnected blocks with complete property configurations, typed ports, and auto-layout.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '1.4rem',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Prompts (Click to test instantly)
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
            {quickPrompts.map((qp) => (
              <button
                key={qp.label}
                onClick={() => {
                  setPrompt(qp.text);
                  handleGenerate(qp.text);
                }}
                disabled={loading}
                style={{
                  padding: '5px 11px',
                  borderRadius: '8px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: '#e2e8f0',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                  opacity: loading ? 0.6 : 1,
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
          placeholder="e.g. Create a meme token named DogeMoon with 1 billion supply, 2% transfer fee for treasury, emergency freeze switch, and deflationary burn..."
          rows={3}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: '10px',
            background: '#040711',
            border: '1px solid #334155',
            color: '#ffffff',
            fontSize: '0.88rem',
            lineHeight: 1.5,
            resize: 'none',
            outline: 'none',
          }}
        />

        {/* Action Button & Stepped Progress Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => handleGenerate()}
              disabled={loading || !prompt.trim()}
              style={{
                padding: '10px 20px',
                background: loading ? '#334155' : 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                opacity: loading || !prompt.trim() ? 0.65 : 1,
                cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(15, 118, 110, 0.3)',
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="spin-slow" />
                  Synthesizing Topology...
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  Generate Multi-Block Architecture →
                </>
              )}
            </button>

            {loading && (
              <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--primary, #14b8a6)', fontWeight: 700 }}>
                {progressPercent}% Complete • {100 - progressPercent}% remaining
              </span>
            )}
          </div>

          {/* Animated Progress Bar & Stage Indicator */}
          {loading && (
            <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
                  {progressStage}
                </span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 700 }}>
                  {progressPercent}%
                </span>
              </div>
              <div
                style={{
                  height: '8px',
                  width: '100%',
                  background: '#1e293b',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progressPercent}%`,
                    background: 'linear-gradient(90deg, #0f766e, #14b8a6, #38bdf8)',
                    borderRadius: '9999px',
                    transition: 'width 0.28s ease',
                    boxShadow: '0 0 10px rgba(20, 184, 166, 0.6)',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Diff Preview & Topology Summary */}
        {previewDiff && (
          <div
            style={{
              background: '#090d16',
              border: '1px solid #0f766e',
              borderRadius: '12px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 4px 20px rgba(15, 118, 110, 0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>
                  Architecture Synthesized Successfully
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#38bdf8',
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontWeight: 700,
                  }}
                >
                  {previewDiff.totalBlocks} Blocks
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#10b981',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontWeight: 700,
                  }}
                >
                  {previewDiff.edgesCount} Typed Port Edges
                </span>
              </div>
            </div>

            {previewDiff.explanation && (
              <pre
                style={{
                  margin: 0,
                  padding: '12px',
                  background: '#040711',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#93c5fd',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {previewDiff.explanation}
              </pre>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                onClick={handleAccept}
                style={{
                  flex: 1,
                  padding: '11px',
                  background: 'linear-gradient(135deg, #0f766e 0%, #10b981 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                }}
              >
                <CheckCircle2 size={16} />
                Accept & Place {previewDiff.totalBlocks} Blocks on Canvas
              </button>
              <button
                onClick={() => {
                  setPreviewGraph(null);
                  setPreviewDiff(null);
                  setProgressPercent(0);
                  setProgressStage('');
                }}
                style={{
                  padding: '11px 18px',
                  background: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Discard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
