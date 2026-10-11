'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Info,
  ChevronDown,
  ChevronUp,
  Lock,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';

export default function SecurityAuditPage() {
  const [expandedRule, setExpandedRule] = useState<string | null>('SC-006');
  const [generatingReport, setGeneratingReport] = useState(false);

  const findings = [
    {
      id: 'SC-006',
      title: 'Unbounded transfer fee basis points',
      severity: 'Medium',
      status: 'Resolved',
      message: 'Transfer fee parameter was not asserted <= 1000 bps (10%). Guardrail assert added.',
      fix: 'assert!(fee_bps <= 1000, EINVALID_FEE);',
      ruleCode: 'sources/token.move:42',
    },
    {
      id: 'SC-001',
      title: 'Privileged entry function lacks AdminCapability check',
      severity: 'Critical',
      status: 'Passed',
      message: 'All administrative functions verify AdminCapability resource ownership via signer::address_of.',
      fix: 'Verified: assert!(exists<AdminCapability>(caller_addr), ENOT_AUTHORIZED);',
      ruleCode: 'sources/token.move:18',
    },
    {
      id: 'SC-002',
      title: 'Unrestricted mint or supply inflation',
      severity: 'Critical',
      status: 'Passed',
      message: 'Mint function enforces max_supply boundary check before emitting fungible assets.',
      fix: 'Verified: assert!(asset.total_minted + amount <= asset.max_supply, EEXCEEDS_CAP);',
      ruleCode: 'sources/token.move:34',
    },
    {
      id: 'SC-011',
      title: 'Missing emergency pause check in state mutator',
      severity: 'Info',
      status: 'Passed',
      message: 'Primary store transfer calls check PauseControl circuit breaker state.',
      fix: 'Verified: assert!(!borrow_global<PauseControl>(@copilot_addr).is_paused, EPAUSED);',
      ruleCode: 'sources/token.move:56',
    },
  ];

  const permissionsMatrix = [
    { action: 'Mint Tokens', actor: 'Owner / Admin', guardrail: 'Capped at 10,000,000 SAPE', verified: true },
    { action: 'Transfer Tokens', actor: 'Anyone', guardrail: 'Primary Fungible Store routing', verified: true },
    { action: 'Burn Tokens', actor: 'Holder Only', guardrail: 'BurnRef validated against balance', verified: true },
    { action: 'Emergency Pause', actor: 'AdminCapability', guardrail: 'Freezes all state update functions', verified: true },
    { action: 'Claim Vesting', actor: 'Beneficiary', guardrail: 'Linear cliff unlocks after 180 days', verified: true },
    { action: 'Upgrade Module', actor: 'Nobody', guardrail: 'Immutable package flag enabled', verified: true },
  ];

  const handleExportPDF = () => {
    setGeneratingReport(true);
    setTimeout(() => {
      setGeneratingReport(false);
      window.print();
    }, 800);
  };

  return (
    <div style={{ background: 'var(--surface)', minHeight: 'calc(100vh - 64px)', padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Header Stack */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '9999px',
                background: 'var(--tertiary-container)',
                border: '1px solid var(--tertiary-border)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--tertiary)',
                fontWeight: 600,
                marginBottom: '0.75rem',
              }}
            >
              <ShieldCheck size={14} />
              Formal Security & AST Audit Engine • Ruleset v1.0 (SC-001 - SC-016)
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Security & Audit Suite
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
              Deterministic AST static analysis, permission boundary guarantees, and cryptographic safety verification.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link
              href="/workspace/demo"
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: '#ffffff',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              Open in Canvas
            </Link>

            <button
              onClick={handleExportPDF}
              style={{
                padding: '0.65rem 1.25rem',
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
                cursor: 'pointer',
              }}
            >
              <Download size={15} />
              {generatingReport ? 'Rendering Report...' : 'Download PDF Audit'}
            </button>
          </div>
        </div>

        {/* --- Health Overview Cards (3-Column) --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          
          {/* Card 1: Circular SVG Score Gauge */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
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
                  strokeDasharray="94, 100"
                />
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>94</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>/ 100</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>
                SECURITY HEALTH INDEX
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                Low Risk Profile
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Zero critical vulnerabilities detected. AST invariants formally hold.
              </p>
            </div>
          </div>

          {/* Card 2: Severity Rule Count Pill List */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              RULE VERIFICATION BREAKDOWN
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              <div style={{ background: 'var(--risk-critical-bg)', border: '1px solid var(--risk-critical-border)', padding: '6px 10px', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--risk-critical)', fontWeight: 600 }}>Critical Findings</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--risk-critical)' }}>0</div>
              </div>
              <div style={{ background: 'var(--risk-high-bg)', border: '1px solid var(--risk-high-border)', padding: '6px 10px', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--risk-high)', fontWeight: 600 }}>High Findings</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--risk-high)' }}>0</div>
              </div>
              <div style={{ background: 'var(--risk-medium-bg)', border: '1px solid var(--risk-medium-border)', padding: '6px 10px', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--risk-medium)', fontWeight: 600 }}>Medium (Resolved)</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--risk-medium)' }}>1</div>
              </div>
              <div style={{ background: 'var(--risk-low-bg)', border: '1px solid var(--risk-low-border)', padding: '6px 10px', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--risk-low)', fontWeight: 600 }}>Info Advisories</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--risk-low)' }}>2</div>
              </div>
            </div>
          </div>

          {/* Card 3: Measured Gas Reduction */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              BENCHMARK EFFICIENCY
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                -24.6%
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--tertiary)', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <TrendingDown size={14} /> Net Gas Saved
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Redundant global storage lookups converted to local cached references across entry calls.
            </p>
          </div>
        </div>

        {/* --- Centerpiece: Plain-English Permissions Matrix & Key Questions Answered --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          
          {/* Permissions Matrix Table */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                padding: '12px 18px',
                background: 'var(--surface-container-low)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Plain-English Permissions Matrix
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Exact capability mapping derived deterministically from AST
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
                Zero Unchecked Access
              </span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)' }}>Action</th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)' }}>Authorized Actor</th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)' }}>Security Guardrail</th>
                </tr>
              </thead>
              <tbody>
                {permissionsMatrix.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)', background: idx % 2 === 0 ? '#ffffff' : 'var(--surface)' }}>
                    <td style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{row.action}</td>
                    <td style={{ padding: '10px 16px', color: 'var(--primary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{row.actor}</td>
                    <td style={{ padding: '10px 16px', color: 'var(--tertiary)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={13} />
                        {row.guardrail}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Key Questions Answered Card */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Key Questions Answered
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Plain-English guarantees answering common smart contract exploit queries.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ❓ Who can mint new tokens?
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Only the deployer holding <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>AdminCapability</code>. Capped strictly at 10M tokens.
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ❓ Who can withdraw or drain user funds?
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  <strong>Nobody</strong>. All token balances reside in segregated Primary Fungible Stores owned by individual holders.
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ❓ Can the total token supply grow indefinitely?
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  <strong>No</strong>. The module asserts <code style={{ fontFamily: 'var(--font-mono)' }}>total_minted &lt;= max_supply</code> at the Move bytecode level.
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ❓ Can the contract be upgraded maliciously later?
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  The package is set to <strong>Immutable</strong> mode upon deployment, locking source code permanently.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* --- Rule Findings Accordion --- */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Rule Verification Findings (SC-001 - SC-016)
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Automated security rules verifying resource capabilities, signer authentication, and integer arithmetic.
              </p>
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--tertiary)',
                background: 'var(--tertiary-container)',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontWeight: 600,
              }}
            >
              All 16 Rules Evaluated
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {findings.map((f) => {
              const isExpanded = expandedRule === f.id;
              return (
                <div
                  key={f.id}
                  style={{
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setExpandedRule(isExpanded ? null : f.id)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: isExpanded ? 'var(--surface-container-low)' : '#ffffff',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: f.severity === 'Critical' ? 'var(--risk-critical-bg)' : f.severity === 'Medium' ? 'var(--risk-medium-bg)' : 'var(--risk-low-bg)',
                          color: f.severity === 'Critical' ? 'var(--risk-critical)' : f.severity === 'Medium' ? 'var(--risk-medium)' : 'var(--risk-low)',
                          border: `1px solid ${f.severity === 'Critical' ? 'var(--risk-critical-border)' : f.severity === 'Medium' ? 'var(--risk-medium-border)' : 'var(--risk-low-border)'}`,
                        }}
                      >
                        {f.id} • {f.severity}
                      </span>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{f.title}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: f.status === 'Resolved' ? 'var(--risk-medium)' : 'var(--tertiary)',
                        }}
                      >
                        {f.status}
                      </span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div style={{ padding: '12px 16px', background: 'var(--surface)', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8125rem' }}>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{f.message}</p>
                      <div
                        style={{
                          background: 'var(--code-canvas)',
                          color: 'var(--code-text)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--code-border)',
                        }}
                      >
                        <span style={{ color: '#34d399' }}>// Fix verified in {f.ruleCode}:</span>
                        <div style={{ marginTop: '2px' }}>{f.fix}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
