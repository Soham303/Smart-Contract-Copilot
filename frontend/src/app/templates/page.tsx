'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Plus,
  Coins,
  Image,
  Clock,
  Vote,
  Shield,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileCode,
} from 'lucide-react';

export default function TemplatesHubPage() {
  const [promptText, setPromptText] = useState('');

  const samplePromptChips = [
    'Create a capped token named SkyApe with 5% transfer fee',
    'NFT collection with 500 bps royalty and whitelist gate',
    'Linear vesting schedule with 180-day cliff for team allocation',
    'Trustless trade escrow with 7-day refund timeout',
  ];

  const activeProjects = [
    {
      id: 'proj_1',
      name: 'SkyApes_Token_Vesting',
      module: 'copilot_addr::sky_apes_token',
      blocksCount: 4,
      status: 'Compiled & Verified',
      lastModified: '12 mins ago',
      riskScore: 94,
    },
    {
      id: 'proj_2',
      name: 'Aptos_Genesis_NFT',
      module: 'copilot_addr::genesis_collection',
      blocksCount: 3,
      status: 'Compiled & Verified',
      lastModified: '2 hours ago',
      riskScore: 98,
    },
  ];

  const templatesGrid = [
    {
      id: 'template_fungible_token',
      title: 'Fungible Asset (FA)',
      standard: 'AIP-21 Fungible Asset',
      description: 'Standard fungible currency with mint control, supply caps, and burn capability.',
      icon: <Coins size={22} color="var(--primary)" />,
      tag: 'Token Standard',
      accent: 'var(--primary)',
    },
    {
      id: 'template_nft_collection',
      title: 'Digital Asset NFT Collection',
      standard: 'Aptos Digital Asset v2',
      description: 'Capped collectible collection with 5% resale royalty and whitelist gate pass.',
      icon: <Image size={22} color="#7c3aed" />,
      tag: 'Digital Assets',
      accent: '#7c3aed',
    },
    {
      id: 'template_vesting',
      title: 'Timed Vesting & Token Lock',
      standard: 'Financial Primitives',
      description: 'Gradual linear release of tokens over time with a 180-day cliff schedule.',
      icon: <Clock size={22} color="var(--tertiary)" />,
      tag: 'Finance & Escrow',
      accent: 'var(--tertiary)',
    },
    {
      id: 'template_voting_dao',
      title: 'Lightweight DAO',
      standard: 'Governance Standard',
      description: 'Decentralized proposal voting with 20% quorum threshold and council execution.',
      icon: <Vote size={22} color="var(--risk-medium)" />,
      tag: 'Governance',
      accent: 'var(--risk-medium)',
    },
    {
      id: 'template_escrow',
      title: 'Trustless Escrow',
      standard: 'Multi-Party Settlement',
      description: 'Two-party escrow holding funds in trust until conditions are met, with refund timeout.',
      icon: <Shield size={22} color="var(--primary)" />,
      tag: 'Finance & Escrow',
      accent: 'var(--primary)',
    },
    {
      id: 'template_bespoke',
      title: 'Compose Bespoke System',
      standard: 'Custom Architecture',
      description: 'Blank slate infinite canvas to wire bespoke Aptos Move modules from scratch.',
      icon: <Layers size={22} color="var(--text-secondary)" />,
      tag: 'Blank Studio',
      accent: 'var(--text-secondary)',
    },
  ];

  return (
    <div style={{ background: 'var(--surface)', minHeight: 'calc(100vh - 64px)', padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* --- Header Stack --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '9999px',
                background: 'var(--primary-container)',
                border: '1px solid rgba(15, 118, 110, 0.2)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--primary)',
                fontWeight: 600,
                marginBottom: '0.75rem',
              }}
            >
              <Sparkles size={13} />
              Aptos Move Template Library & Active Projects
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Templates & Projects Hub
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
              Jumpstart production-grade contracts with verified architectures or describe your system in plain English.
            </p>
          </div>

          <Link
            href="/workspace/demo"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--primary)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Plus size={16} />
            New Empty Contract
          </Link>
        </div>

        {/* --- AI Prompt Synthesizer Input Bar --- */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '1.5rem',
            marginBottom: '3rem',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              AI Prompt Synthesizer (Prompt-to-Blocks)
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--tertiary)', background: 'var(--tertiary-container)', padding: '2px 8px', borderRadius: '9999px', fontWeight: 600 }}>
              Zero Hallucinations • Autonomous Synthesis
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="e.g. Create a fungible coin named 'Aptos Gold' with a 1,000,000 max supply and 2.5% transfer tax..."
              style={{
                flex: 1,
                minWidth: '280px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--surface)',
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
            <Link
              href="/workspace/demo"
              style={{
                padding: '12px 20px',
                background: 'var(--primary)',
                color: '#ffffff',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-sm)',
                whiteSpace: 'nowrap',
              }}
            >
              Synthesize Graph <ArrowRight size={16} />
            </Link>
          </div>

          {/* Sample Prompt Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Suggestions:</span>
            {samplePromptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setPromptText(chip)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--surface-container-low)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* --- Active Projects (2-Column Cards) --- */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Active Workspace Projects
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>2 projects active</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {activeProjects.map((proj) => (
              <div
                key={proj.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <FileCode size={18} color="var(--primary)" />
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{proj.name}</strong>
                  </div>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {proj.module}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>{proj.blocksCount} connected blocks</span>
                    <span>•</span>
                    <span style={{ color: 'var(--tertiary)', fontWeight: 600 }}>{proj.status}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--text-muted)' }}>{proj.lastModified}</span>
                  </div>
                </div>

                <Link
                  href={`/workspace/${proj.id}`}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    background: 'var(--surface-container-low)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--primary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                  }}
                >
                  Open Studio
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* --- 3x2 Template Grid --- */}
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Aptos Move Pre-Wired Templates
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Production standards featuring verified capability patterns and primary fungible stores.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {templatesGrid.map((tmpl) => (
              <div
                key={tmpl.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `4px solid ${tmpl.accent}`,
                  transition: 'transform 0.15s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {tmpl.icon}
                      <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                        {tmpl.tag}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontFamily: 'var(--font-mono)',
                        background: 'var(--surface-container-low)',
                        color: 'var(--text-secondary)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {tmpl.standard}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {tmpl.title}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    {tmpl.description}
                  </p>
                </div>

                <Link
                  href="/workspace/demo"
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    background: 'var(--surface-container-low)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Load into Canvas</span>
                  <ArrowRight size={14} color="var(--primary)" />
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
