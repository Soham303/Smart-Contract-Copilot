'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Layers,
  ShieldCheck,
  Zap,
  ArrowRight,
  Code2,
  Lock,
  Flame,
  CheckCircle2,
  FileCheck2,
  Sparkles,
} from 'lucide-react';

// Three.js needs the browser, so load the scene on the client only.
const HeroScene = dynamic(() => import('@/components/HeroScene'), { ssr: false });

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--surface)', color: 'var(--text-primary)', padding: '3.5rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        {/* --- Restructured 2-Column Hero Section --- */}
        <section
          aria-label="Hero Introduction"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: 'clamp(3.5rem, 6.5vw, 6rem)',
            alignItems: 'center',
            marginBottom: '7.5rem',
            paddingTop: '0.75rem',
          }}
        >
          {/* Left Column: Hero Copy & Actions */}
          <div style={{ textAlign: 'left', maxWidth: '640px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                borderRadius: '9999px',
                background: 'var(--primary-container)',
                border: '1px solid rgba(15, 118, 110, 0.25)',
                color: 'var(--primary)',
                fontSize: '0.85rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                marginBottom: '1.75rem',
                boxShadow: '0 2px 8px rgba(15, 118, 110, 0.1)',
              }}
            >
              <span className="pulse-dot" />
              The Canva for Aptos Move • Move Studio Pristine
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.85rem, 4.8vw, 4.15rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.1,
                marginBottom: '1.5rem',
                color: 'var(--text-primary)',
              }}
            >
              Design Smart Contracts Visually.{' '}
              <span
                style={{
                  color: 'var(--primary)',
                  background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Verify Every Byte.
              </span>
            </h1>

            <p
              style={{
                fontSize: '1.1875rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                marginBottom: '2.5rem',
                maxWidth: '580px',
              }}
            >
              Build robust Aptos Move smart contracts without guessing code. Connect verified resource blocks,
              preview deterministic bytecode, run rule-based audits, measure live gas savings, and deploy safely to testnet.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <Link
                href="/workspace/demo"
                id="try-canvas-btn"
                style={{
                  padding: '1rem 1.85rem',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.975rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(15, 118, 110, 0.35)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Zap size={17} />
                Start Building (Free Testnet)
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/gas-optimizer"
                id="view-optimizer-btn"
                style={{
                  padding: '1rem 1.75rem',
                  background: 'var(--surface-container-lowest)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.975rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Flame size={17} color="var(--risk-medium)" />
                Explore Gas Lab
              </Link>
            </div>

            {/* Micro Feature Badges */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.75rem',
                flexWrap: 'wrap',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <ShieldCheck size={16} color="var(--primary)" />
                <span>Move Prover Verified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Layers size={16} color="var(--primary)" />
                <span>Visual Resource Graph</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <CheckCircle2 size={16} color="var(--tertiary)" />
                <span>Petra Wallet Ready</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Hero Scene */}
          <div style={{ width: '100%', minWidth: 0 }}>
            <HeroScene />
          </div>
        </section>

        {/* Transition Header to the Interactive IDE Preview */}
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'var(--surface-container-low)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            <Sparkles size={13} color="var(--primary)" />
            Live Studio Environment • Real-time Node Compiler
          </div>
          <h2
            style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              marginTop: '0.65rem',
              marginBottom: '0.5rem',
            }}
          >
            Visual Move Canvas Meets Deterministic Bytecode
          </h2>
          <p
            style={{
              fontSize: '0.9375rem',
              color: 'var(--text-muted)',
              maxWidth: '580px',
              margin: '0 auto',
            }}
          >
            Drag logic nodes on the canvas, inspect live Aptos Move code output, and run formal prover verification before testnet deployment.
          </p>
        </div>

        {/* --- Interactive Hero Graphic (Split Node Graph & Dark Monaco Panel) --- */}
        <div
          style={{
            background: 'var(--surface-container-lowest)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            marginBottom: '5rem',
          }}
        >
          {/* Top Window Bar */}
          <div
            style={{
              padding: '10px 16px',
              background: 'var(--surface-container-low)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginLeft: '8px' }}>
                SkyApes_Token_Vesting.mv • Formal AST Verification Session
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--tertiary)',
                  background: 'var(--tertiary-container)',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                }}
              >
                ● Live Sync 120ms
              </span>
            </div>
          </div>

          {/* Split Body: Visual Nodes Left, Monaco Bytecode Right */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', minHeight: '380px' }}>

            {/* Left: Connected Visual Node Graph on Pristine Dot Matrix */}
            <div
              style={{
                padding: '2rem',
                background: 'var(--surface)',
                backgroundImage: 'radial-gradient(var(--surface-dim) 1.5px, transparent 1.5px)',
                backgroundSize: '16px 16px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '16px',
              }}
            >
              {/* Node 1: Fungible Token */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  boxShadow: 'var(--shadow-node)',
                  borderTop: '4px solid #0f766e',
                  maxWidth: '340px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1rem' }}>🪙</span>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Fungible Token (FA)</strong>
                  </div>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--tertiary)', background: 'var(--tertiary-container)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                    AIP-21
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  Name: &quot;SkyApe Token&quot; • Symbol: &quot;SAPE&quot; • Decimals: 8
                </div>
              </div>

              {/* Connecting Vector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '40px', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600 }}>
                <span style={{ width: '2px', height: '16px', background: 'var(--primary)' }} />
                <span>has MintRef capability ➔</span>
              </div>

              {/* Node 2: Mint Control Gate */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  boxShadow: 'var(--shadow-node)',
                  borderTop: '4px solid #ea580c',
                  maxWidth: '340px',
                  marginLeft: '20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Lock size={15} color="#ea580c" />
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Mint Control Gate</strong>
                  </div>
                  <span style={{ fontSize: '0.6875rem', color: '#ea580c', background: 'var(--risk-high-bg)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                    Guardrail
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  Max Supply: 10,000,000 SAPE • Signer: Admin Only
                </div>
              </div>

              {/* Node 3: Linear Vesting Lock */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  boxShadow: 'var(--shadow-node)',
                  borderTop: '4px solid #059669',
                  maxWidth: '340px',
                  marginLeft: '40px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} color="#059669" />
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Linear Vesting Lock</strong>
                  </div>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--tertiary)', background: 'var(--tertiary-container)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                    180d Cliff
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  Beneficiary: Team Allocation • Release: Continuous
                </div>
              </div>
            </div>

            {/* Right: Dark Monaco Move 2.0 Bytecode Panel */}
            <div
              style={{
                background: 'var(--code-canvas)',
                padding: '1.5rem',
                color: 'var(--code-text)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                borderLeft: '1px solid var(--border-subtle)',
                overflowX: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
                <span style={{ color: '#93c5fd', fontSize: '0.75rem' }}>sources/sky_apes_token.move</span>
                <span style={{ color: '#34d399', fontSize: '0.72rem' }}>Move Prover Passed ✓</span>
              </div>
              <pre style={{ margin: 0 }}>
                <code>
                  {`module copilot_addr::sky_apes_token {
    use std::signer;
    use aptos_framework::fungible_asset::{Self, MintRef, TransferRef};
    use aptos_framework::primary_fungible_store;

    struct AdminCapability has key, store { }

    struct ManagedFungibleAsset has key {
        mint_ref: MintRef,
        total_minted: u64,
        max_supply: u64,
    }

    public entry fun mint(
        caller: &signer,
        recipient: address,
        amount: u64
    ) acquires ManagedFungibleAsset, AdminCapability {
        assert!(exists<AdminCapability>(signer::address_of(caller)), 1);
        let asset = borrow_global_mut<ManagedFungibleAsset>(@copilot_addr);
        assert!(asset.total_minted + amount <= asset.max_supply, 2);
        
        let coins = fungible_asset::mint(&asset.mint_ref, amount);
        primary_fungible_store::deposit(recipient, coins);
        asset.total_minted = asset.total_minted + amount;
    }
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>

        {/* --- 3-Column Core Value Pillars --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>

          {/* Card 1 */}
          <div
            style={{
              background: 'var(--surface-container-lowest)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: 'var(--primary-container)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Layers size={22} />
            </div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 700, marginBottom: '6px' }}>
              01 • VISUAL BLOCK CANVAS
            </div>
            <h3 style={{ fontSize: '1.18rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Deterministic Move Assembly
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Drag, connect, and configure typed blocks. The engine transforms node topologies into verified Aptos Move
              packages with line-level source mapping.
            </p>
          </div>

          {/* Card 2 */}
          <div
            style={{
              background: 'var(--surface-container-lowest)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: 'var(--tertiary-container)',
                color: 'var(--tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--tertiary)', fontWeight: 700, marginBottom: '6px' }}>
              02 • INSTANT PERMISSIONS MATRIX
            </div>
            <h3 style={{ fontSize: '1.18rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Plain-English Security Explainer
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Never wonder who can mint, pause, or withdraw. Get deterministic access matrices and rule-based
              audits (SC-001 through SC-016) with zero code hallucinations.
            </p>
          </div>

          {/* Card 3 */}
          <div
            style={{
              background: 'var(--surface-container-lowest)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: 'var(--risk-medium-bg)',
                color: 'var(--risk-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Flame size={22} />
            </div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--risk-medium)', fontWeight: 700, marginBottom: '6px' }}>
              03 • MEASURED GAS & DEPLOY
            </div>
            <h3 style={{ fontSize: '1.18rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Verified Invariant Optimization
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Benchmark entry functions against real storage operations. Apply verified gas diff patches and publish
              directly to Aptos Testnet via Petra wallet.
            </p>
          </div>
        </div>

        {/* --- Side-by-Side Comparison: Cryptic Move vs Plain-English Tabular Matrix --- */}
        <div
          style={{
            background: 'var(--surface-container-lowest)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '4rem',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 700 }}>
              DETERMINISTIC CLARITY
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px', color: 'var(--text-primary)' }}>
              Cryptic Code vs. Transparent Governance
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
              See permissions at a glance before any byte touches the blockchain.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>

            {/* Left: Cryptic Code Snippet */}
            <div
              style={{
                background: 'var(--code-canvas)',
                borderRadius: '10px',
                padding: '1.25rem',
                border: '1px solid var(--code-border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: 'var(--code-text)',
              }}
            >
              <div style={{ color: '#ef4444', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>✕</span> Complex & Vulnerable Move Entrypoint
              </div>
              <pre style={{ margin: 0, opacity: 0.9 }}>
                {`// Cryptic logic: does caller actually hold authority?
public entry fun mint_tokens(
    acc: &signer,
    amount: u64
) acquires Treasury {
    // Missing AdminCapability verification!
    // Total supply unbounded!
    let tr = borrow_global_mut<Treasury>(@addr);
    tr.balance = tr.balance + amount;
}`}
              </pre>
            </div>

            {/* Right: Clean Tabular Permissions Matrix */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '10px 14px',
                  background: 'var(--surface-container-low)',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                }}
              >
                <CheckCircle2 size={16} color="var(--tertiary)" />
                Smart Contract Copilot Permissions Matrix
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-muted)' }}>Action</th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-muted)' }}>Actor</th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-muted)' }}>Guardrail Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>Mint Tokens</td>
                    <td style={{ padding: '8px 12px', color: 'var(--primary)' }}>Owner / Admin</td>
                    <td style={{ padding: '8px 12px', color: 'var(--tertiary)' }}>✓ Capped at 10M SAPE</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>Transfer SAPE</td>
                    <td style={{ padding: '8px 12px' }}>Anyone</td>
                    <td style={{ padding: '8px 12px', color: 'var(--tertiary)' }}>✓ Primary Fungible Store</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>Emergency Pause</td>
                    <td style={{ padding: '8px 12px', color: 'var(--primary)' }}>Admin Capability</td>
                    <td style={{ padding: '8px 12px', color: 'var(--tertiary)' }}>✓ Freezes all state updates</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>Upgrade Module</td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Nobody</td>
                    <td style={{ padding: '8px 12px', color: 'var(--tertiary)' }}>✓ Immutable Package Flag</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* --- Bottom Call to Action --- */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--surface-container-low) 0%, var(--primary-container) 100%)',
            border: '1px solid rgba(15, 118, 110, 0.25)',
            borderRadius: '16px',
            padding: '3rem 2rem',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            Ready to Build Your First Move Smart Contract?
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 1.75rem', fontSize: '0.9375rem' }}>
            Open the visual canvas, test deterministic code generation, and export production-ready Aptos Move packages today.
          </p>
          <Link
            href="/workspace/demo"
            style={{
              padding: '0.85rem 2rem',
              background: 'var(--primary)',
              color: '#ffffff',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.9375rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            Launch Visual Studio <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}