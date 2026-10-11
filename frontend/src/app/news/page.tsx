'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Radio,
  TrendingUp,
  ShieldAlert,
  Mail,
  ArrowRight,
  BookOpen,
  Calendar,
  ExternalLink,
  Flame,
} from 'lucide-react';

export default function MarketRadarNewsPage() {
  const [activeFilter, setActiveFilter] = useState('All News');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filterPills = [
    'All News',
    'Framework & Upgrades',
    'Security & Audits',
    'Finance & Markets',
    'Move Prover & Tooling',
  ];

  const editorialDispatches = [
    {
      id: 'dispatch_1',
      category: 'Security & Audits',
      title: 'Post-Mortem: Unbounded Capability Drop Vulnerability in Move v1.0',
      summary: 'Analysis of how capability leaks through public non-entry functions enabled unauthorized re-minting in legacy modules, and how AIP-21 eliminates this vector.',
      readTime: '6 min read',
      date: 'May 14, 2025',
      citation: 'Audit Citation: SC-003',
      badgeColor: 'var(--risk-critical)',
      badgeBg: 'var(--risk-critical-bg)',
    },
    {
      id: 'dispatch_2',
      category: 'Framework & Upgrades',
      title: 'Aptos Digital Asset Standard v2: Object Architecture Deep Dive',
      summary: 'Why moving from token accounts to first-class Move Objects reduces gas overhead by 34% and prevents dangling resource pointers.',
      readTime: '4 min read',
      date: 'May 11, 2025',
      citation: 'Architecture Spec: AIP-11',
      badgeColor: '#7c3aed',
      badgeBg: 'rgba(124, 58, 237, 0.1)',
    },
    {
      id: 'dispatch_3',
      category: 'Finance & Markets',
      title: 'Liquid Staking Yield Curves & Move Re-Entrancy Guarantees',
      summary: 'How Move linear typing guarantees asset preservation in multi-pool staking vaults without requiring expensive re-entrancy locks.',
      readTime: '8 min read',
      date: 'May 08, 2025',
      citation: 'Formal Verification: MVP-88',
      badgeColor: 'var(--tertiary)',
      badgeBg: 'var(--tertiary-container)',
    },
    {
      id: 'dispatch_4',
      category: 'Move Prover & Tooling',
      title: 'Compiling Move 2.0: Invariant Prover vs. Fuzz Testing in Production',
      summary: 'A benchmark comparison showing how formal mathematical proofs detect edge-case overflows 100x faster than traditional fuzzing harnesses.',
      readTime: '5 min read',
      date: 'May 03, 2025',
      citation: 'Benchmark Lab: Gas Matrix v1.4',
      badgeColor: 'var(--primary)',
      badgeBg: 'var(--primary-container)',
    },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <div style={{ background: 'var(--surface)', minHeight: 'calc(100vh - 64px)', padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Header Stack */}
        <div style={{ marginBottom: '2rem' }}>
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
            <Radio size={14} />
            Ecosystem Market Radar • Real-time Research & Dispatches
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Smart Contract & Market News
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
            Curated engineering updates, security bulletins, and formal verification findings from the Aptos ecosystem.
          </p>
        </div>

        {/* --- Filter Pills (Horizontal Scrollable Pill Bar) --- */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '2.5rem' }}>
          {filterPills.map((pill) => (
            <button
              key={pill}
              onClick={() => setActiveFilter(pill)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                border: activeFilter === pill ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                background: activeFilter === pill ? 'var(--primary)' : '#ffffff',
                color: activeFilter === pill ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.15s ease',
              }}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* --- Featured Editorial (Wide Hero Card: Aptos v1.15 Framework Upgrade) --- */}
        <div
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, var(--surface-container-low) 100%)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '3rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <span
              style={{
                fontSize: '0.6875rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                background: 'var(--primary-container)',
                color: 'var(--primary)',
                padding: '4px 10px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
              }}
            >
              HIGH-IMPACT ARCHITECTURE UPGRADE
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Published May 14, 2025 • 5 min read</span>
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            Aptos Framework v1.15 Released: Primary Fungible Store Gas Halved & Dynamic Capability Trees
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            The latest core update introduces critical performance enhancements to Aptos Move, directly affecting visual contract compilation and storage overhead.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#ffffff', borderRadius: '8px', padding: '12px', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>⚡ 52% Cheaper Primary Stores</strong>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Primary stores now bypass auxiliary object creation in baseline mint flows.
              </p>
            </div>
            <div style={{ background: '#ffffff', borderRadius: '8px', padding: '12px', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ fontSize: '0.85rem', color: 'var(--tertiary)' }}>🛡️ Inlined Type Guardrails</strong>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Move compiler automatically inlines single-assertion signer checks.
              </p>
            </div>
            <div style={{ background: '#ffffff', borderRadius: '8px', padding: '12px', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ fontSize: '0.85rem', color: '#7c3aed' }}>📦 Move 2.0 Syntax Standard</strong>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Full support for positional struct unpack patterns and match syntax.
              </p>
            </div>
          </div>

          <Link
            href="/workspace/demo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--primary)',
            }}
          >
            Test v1.15 in Visual Studio <ArrowRight size={14} />
          </Link>
        </div>

        {/* --- Main Content Grid: 2-Column Editorial Feed Left, 1-Column Rail Right --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr)) 340px', gap: '2rem' }}>
          
          {/* Left: Editorial Feed (2-Column Grid) */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Research Dispatches & Post-Mortems
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {editorialDispatches.map((post) => (
                <div
                  key={post.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          color: post.badgeColor,
                          background: post.badgeBg,
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        {post.category}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{post.readTime}</span>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '8px' }}>
                      {post.title}
                    </h4>

                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {post.summary}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{post.citation}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Read Dispatch →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Rail: Market Ticker, Security Bulletin Watchlist, Newsletter Signup */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Live Ecosystem Market Ticker */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <TrendingUp size={16} color="var(--primary)" />
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Aptos Network Telemetry
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>APT Price</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>$9.42</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--tertiary)', fontWeight: 600, marginLeft: '4px' }}>+4.8%</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ecosystem TVL</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>$342.8M</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Gas Unit Price</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                    100 Octas
                  </span>
                </div>
              </div>
            </div>

            {/* Security Bulletin Watchlist */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <ShieldAlert size={16} color="var(--risk-critical)" />
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Security Bulletin Watchlist
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
                <div style={{ padding: '6px 8px', borderRadius: '6px', background: 'var(--risk-critical-bg)', color: 'var(--risk-critical)' }}>
                  <strong>CVE-2025-014:</strong> Public entry signer spoofing in uncompiled scripts.
                </div>
                <div style={{ padding: '6px 8px', borderRadius: '6px', background: 'var(--risk-medium-bg)', color: 'var(--risk-medium)' }}>
                  <strong>Advisory:</strong> Unbounded fee parameters in custom primary stores.
                </div>
              </div>
            </div>

            {/* Zero-Day Email Dispatch Signup */}
            <div
              style={{
                background: 'linear-gradient(135deg, var(--surface-container-low) 0%, var(--primary-container) 100%)',
                border: '1px solid rgba(15, 118, 110, 0.25)',
                borderRadius: '12px',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Mail size={16} color="var(--primary)" />
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Zero-Day Security Dispatch
                </h4>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Receive immediate email alerts when new Aptos Move vulnerabilities or compiler patches drop.
              </p>

              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="auditor@firm.xyz"
                  required
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                    background: '#ffffff',
                    fontSize: '0.78rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {subscribed ? '✓ Subscribed to Alerts' : 'Join Security Dispatch'}
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
