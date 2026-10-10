'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: '#070a10', color: '#f8fafc', padding: '3.5rem 1.5rem 6rem' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 4.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              color: '#60a5fa',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.75rem',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
            The Canva for Aptos Move • Visual Blocks + Autonomous AI + Gas Optimizer
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ffffff 30%, #93c5fd 80%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Design Smart Contracts Visually. Verify Every Byte.
          </h1>

          <p style={{ fontSize: '1.18rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
            Build robust Aptos Move smart contracts without code, let autonomous AI build graphs from plain English, optimize gas consumption with proven benchmarks, and deploy directly to testnet.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/workspace/demo"
              id="try-canvas-btn"
              style={{
                padding: '0.9rem 2rem',
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                color: '#fff',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.95rem',
                boxShadow: '0 8px 24px -4px rgba(59, 130, 246, 0.5)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              🎨 Launch Canvas Builder →
            </Link>

            <Link
              href="/gas-optimizer"
              id="gas-optimizer-hero-btn"
              style={{
                padding: '0.9rem 1.8rem',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(234, 88, 12, 0.15))',
                color: '#fbbf24',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              ⚡ Gas Optimizer Studio (USP)
            </Link>

            <Link
              href="/dashboard"
              id="dashboard-hero-btn"
              style={{
                padding: '0.9rem 1.6rem',
                background: 'rgba(255, 255, 255, 0.04)',
                color: '#cbd5e1',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.95rem',
                border: '1px solid #1e293b',
              }}
            >
              📁 Browse Templates
            </Link>
          </div>
        </div>

        {/* Core Pillars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
          
          {/* Card 1: Visual Canvas */}
          <div
            style={{
              background: '#0d1322',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
              🎨
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9' }}>Plain-English Canvas</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.55 }}>
              Drag blocks designed for non-programmers: Token, NFT, Vault, Escrow, and Voting. Connected ports validate in real time without blockchain jargon.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '0.5rem', fontSize: '0.78rem', color: '#60a5fa', fontWeight: 600 }}>
              Deterministic Move generation in &lt;500ms
            </div>
          </div>

          {/* Card 2: Autonomous AI */}
          <div
            style={{
              background: '#0d1322',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
              ✨
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9' }}>AI Prompt-to-Blocks</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.55 }}>
              Type any plain English prompt like <em>&quot;Create a meme token with 5% tax and admin minting&quot;</em>. AI synthesizes block configurations and wires connections dynamically.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '0.5rem', fontSize: '0.78rem', color: '#c084fc', fontWeight: 600 }}>
              Live Diff preview before applying
            </div>
          </div>

          {/* Card 3: Gas Optimizer (USP) */}
          <div
            style={{
              background: 'linear-gradient(180deg, #121829 0%, #0d1322 100%)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '12px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
              CORE USP
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
              ⚡
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9' }}>Gas Optimizer Studio</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.55 }}>
              Dedicated environment to benchmark Move functions. Visualizes contract topology, measures exact simulated gas units, and applies verified byte savings with side-by-side diffs.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
              <Link href="/gas-optimizer" style={{ fontSize: '0.82rem', color: '#fbbf24', fontWeight: 700 }}>
                Explore Gas Studio →
              </Link>
            </div>
          </div>

          {/* Card 4: Audit & Permissions */}
          <div
            style={{
              background: '#0d1322',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
              🛡️
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9' }}>Rule-Based Verification</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.55 }}>
              Zero LLM hallucinations in the critical path. 16 deterministic security rules (SC-001 to SC-016), risk score /100, and plain-English answers to &quot;Who can mint?&quot; and &quot;Who can withdraw?&quot;.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '0.5rem', fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>
              Export branded PDF audit reports
            </div>
          </div>

        </div>

        {/* Workflow Showcase Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.7) 100%)',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
              End-to-End Contract Lifecycle
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              From initial idea to verified Aptos testnet deployment in 3 intuitive steps.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: '#090d16', padding: '1.25rem', borderRadius: '10px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa', marginBottom: '4px' }}>STEP 1</div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Compose or Prompt</h4>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Use simple drag-and-drop blocks or prompt the AI drawer to build complete token, escrow, or governance contracts dynamically.
              </p>
            </div>

            <div style={{ background: '#090d16', padding: '1.25rem', borderRadius: '10px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', marginBottom: '4px' }}>STEP 2</div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Audit & Optimize Gas</h4>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Run instant rule-based vulnerability checks, inspect plain-English permissions, and optimize gas with measured Aptos benchmarks.
              </p>
            </div>

            <div style={{ background: '#090d16', padding: '1.25rem', borderRadius: '10px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', marginBottom: '4px' }}>STEP 3</div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>1-Click Testnet Deploy</h4>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Connect Petra or Martian wallet, or deploy via managed testnet faucet with full transaction explorer receipts.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
