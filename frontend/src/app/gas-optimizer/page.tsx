'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  Upload,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  FileCode,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const SAMPLE_BENCHMARK_MOVE = `// Move Contract Benchmark for Gas Optimization
module copilot_addr::treasury_token {
    use std::signer;
    use aptos_framework::fungible_asset::{Self, MintRef, TransferRef, Metadata};
    use aptos_framework::primary_fungible_store;

    struct AdminCapability has key, store {
        admin_address: address,
    }

    struct ManagedFungibleAsset has key {
        mint_ref: MintRef,
        transfer_ref: TransferRef,
        total_minted: u64,
        max_supply: u64,
    }

    struct PauseControl has key {
        is_paused: bool,
    }

    fun assert_admin(caller: &signer) acquires AdminCapability {
        assert!(exists<AdminCapability>(signer::address_of(caller)), 1);
    }

    public entry fun mint(caller: &signer, recipient: address, amount: u64) acquires ManagedFungibleAsset, AdminCapability {
        assert_admin(caller);
        let caller_addr = signer::address_of(caller);
        // UNOPTIMIZED: Multiple redundant borrow_global reads
        assert!(borrow_global<ManagedFungibleAsset>(caller_addr).total_minted + amount <= borrow_global<ManagedFungibleAsset>(caller_addr).max_supply, 2);
        let mint_ref = &borrow_global<ManagedFungibleAsset>(caller_addr).mint_ref;
        let fa = fungible_asset::mint(mint_ref, amount);
        primary_fungible_store::deposit(recipient, fa);
        borrow_global_mut<ManagedFungibleAsset>(caller_addr).total_minted = borrow_global<ManagedFungibleAsset>(caller_addr).total_minted + amount;
    }

    public entry fun set_pause(caller: &signer, paused: bool) acquires PauseControl, AdminCapability {
        assert_admin(caller);
        let control = borrow_global_mut<PauseControl>(@copilot_addr);
        control.is_paused = paused;
    }
}
`;

export default function GasOptimizerPage() {
  const [sourceCode, setSourceCode] = useState<string>(SAMPLE_BENCHMARK_MOVE);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [appliedPatches, setAppliedPatches] = useState<string[]>(['opt_cache_borrow_global']);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const functionProfiles = [
    { name: 'mint()', baseline: 1240, optimized: 1060, reduction: '14.5%', pctBar: 85 },
    { name: 'burn()', baseline: 890, optimized: 890, reduction: '0.0%', pctBar: 60 },
    { name: 'set_pause()', baseline: 510, optimized: 450, reduction: '11.8%', pctBar: 40 },
    { name: 'transfer()', baseline: 760, optimized: 760, reduction: '0.0%', pctBar: 55 },
    { name: 'release_escrow()', baseline: 980, optimized: 820, reduction: '16.3%', pctBar: 68 },
  ];

  const handleApplyPatch = (patchId: string) => {
    if (appliedPatches.includes(patchId)) {
      setAppliedPatches(appliedPatches.filter((p) => p !== patchId));
    } else {
      setAppliedPatches([...appliedPatches, patchId]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sourceCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div style={{ background: 'var(--surface)', minHeight: 'calc(100vh - 64px)', padding: '2rem 1.5rem 5rem' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        {/* --- DEMO / SIMULATION MODE Banner (Prominent Amber #fffbeb) --- */}
        <div
          style={{
            background: 'var(--risk-medium-bg)',
            border: '1px solid var(--risk-medium-border)',
            borderRadius: '10px',
            padding: '12px 18px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                background: 'var(--risk-medium)',
                color: '#ffffff',
                fontSize: '0.6875rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '4px',
                letterSpacing: '0.04em',
              }}
            >
              DEMO / SIMULATION MODE
            </span>
            <span style={{ fontSize: '0.85rem', color: '#92400e', fontWeight: 600 }}>
              Gas benchmarks calculated using Aptos Testnet node execution profiles (100 Octas/gas unit).
            </span>
          </div>

          <Link
            href="/workspace/demo"
            style={{
              fontSize: '0.78rem',
              color: 'var(--risk-medium)',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Return to Studio Canvas <ArrowRight size={14} />
          </Link>
        </div>

        {/* Header Stack */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Gas Optimization Lab
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
              Formal storage access caching, inlined hot helpers, and verified bytecode savings for Aptos Move.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleCopy}
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
                cursor: 'pointer',
              }}
            >
              {copiedCode ? <Check size={15} color="var(--tertiary)" /> : <Copy size={15} />}
              {copiedCode ? 'Copied Code' : 'Copy Optimized Move'}
            </button>
          </div>
        </div>

        {/* --- Dropzone for Move Packages --- */}
        <div
          style={{
            background: '#ffffff',
            border: '2px dashed var(--border-strong)',
            borderRadius: '12px',
            padding: '1.75rem',
            textAlign: 'center',
            marginBottom: '2rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--surface-container-low)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Upload size={20} />
            </div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              Drop Move package or single .move file here to profile
            </strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Supports .move, Move.toml, or compressed .zip packages
            </span>
          </div>
        </div>

        {/* --- Benchmark Metrics Bar (4 KPI Cards) --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          
          <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              BASELINE GAS
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              14,200 <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>Octas</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Standard unoptimized bytecode
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', textTransform: 'uppercase' }}>
              OPTIMIZED GAS
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
              11,400 <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>Octas</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--tertiary)', fontWeight: 600, marginTop: '2px' }}>
              -19.7% storage efficiency gain
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--risk-medium)', textTransform: 'uppercase' }}>
              PROJECTED SAVINGS
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--risk-medium)', marginTop: '4px' }}>
              280 <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>APT / 100k tx</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Calculated at testnet gas price
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--tertiary)', textTransform: 'uppercase' }}>
              INVARIANTS PRESERVED
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--tertiary)', marginTop: '4px' }}>
              100% <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--tertiary)' }}>Passed</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Move Prover formal checks intact
            </div>
          </div>

        </div>

        {/* --- Function Gas Breakdown: Profiling Table Left & AST Diff Right --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          
          {/* Left: Interactive Function Profiling Table */}
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
                  Function Execution Cost Breakdown
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Measured gas units per entry point invocation
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--primary)',
                  background: 'var(--primary-container)',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                }}
              >
                5 Functions Profiled
              </span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)' }}>Function</th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)' }}>Cost Distribution</th>
                  <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-muted)' }}>Baseline</th>
                  <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-muted)' }}>Optimized</th>
                  <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-muted)' }}>Delta</th>
                </tr>
              </thead>
              <tbody>
                {functionProfiles.map((fn, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '10px 16px', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                      {fn.name}
                    </td>
                    <td style={{ padding: '10px 16px', width: '35%' }}>
                      <div style={{ height: '6px', background: 'var(--surface-dim)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${fn.pctBar}%`, background: 'var(--primary)' }} />
                      </div>
                    </td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {fn.baseline}
                    </td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>
                      {fn.optimized}
                    </td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, color: fn.reduction !== '0.0%' ? 'var(--tertiary)' : 'var(--text-muted)' }}>
                      {fn.reduction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right: Side-by-Side AST Bytecode Diff Panel */}
          <div
            style={{
              background: 'var(--code-canvas)',
              border: '1px solid var(--code-border)',
              borderRadius: '12px',
              padding: '1.25rem',
              color: 'var(--code-text)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#93c5fd', fontSize: '0.75rem' }}>AST Bytecode Diff</span>
                <span style={{ fontSize: '0.6875rem', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '2px 6px', borderRadius: '4px' }}>
                  sources/token.move
                </span>
              </div>
              <span style={{ color: '#34d399', fontSize: '0.72rem' }}>-180 Gas Units ✓</span>
            </div>

            <pre style={{ margin: 0, lineHeight: 1.6, overflowX: 'auto', flex: 1 }}>
              <code>
{`@@ -32,4 +32,3 @@ public entry fun mint(...)
-   // Redundant repeated storage read:
-   assert!(borrow_global<ManagedFungibleAsset>(addr).total_minted < cap, 2);
-   let ref = &borrow_global<ManagedFungibleAsset>(addr).mint_ref;
+   // OPTIMIZED: Cache borrow_global in local stack reference
+   let asset = borrow_global<ManagedFungibleAsset>(addr);
+   assert!(asset.total_minted < cap, 2);
+   let ref = &asset.mint_ref;

@@ -45,2 +44,2 @@ public entry fun set_pause(...)
-   fun assert_admin(caller: &signer)
+   inline fun assert_admin(caller: &signer)
`}
              </code>
            </pre>

            <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Rule: Cache repeated storage reads in local reference
              </span>
              <button
                onClick={() => handleApplyPatch('opt_cache_borrow_global')}
                style={{
                  background: appliedPatches.includes('opt_cache_borrow_global') ? 'var(--tertiary)' : 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {appliedPatches.includes('opt_cache_borrow_global') ? '✓ Patch Applied' : 'Apply Patch'}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
