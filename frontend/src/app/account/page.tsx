'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  ShieldCheck,
  Cpu,
  Key,
  Webhook,
  Sliders,
  Droplets,
  ExternalLink,
  Copy,
  Check,
  FileCode,
  HardDrive,
  CheckCircle2,
} from 'lucide-react';

export default function AccountHubPage() {
  const [faucetLoading, setFaucetLoading] = useState(false);
  const [balance, setBalance] = useState(42.5);
  const [copiedKey, setCopiedKey] = useState(false);
  const [toggleAutoAudit, setToggleAutoAudit] = useState(true);
  const [toggleMoveProver, setToggleMoveProver] = useState(true);
  const [toggleGasTelemetry, setToggleGasTelemetry] = useState(true);

  const handleRequestFaucet = () => {
    setFaucetLoading(true);
    setTimeout(() => {
      setBalance((b) => b + 5.0);
      setFaucetLoading(false);
    }, 1000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText('scc_live_9a83f120c8de77b492b45e89d1234a56');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const deployedModules = [
    {
      module: 'copilot_addr::sky_apes_token',
      standard: 'AIP-21 Fungible Asset',
      address: '0x7a3...e91b',
      bytecodeHash: '0x8f4c...91a2',
      gasIncurred: '2,840 Octas',
      deployedAt: '2025-05-14',
      status: 'Prover Passed',
    },
    {
      module: 'copilot_addr::genesis_collection',
      standard: 'Digital Asset v2',
      address: '0x7a3...e91b',
      bytecodeHash: '0x1c8b...33ef',
      gasIncurred: '4,120 Octas',
      deployedAt: '2025-05-12',
      status: 'Prover Passed',
    },
    {
      module: 'copilot_addr::team_vesting_vault',
      standard: 'Financial Escrow',
      address: '0x7a3...e91b',
      bytecodeHash: '0x55d0...8e11',
      gasIncurred: '1,960 Octas',
      deployedAt: '2025-05-08',
      status: 'Prover Passed',
    },
  ];

  return (
    <div style={{ background: 'var(--surface)', minHeight: 'calc(100vh - 64px)', padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Header Stack */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Account & Deployment Hub
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
              Manage developer identity, Aptos testnet funds, sandbox storage quotas, and deployed bytecode ledger.
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
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            Launch Builder
          </Link>
        </div>

        {/* --- Identity Row (3 Cards Across Top) --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          
          {/* Card 1: Nina Vance Profile + Petra Wallet + Faucet */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0f766e 0%, #3b82f6 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                NV
              </div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>Nina Vance</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>nina@move.studio • Developer Tier</div>
              </div>
            </div>

            <div style={{ background: 'var(--surface-container-low)', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                CONNECTED PETRA WALLET
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                0x7a39...e91b (Aptos Testnet)
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Testnet Balance</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {balance.toFixed(2)} <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>APT</span>
                </div>
              </div>

              <button
                onClick={handleRequestFaucet}
                disabled={faucetLoading}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--primary)',
                  background: 'var(--primary-container)',
                  color: 'var(--primary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Droplets size={14} />
                {faucetLoading ? 'Requesting...' : '+ 5.0 APT Faucet'}
              </button>
            </div>
          </div>

          {/* Card 2: Compute Quota Bar */}
          <div
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <HardDrive size={18} color="var(--primary)" />
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  COMPUTE & STORAGE QUOTA
                </span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                3.8 MB <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ 10 MB sandbox</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Isolated ephemeral Docker sandbox runner capacity.
              </p>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <div style={{ height: '8px', background: 'var(--surface-dim)', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
                <div style={{ height: '100%', width: '38%', background: 'var(--primary)', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <span>38% Allocated</span>
                <span>6.2 MB Available</span>
              </div>
            </div>
          </div>

          {/* Card 3: Contract Trust Score Circular Gauge */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="90" height="90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="3.5"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3.5"
                  strokeDasharray="96, 100"
                />
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>96</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>/ 100</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>
                ACCOUNT TRUST INDEX
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                Pristine Formal Trust
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Based on 100% Move Prover pass rate across 3 deployed packages.
              </p>
            </div>
          </div>

        </div>

        {/* --- Deployed Modules Table (Deterministic Bytecode Ledger) --- */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '3rem',
          }}
        >
          <div
            style={{
              padding: '14px 20px',
              background: 'var(--surface-container-low)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Deployed Modules Ledger (Aptos Testnet)
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Immutable deterministic bytecode tracking with Move Prover verification badges
              </span>
            </div>
            <span
              style={{
                fontSize: '0.6875rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--tertiary)',
                background: 'var(--tertiary-container)',
                padding: '3px 8px',
                borderRadius: '9999px',
                fontWeight: 600,
              }}
            >
              3 Active Packages
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ textAlign: 'left', padding: '12px 18px', color: 'var(--text-muted)' }}>Module Identifier</th>
                <th style={{ textAlign: 'left', padding: '12px 18px', color: 'var(--text-muted)' }}>Package Standard</th>
                <th style={{ textAlign: 'left', padding: '12px 18px', color: 'var(--text-muted)' }}>Target Address</th>
                <th style={{ textAlign: 'left', padding: '12px 18px', color: 'var(--text-muted)' }}>Bytecode Hash</th>
                <th style={{ textAlign: 'left', padding: '12px 18px', color: 'var(--text-muted)' }}>Gas Incurred</th>
                <th style={{ textAlign: 'right', padding: '12px 18px', color: 'var(--text-muted)' }}>Verification</th>
              </tr>
            </thead>
            <tbody>
              {deployedModules.map((m, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 18px', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {m.module}
                  </td>
                  <td style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>{m.standard}</td>
                  <td style={{ padding: '12px 18px', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{m.address}</td>
                  <td style={{ padding: '12px 18px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{m.bytecodeHash}</td>
                  <td style={{ padding: '12px 18px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{m.gasIncurred}</td>
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        background: 'var(--tertiary-container)',
                        border: '1px solid var(--tertiary-border)',
                        color: 'var(--tertiary)',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      <CheckCircle2 size={12} />
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Developer Preferences Section (Dual Cards) --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
          
          {/* Card Left: CLI Tokens & Webhooks */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Key size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                CLI API Tokens & Webhooks
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Authenticate CI/CD pipelines and Aptos CLI toolchain scripts.
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Personal Access Token (Scoped)
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="password"
                  readOnly
                  value="scc_live_9a83f120c8de77b492b45e89d1234a56"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--surface)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                  }}
                />
                <button
                  onClick={handleCopyKey}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--surface-container-low)',
                    color: 'var(--primary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {copiedKey ? <Check size={14} /> : <Copy size={14} />}
                  {copiedKey ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Audit Webhook URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://api.yourdomain.com/webhooks/aptos-audit"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--surface)',
                  fontSize: '0.78rem',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Card Right: Compiler & Studio Toggles */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sliders size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Compiler & Studio Verification Toggles
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Control real-time compilation behaviors in the Visual Studio workspace.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Automatic Real-time AST Audit
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Trigger SC-001..16 rule evaluations on every canvas edge change
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={toggleAutoAudit}
                  onChange={(e) => setToggleAutoAudit(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Formal Move Prover Invariant Verification
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Run mathematical proof checks before enabling deploy gate
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={toggleMoveProver}
                  onChange={(e) => setToggleMoveProver(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Live Gas Telemetry Profiling
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Benchmark gas units during interactive editing
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={toggleGasTelemetry}
                  onChange={(e) => setToggleGasTelemetry(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
              </label>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
